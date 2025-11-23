import { firebaseDb, GeminiModel } from "../../../config/FirebaseConfig"
import { doc, setDoc } from "firebase/firestore"
import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { FloatingAction } from "./FloatingAction"

type props={
    slide:{code:string},
    colors:any,
    setUpdateSlider:any
}

const HTML_DEFAULT = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name"viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="AI Website Builder - Modern TailwindCSS Flowbite Template"> 
    <title>AI Website Builder</title>
    <script src="https://cdn.tailwindcss.com"></script>

    <script>
        tailwind.config = {
        theme: {
            extend: {
                colors: {colorCodes},
                    backgroundImage: {
                        gradient: 'linear-gradient(90deg, #6366F1 0%, #10B981 100%)',
                    },
                },
            },
        };
    </script>

    <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"></script>

    <!-- Font Awesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5Wk+zQj+Mj7Vp7k8E5x29nLNX6j+CWeN/Xg7fGq0pM8R1+a5/fQ1fJb01Tz2uE5wP5yQ5uI5uA=="
    crossorigin="anonymous" referrerpolicy="no-referrer" />

    <!-- Chart.js for charts & graphs -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    <!-- AOS (Animate On Scroll) for scroll animations -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js"></script>

    <!-- GSAP (GreenSock) for advanced animations -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>

    <!-- Lottie for JSON-based animations -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.11.2/lottie.min.js"></script>

    <!-- Swiper.js for sliders/carousels -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css" />
    <script src="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js"></script>

    <!-- Optional: Tooltip & Popover library (Tippy.js) -->
    <link rel="stylesheet" href="https://unpkg.com/tippy.js@6/dist/tippy.css" />

    <script src="https://unpkg.com/@popperjs/core@2"></script>
    <script src="https://unpkg.com/tippy.js@6"></script>
