import { ArrowRight, Loader2Icon, Sparkles, X } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

type props={
    position:{x:number,y:number}|null,
    onClose:()=>void,
    handleAiChange:any,
    loading:boolean
}

export const FloatingAction=({position,onClose,handleAiChange,loading}:props)=>{

    const [userprompt,setUserPrompt]=useState<string>('')
    if(!position) return null;
    
    return (
        <div 
            className="absolute z-50 bg-white text-sm px-3 py-2 rounded-lg border flex shadow-xl items-center" 
            style={{
                top: `${position.y + 8}px`,
                left: `${position.x}px`,
                transform: "translateX(-50%)"
            }}
        >
            <div className="flex gap-2 items-center">
                <Sparkles className="h-4 2-4"/>
                <input type="text" placeholder="Edit with AI" className="outline-none border-none" onChange={(e)=>setUserPrompt(e.target.value)} disabled={loading}
                value={userprompt}
                />
                {userprompt && <Button variant={'ghost'} size={'icon-sm'} onClick={()=>handleAiChange(userprompt)}>
                        <ArrowRight className="h-4 w-4"/>
                    </Button>
                }
                {loading && <Loader2Icon className="animate-spin"/>}
            </div>
            <Button variant={'ghost'} size={'icon-sm'} onClick={onClose}><X/></Button>
        </div>
    )
}