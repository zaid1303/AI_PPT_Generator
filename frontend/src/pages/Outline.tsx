import { Header } from "@/components/custom/Header";
import { firebaseDb, GeminiModel } from "../../config/FirebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import {  useNavigate, useParams } from "react-router-dom"
import { SliderStyle, type DesignStyles } from "@/components/custom/SliderStyle";
import { OutlineSection } from "@/components/custom/OutlineSection";
import { ArrowRight, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth} from "@clerk/clerk-react";
import { UserDetailsContext } from "../../context/UserDetailsContext";
import { CreditLimitDialog } from "@/components/custom/CreditLimitDialog";

const Outline_Prompt = `Generate a PowerPoint slide outline for the topic {userInput}. Create {NoOfSliders} slides in total. Each slide should include a topic
        name and a 2-line descriptive outline that clearly explains what content the
        slide will cover.

        Include the following structure:
        The first slide should be a Welcome screen.
        The second slide should be an Agenda screen.
        The final slide should be a Thank You screen.

        Return the response only in JSON format, following this schema:
        [
        {
            "slideNo": "",
            "slidePoint": "",
            "outline": ""
        }
        ]
`

// const Dummy=[
//   {
//     "slideNo": "1",
//     "slidePoint": "Welcome to Health Awareness: Air Pollution",
//     "outline": "Join us to understand the critical link between air quality and your health.\nLearn how to breathe cleaner and live healthier in today's environment."
//   },
//   {
//     "slideNo": "2",
//     "slidePoint": "Presentation Agenda",
//     "outline": "We'll explore the basics of air pollution, its serious health impacts, and practical prevention steps.\nThis session aims to empower you with knowledge for better respiratory well-being."
//   },
//   {
//     "slideNo": "3",
//     "slidePoint": "What is Air Pollution?",
//     "outline": "Understand what constitutes air pollution, identifying common indoor and outdoor sources.\nWe'll cover the invisible pollutants that silently affect our daily lives and health."
//   },
//   {
//     "slideNo": "4",
//     "slidePoint": "How Air Pollution Harms Your Health",
//     "outline": "Discover the acute and chronic health consequences, from respiratory issues to cardiovascular diseases.\nLearn how different pollutants impact various body systems and overall well-being."
//   },
//   {
//     "slideNo": "5",
//     "slidePoint": "Steps to Reduce Your Exposure",
//     "outline": "Explore practical measures and lifestyle changes to minimize personal exposure to air pollutants.\nEmpower yourself with actionable strategies for cleaner air both indoors and outdoors."
//   },
//   {
//     "slideNo": "6",
//     "slidePoint": "Thank You & Questions",
//     "outline": "We appreciate your participation in this vital health awareness session.\nPlease feel free to ask any questions you have regarding air pollution and health."
//   }
// ];


export type Project = {
    userInputPrompt: string,
    projectId: string,
    createdAt: string,
    noOfSlider: string,
    outline: Outline[],
    slides:any[],
    designStyle:DesignStyle
}

export type Outline = {
    slideNo:string,
    slidePoint:string,
    outline:string
}

export type DesignStyle={
    colors:any,
    designGuide:string,
    styleName:string
}


export const Outline = () => {
    const { id } = useParams();
    const navigate=useNavigate();
    const [projectDetail, setProjectDetail] = useState<Project | null>();
    const [loading, setLoading] = useState(false);
    const [UpdateDbloading, setUpdateDbLoading] = useState(false);
    const [outline,setoutline]=useState<Outline[]>([]);
    const [selectedStyle,setSelectedStyle]=useState<DesignStyles>()
    const {userDetail,setUserDetail}=useContext<any>(UserDetailsContext);
    const [openDialog,setOpenDialog]=useState(false);
    const {has}=useAuth();
    const hasUnlimitedAccess = has&&has({plan:'unlimited'})

    useEffect(() => {
        id && GetProjectDetail();
    }, [id])

    const GetProjectDetail = async () => {
        const docRef = doc(firebaseDb, "projects", id ?? ' ');
        const docSnap: any = await getDoc(docRef);
        if (!docSnap.exists()) {
            return;
        }
        setProjectDetail(docSnap.data());
        console.log(docSnap.data());
        if (!docSnap.data()?.outline) {
            GenerateSlidersOutline(docSnap.data());
        }
    }

    const GenerateSlidersOutline = async (projectdata: Project) => {
        setLoading(true);
        const prompt = Outline_Prompt.replace('{userInput}', projectdata?.userInputPrompt).replace('{NoOfSliders}', projectdata?.noOfSlider)

        // To generate text output, call generateContent with the text input
        const result = await GeminiModel.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        console.log(text);
        const rawjson=text.replace('```json','').replace('```','');
        const jsondata=JSON.parse(rawjson);
        setoutline(jsondata);
        setLoading(false);
    }

    const handleUpdateOutline=(index:string,value:Outline)=>{
        setoutline((prev)=>
            prev.map((item)=>
                item.slideNo===index?{...item,...value}:item
            )
        )
    }

    const onGeneratorSlider= async()=>{
        if(userDetail?.credits<=0 && !hasUnlimitedAccess){
            setOpenDialog(true);
            return ;
        }
        //update db
        console.log("Button clicked");   // ADD THIS
        setUpdateDbLoading(true);
        console.log("Updating DB...");
        await setDoc(doc(firebaseDb,'projects',id??''),{
            designStyle:selectedStyle,
            outline:outline
        },{
            merge:true
        })
        !hasUnlimitedAccess && await setDoc(doc(firebaseDb,"users",userDetail?.email??''),{
            credits:userDetail?.credits-1
        },{
            merge:true
        })

        !hasUnlimitedAccess && setUserDetail((prev:any)=>({
            ...prev,
            credits:userDetail?.credits-1
        }))

        console.log("DB Updated");       // ADD THIS
        setUpdateDbLoading(false);
        console.log("Navigating...");
        navigate(`/workspace/project/${id}/editor`);
    }

    return (
        <div>
            <Header />
            <div className="flex justify-center mt-20">
                <div className="max-w-3xl w-full">
                    <h2 className="font-bold text-2xl">Settings and Slider Outline</h2>
                    <SliderStyle selectStyle={(value:DesignStyles)=>setSelectedStyle(value)} />
                    <OutlineSection loading={loading} outline={outline||[]} handleUpdateOutline={(index:string,value:Outline)=>handleUpdateOutline(index,value)}/>
                </div>
                    <Button size={'lg'} className="fixed bottom-6 transform left-1/2 -translate-x-1/2 cursor-pointer" onClick={onGeneratorSlider} disabled={UpdateDbloading||loading}>
                    {UpdateDbloading && <Loader2Icon className="animate-spin"/>}
                    Generate Sliders <ArrowRight/></Button>
                    <CreditLimitDialog openAlert={openDialog} setOpenDialog={setOpenDialog}/>
            </div>
        </div>
    )
}