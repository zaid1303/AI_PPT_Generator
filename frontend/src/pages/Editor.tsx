import { Header } from "@/components/custom/Header"
import { firebaseDb, GeminiLiveModel } from "../../config/FirebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import type { Project } from "./Outline";
import { OutlineSection } from "@/components/custom/OutlineSection";
import { SliderFrame } from "@/components/custom/SliderFrame";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";
import PptxGenJS from "pptxgenjs";
import * as htmlToImage from "html-to-image";


const SLIDER_PROMPT = `Generate HTML
(TailwindCSS + Flowbite UI + Lucide Icons) code for a 16:9 ppt slider in Modern Dark style.
{DESIGN_STYLE}. No responsive design; use a fixed 16:9 layout for slides. Use Flowbite component structure. Use different layouts depending on content and style.
Use TailwindCSS colors like primary, accent, gradients, background, etc., and include colors from {COLORS_CODE}.
MetaData for Slider: {METADATA}

Ensure images are optimized to fit within their container div and do not overflow.
Use proper width/height constraints on images so they scale down if needed to remain inside the slide.
Maintain 16:9 aspect ratio for all slides and all media.
Use CSS classes like 'object-cover' or 'object-contain' for images to prevent stretching or overflow.
Use grid or flex layouts to properly divide the slide so elements do not overlap.

Generate Image if needed using:
'https://ik.imagekit.io/ikmedia/ik-genimg-prompt-{imagePrompt}/{altImageName}.jpg' Replace {imagePrompt} with relevant image prompt and altImageName with a random image name.

<!-- Slide Content Wrapper (Fixed 16:9 Aspect Ratio) --> 

<div class="w-[800px] h-[500px] relative overflow-hidden">
    <!-- Slide content here -->
</div>
Also do not add any overlay: Avoid this :
<div class="absolute inset-0 bg-gradient-to-br from-primary to-secondary opacity-20">
</div>
Just provide body content for 1 slider. Make sure all content, including images, stays within the main slide div and preserves the 16:9 ratio.`


const Dummy_Slider=`
<div class="w-[800px] h-[450px] relative overflow-hidden bg-background">
    <!-- Slide Content (Grid Layout) -->
    <div class="grid grid-cols-2 h-full">

        <!-- Left Side: Text Content -->
        <div class="flex flex-col justify-center items-start p-10">
            <h1 class="text-4xl font-semibold text-primary mb-4">
                Welcome to Health Awareness: Air Pollution
            </h1>
            <p class="text-lg text-gray-700">
                Join us to understand the critical link between air quality and your health.
                <br />
                Learn how to breathe cleaner and live healthier in today's environment.
            </p>
            <div class="mt-6">
                <span class="inline-flex items-center rounded-md bg-accent/20 px-2 py-1 text-xs font-medium text-accent ring-1 ring-inset ring-accent/10">Slide 1</span>
            </div>
        </div>

        <!-- Right Side: Image -->
        <div class="flex items-center justify-center">
            <img src="https://ik.imagekit.io/ikmedia/ik-genimg-prompt-Hand-drawn_illustration_of_a_person_wearing_a_mask_in_a_polluted_city_pastel_colors/air-pollution-drawing.jpg" alt="Air Pollution Drawing" class="object-contain max-w-full max-h-full" style="width: 100%; height: auto; max-height: 450px;" />
        </div>

    </div>
</div>
`


