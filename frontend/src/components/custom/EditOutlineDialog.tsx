import { useState } from "react"
import { Button } from "../ui/button"
import { Dialog,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle,DialogTrigger } from "../ui/dialog"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"

export const EditOutlineDialog=({children,outlineData,onUpdate}:any)=>{

    const [localdata,setlocaldata]=useState(outlineData);
    const [opendialog,setOpenDialog]=useState(false);

    const handleChange=(field:string,value:string)=>{
        setlocaldata({...localdata,[field]:value})
    }

    const handleUpdate=()=>{
        onUpdate(outlineData?.slideNo,localdata)
        setOpenDialog(false)
    }

    return (
        <div>
            <Dialog open={opendialog} onOpenChange={setOpenDialog}>
                <DialogTrigger>{children}</DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="font-bold">Edit Slider Outline</DialogTitle>
                        <DialogDescription>
                            <div> 
                                <label className="text-black font-semibold block mb-2">Slider Title</label>
                                <Input placeholder="Slider title" value={localdata.slidePoint} onChange={(event)=>handleChange('slidePoint',event.target.value)}/>
                            </div>
                                <div className="mt-3">
                                    <label className="block text-black font-semibold mb-2">Outline</label>
                                    <Textarea placeholder="outline" value={localdata.outline} onChange={(event)=>handleChange('outline',event.target.value)}/>
                                </div>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant={'outline'} onClick={()=>setOpenDialog(false)}>Close</Button>
                        <Button onClick={handleUpdate}>Update</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}