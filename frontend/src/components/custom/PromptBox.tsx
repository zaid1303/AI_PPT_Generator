import { ArrowUp, Loader2Icon, } from "lucide-react"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea } from "../ui/input-group"
import {v4 as uuidv4} from "uuid";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"
import { useState } from "react"
import { useUser } from "@clerk/clerk-react";
import { firebaseDb } from "../../../config/FirebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";


export const PromptBox=()=>{
    const [userInput,setUserInput]=useState<string>();
    const {user}=useUser();
    const [loading,setLoading]=useState(false);
    const [noofslider,setnoofslider]=useState<string>('4 to 6');
    const navigate=useNavigate();
    
    const CreateAndSaveProject= async ()=>{
        //save project to DB
        const projectId=uuidv4();
        setLoading(true);
        await setDoc(doc(firebaseDb,'projects',projectId),{
            projectId:projectId,
            userInputPrompt:userInput,
            createdBy:user?.primaryEmailAddress?.emailAddress,
            createdAt:Date.now(),
            noOfSlider:noofslider
        })
        setLoading(false);
        navigate('/workspace/project/'+projectId+'/outline')
    }

    return (
        <div className="w-full flex items-center justify-center mt-20">
            <div className="flex flex-col items-center justify-center space-y-4">
                <h2 className="font-bold text-4xl">Describe your topic, we'll design the <span className="text-primary">PPT</span> slides!</h2>
                <p className="text-xl text-gray-500">Your Design will be saved as new project.</p>
                <InputGroup>
                    <InputGroupTextarea placeholder="Enter what kind of slider do you want to create?" className="min-h-30"
                    onChange={(event)=>setUserInput(event.target.value)} />
                    <InputGroupAddon align={'block-end'}>
                        {/* <InputGroupButton>
                            <PlusIcon/>
                        </InputGroupButton> */}
                        <Select onValueChange={(value)=>setnoofslider(value)}>
                            <SelectTrigger className="w-{180px}">
                                <SelectValue placeholder="Select No. of Slides"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>No. of Slides</SelectLabel>
                                    <SelectItem value="4 to 6">4-6 Sliders</SelectItem>
                                    <SelectItem value="6 to 8">6-8 Sliders</SelectItem>
                                    <SelectItem value="8 to 12">8-12 Sliders</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <InputGroupButton 
                        className="rounded-full ml-auto" size={'icon-sm'} variant={'default'} onClick={()=>CreateAndSaveProject()}
                        disabled={!userInput}>
                            {loading?<Loader2Icon className="animate-spin"/>:<ArrowUp/>}
                        </InputGroupButton>
                    </InputGroupAddon>
                </InputGroup>
            </div>
        </div>
    )
}