export const Editor=()=>{
    const {id}=useParams();
    const [projectDetail,setProjectDetail]=useState<Project|null>();
    const containerRef=useRef<HTMLDivElement|null>(null);
    const [downloading,setDownloading]=useState(false);
    const [loading,setLoading]=useState(false);
    const [sliders,setSliders]=useState<any>([]);
    const [slidesGenerated,setSlidesGenerated]=useState<any>();

    useEffect(() => {
        id && GetProjectDetail();
    }, [id])
    
    const GetProjectDetail = async () => {
        setLoading(true);
        const docRef = doc(firebaseDb, "projects", id ?? ' ');
        const docSnap: any = await getDoc(docRef);
        if (!docSnap.exists()) {
            return;
        }
        setProjectDetail(docSnap.data());
        // console.log(docSnap.data());
        setLoading(false);
    }

    useEffect(()=>{
        if(projectDetail && !projectDetail?.slides?.length){
            GenerateSlides();
        }
        else{
            setSliders(projectDetail?.slides)
        }
    },[projectDetail])

    const GenerateSlides= async ()=>{
        if(!projectDetail?.outline || projectDetail.outline.length===0) return;

        console.log("Starting slide Generation");

        // Initialize empty array with proper length
        const totalSlides = projectDetail.outline.length;
        setSliders(new Array(totalSlides).fill(null));

        for(let index=0; index < totalSlides; index++){
            const metaData=projectDetail?.outline[index];
            const prompt=SLIDER_PROMPT
                .replace('{DESIGN_STYLE}', projectDetail?.designStyle?.designGuide ?? '')
                .replace('{COLORS_CODE}', JSON.stringify(projectDetail?.designStyle?.colors))
                .replace('{METADATA}', JSON.stringify(metaData));

            console.log("Generating slide", index+1);
            await GeminiSlideCall(prompt, index);
            console.log("Successfully Generated Slide", index+1);
        }
        console.log("All slides generated");
        setSlidesGenerated(Date.now());
    }

    const GeminiSlideCall= async (prompt:string,index:number)=>{
        try{
            const session = await GeminiLiveModel.connect();
            await session.send(prompt);

            let text="";

            const messages=session.receive();
            for await (const message of messages){
                if(message.type==="serverContent"){
                    const parts=message.modelTurn?.parts;
                    if(parts && parts.length>0){
                        // Just accumulate text, DON'T update state yet
                        text+=parts?.map((part)=>part.text).join("");
                    }
                    if(message.turnComplete){
                        // NOW update state with complete HTML
                        const finaltext=text.replace(/```html/g,'').replace(/```/g,'').trim();
                        setSliders((prev:any[])=>{
                            const updated=prev?[...prev]:[];
                            updated[index]={code:finaltext};
                            return updated;
                        });
                        console.log("Slide",index+1,"complete");
                        console.log("Final HTML length:", finaltext.length);
                        break;
                    }
                }
            }
            session.close();
        }
        catch(err){
            console.log("Error Generating Slide",index+1,err);
        }
    };

    useEffect(()=>{
        if(slidesGenerated){
            SaveAllSlides();
        }
    },[slidesGenerated])

    const SaveAllSlides=async ()=>{
        await setDoc(doc(firebaseDb,"projects",id??''),{
            slides:sliders
        },{
            merge:true
        })
    }

    const UpdatedSlideCode=(updatedSlideCode:string,index:number)=>{
        setSliders((prev:any)=>{
            const updated=[...prev];
            updated[index]={
                ...updated[index],
                code:updatedSlideCode
            }
            return updated;
        });
        setSlidesGenerated(Date.now());
    }

    const exportAllIframesToPPT = async () =>{
        if(!containerRef.current)return ;
        setDownloading(true);
        const pptx = new PptxGenJS();
        const iframes=containerRef.current.querySelectorAll("iframe");
        for(let i=0;i<iframes.length;i++){
            const iframe=iframes[i] as HTMLIFrameElement;
            const iframeDoc=iframe.contentDocument||iframe.contentWindow?.document;
            if(!iframeDoc) continue;

            const slideNode=iframeDoc.querySelector("body>div")||iframeDoc.body;
            if(!slideNode)continue;
            console.log(`Exporting slide ${i+1}...`);
            //@ts-ignore
            const dataUrl=await htmlToImage.toPng(slideNode,{quality:1});
            const slide=pptx.addSlide();
            slide.addImage({
                data:dataUrl,
                x:0,
                y:0,
                w:10,
                h:5.625
            });
        }
        setDownloading(false);
        pptx.writeFile({fileName:"MyProjectSlides.pptx"});
    };

    return (
        <>
            <Header/>
            <div className="grid grid-cols-5 p-7">
                <div className="col-span-2 h-screen overflow-auto p-4">
                    <OutlineSection outline={projectDetail?.outline??[]}
                    loading={loading}
                    handleUpdateOutline={()=>console.log()}/>
                </div>
                <div className="col-span-3 h-screen overflow-auto" ref={containerRef}>
                    {sliders?.map((slide:any,index:number)=>(
                        <SliderFrame slide={slide} key={index} colors={projectDetail?.designStyle?.colors}
                        setUpdateSlider={(updatedSlideCode:string)=>UpdatedSlideCode(updatedSlideCode,index)}
                        />
                    ))}
                </div>
                <Button onClick={exportAllIframesToPPT} size={'lg'} className="fixed bottom-6 transform left-1/2 -translate-x-1/2 cursor-pointer" disabled={downloading}>{downloading?<Loader2 className="animate-spin"/>:<FileDown/>}Export PPT</Button>
            </div>
        </>
    )
}