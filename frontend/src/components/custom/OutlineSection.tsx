import type { Outline } from "@/pages/Outline"
import { Skeleton } from "../ui/skeleton"
import { Button } from "../ui/button"
import { ArrowRight, Edit, Sparkles } from "lucide-react"
import { EditOutlineDialog } from "./EditOutlineDialog"

type props={
    loading:boolean,
    outline:Outline[],
    handleUpdateOutline:any
}

export const OutlineSection=({loading,outline,handleUpdateOutline}:props)=>{


    return (
        <div className="mt-15">
            <h2 className="font-bold text-xl">Sliders Outline</h2>
            {loading && <div className="mb-10">
                    {
                        [1,2,3,4].map((item,index)=>(
                            <Skeleton key={index} className="h-[60px] w-full rounded-2xl mb-4"/>
                        ))
                    }
                </div>    
            }
            <div className="mb-5">
                {outline?.map((item,index)=>(
                    <div key={index} className="p-3 rounded-xl bg-white flex gap-6 items-center border mt-5 px-6">
                        <div className="flex gap-6 items-center">
                            <h2 className="font-bold p-5 bg-gray-200 rounded-2xl">{index+1}</h2>
                            <div>
                                <h2 className="font-bold text-lg">{item.slidePoint}</h2>
                                <p className="text-gray-500">{item.outline}</p>
                            </div>
                        </div>
                        <EditOutlineDialog outlineData={item} onUpdate={handleUpdateOutline}>
                            <Button variant={'ghost'} size={'icon-lg'}><Edit/></Button>
                        </EditOutlineDialog>
                    </div>
                ))}
            </div>
        </div>
    )
}