</head>
{code}
</html>`

export const SliderFrame=({slide,colors,setUpdateSlider}:props)=>{
    const {id}=useParams();
    console.log(slide?.code);

    const Final_Code=HTML_DEFAULT.replace("{colorCodes}",JSON.stringify(colors||{})).replace("{code}",slide?.code||'');

    const iframeRef=useRef<HTMLIFrameElement>(null);
    const containerRef=useRef<HTMLDivElement>(null);
    const [loading,setLoading]=useState(false);
    const selectedElRef=useRef<HTMLElement|null>(null);
    const hoverElRef = useRef<HTMLElement | null>(null);
    const [CardPosition, setCardPosition]=useState<{x:number,y:number}|null>(null);


    useEffect(() => {
        if (!iframeRef.current || !slide?.code) return;
        
        const iframe = iframeRef.current;
        const doc = iframe.contentDocument;
        if (!doc) return;

        doc.open();
        doc.write(Final_Code);
        doc.close();

        const handleMouseOver = (e: MouseEvent) => {
            if (selectedElRef.current) return;
            const target = e.target as HTMLElement;
            
            if (hoverElRef.current && hoverElRef.current !== target) {
                hoverElRef.current.style.outline = "";
            }
            
            hoverElRef.current = target;
            hoverElRef.current.style.outline = "2px dotted blue";
        };

        const handleMouseOut = () => {
            if (selectedElRef.current) return;
            if (hoverElRef.current) {
                hoverElRef.current.style.outline = "";
                hoverElRef.current = null;
            }
        };

        const handleClick = (e: MouseEvent) => {
            e.stopPropagation();
            const target = e.target as HTMLElement;

            // Clear previous selection
            if (selectedElRef.current && selectedElRef.current !== target) {
                selectedElRef.current.style.outline = '';
                selectedElRef.current.removeAttribute('contenteditable');
            }

            // Set new selection
            selectedElRef.current = target;
            selectedElRef.current.style.outline = "2px solid blue";
            selectedElRef.current.setAttribute("contenteditable", "true");
            selectedElRef.current.focus();

            console.log("Selected element:", selectedElRef.current);

            // Get element position inside iframe
            const rect = target.getBoundingClientRect();
            
            // Get iframe position relative to parent page
            const iframeRect = iframe.getBoundingClientRect();
            const containerRect = containerRef.current?.getBoundingClientRect();

            if (containerRect) {
                // Combine iframe offset + element offset within iframe
                setCardPosition({
                    x: (iframeRect.left - containerRect.left) + rect.left + rect.width / 2,
                    y: (iframeRect.top - containerRect.top) + rect.bottom
                });
            }
        };

        const handleBlur = () => {
            if (selectedElRef.current) {
                console.log("Final edited element:", selectedElRef.current.outerHTML);
                const updatedSlideCode=iframe.contentDocument?.body?.innerHTML;
                    // console.log(updatedSlideCode);
                setUpdateSlider(updatedSlideCode);
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && selectedElRef.current) {
                selectedElRef.current.style.outline = "";
                selectedElRef.current.removeAttribute("contenteditable");
                selectedElRef.current.removeEventListener("blur",handleBlur);
                // selectedElRef.current = null;
                setCardPosition(null);
            }
        };

        // Add small delay to ensure DOM is ready
        const timer = setTimeout(() => {
            if (doc.body) {
                doc.body.addEventListener("mouseover", handleMouseOver);
                doc.body.addEventListener("mouseout", handleMouseOut);
                doc.body.addEventListener("click", handleClick);
                doc.body.addEventListener("keydown", handleKeyDown);
            }
        }, 100);

        // Cleanup listeners
        return () => {
            clearTimeout(timer);
            if (doc.body) {
                doc.body.removeEventListener("mouseover", handleMouseOver);
                doc.body.removeEventListener("mouseout", handleMouseOut);
                doc.body.removeEventListener("click", handleClick);
                doc.body.removeEventListener("keydown", handleKeyDown);
            }
        };
    }, [slide?.code, Final_Code]);

    const handleAiSectionChange = async (userprompt: string) => {
        setLoading(true);
        const selectedEl = selectedElRef.current;
        const iframe = iframeRef.current;
        if (!selectedEl || !iframe) return;

        // CLEAN old HTML before sending to AI
        const cleanEl = selectedEl.cloneNode(true);
        //@ts-ignore
        cleanEl.style.outline = "";
        //@ts-ignore
        cleanEl.removeAttribute("contenteditable");
        //@ts-ignore
        const oldHTML = cleanEl.outerHTML;

        const prompt = `Regenerate or rewrite the following HTML code base on this user instruction. If user asked to change the image so regenerate the image then make sure to use ImageKit:
            'https://ik.imagekit.io/ikmedia/ik-genimg-prompt-{imagePrompt}/{altImageName}.jpg'
            Replace {imagePrompt} with relevant image prompt and altImageName with a random image name.
            if user want to crop image or remove background or scale image or optimize image then add image kit ai transformation by providing ?tr=fo-auto <other transformation> etc.
            "User Instruction is :${userprompt}"
            HTML code : ${oldHTML}
            `;

        try {
            const result = await GeminiModel.generateContent(prompt);
            const newHTML = (await result.response.text()).trim();

            const tempDiv = iframe?.contentDocument?.createElement("div");
            //@ts-ignore
            tempDiv.innerHTML = newHTML;
            const newNode = tempDiv?.firstElementChild;

            if (newNode && selectedEl.parentNode) {
                // ensure clean output
                newNode.removeAttribute("contenteditable");
                //@ts-ignore
                newNode.style.outline = "";
                
                selectedEl.parentNode.replaceChild(newNode, selectedEl);
                //@ts-ignore
                selectedElRef.current = newNode;

                // Remove outlines/contenteditable globally before saving:
                //@ts-ignore
                iframe.contentDocument.querySelectorAll("[style], [contenteditable]").forEach((el) => {
                    el.removeAttribute("contenteditable");
                    //@ts-ignore
                    if (el.style.outline) {
                        //@ts-ignore
                        el.style.outline = "";
                    }
                });
                //@ts-ignore
                const updatedSlideCode = iframe.contentDocument.body.innerHTML;
                setUpdateSlider(updatedSlideCode);
            }
        }
        catch(err) {
            console.log("AI generation failed:", err);
        }

        setLoading(false);
        setCardPosition(null);
    }

    // ✔ Save slides to Firebase
    const saveAllSlides = async (updatedSlides: any[]) => {
        if (!id) return;

        await setDoc(
            doc(firebaseDb, "projects", id),
            {
                slides: updatedSlides,
            },
            { merge: true }
        );

        console.log("✔ Slides updated to Firestore");
    };

    return (
        <div className="mb-5" ref={containerRef} style={{position: 'relative'}}>
            <iframe
                ref={iframeRef}
                className="w-[800px] h-[500px] border-0 rounded-2xl"
                sandbox="allow-scripts allow-same-origin allow-modals allow-forms allow-popups"
            />
            {CardPosition && 
            <FloatingAction position={CardPosition} onClose={()=>setCardPosition(null)} 
            loading={loading}
            handleAiChange={(value:string)=>handleAiSectionChange(value)}/>}
        </div>
    )
}
