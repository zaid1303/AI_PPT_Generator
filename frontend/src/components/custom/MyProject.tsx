import { ArrowUpRightIcon, FolderIcon } from "lucide-react"
import { Button } from "../ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from "../ui/empty"
import { useEffect, useState } from "react"
import type { Project } from "@/pages/Outline"
import { collection, getDocs, query, where } from "firebase/firestore"
import { firebaseDb } from "../../../config/FirebaseConfig"
import { useUser } from "@clerk/clerk-react"
import ppt_icon from "../../assets/ppt.png"
import moment from "moment";
import { Link } from "react-router-dom"

export const MyProject = ()=>{

    const [project,setProject]=useState<Project[]>([]);
    const {user}=useUser();

    useEffect(()=>{
        user && GetProjects();
    },[user])

    const GetProjects=async ()=>{
        const q=query(collection(firebaseDb,"projects"),where("createdBy","==",user?.primaryEmailAddress?.emailAddress??''));
        const querySnapshot=await getDocs(q);
        querySnapshot.forEach((doc)=>{
            setProject((prev:any)=>[...prev,doc.data()]);
        })
    }

    const formatdate=(timestamp:any)=>{
        const formated=moment(timestamp).fromNow();
        return formated;
    }

    return (
        <div className="mx-32 mt-15">
            <div className="flex justify-between items-center">
                <h2 className="font-bold text-2xl">My Projects</h2>
                <Button>* Create New Project</Button>
            </div>
            <div>
                {!project?.length?<Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <FolderIcon/>
                        </EmptyMedia>
                        <EmptyTitle>No Project Yet</EmptyTitle>
                        <EmptyDescription>
                            You haven't created any project yet. Get started by creating your first project.
                        </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        <div className="flex gap-2">
                        <Button>Create Project</Button>
                        {/* <Button variant="outline">Import Project</Button> */}
                        </div>
                    </EmptyContent>
                    <Button
                        variant="link"
                        asChild
                        className="text-muted-foreground"
                        size="sm"
                    >
                        <a href="#">
                        Learn More <ArrowUpRightIcon />
                        </a>
                    </Button>
                </Empty>:
                <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4 mb-5">
                    {project.map((p,index)=>(
                        <Link to={'/workspace/project/'+p.projectId+'/editor'}>
                            <div key={index} className="p-4 border rounded-2xl shadow mt-3 space-y-1">
                                <img src={ppt_icon} width={50} height={50}/>
                                <h2 className="font-semibold text-lg">{p?.userInputPrompt}</h2>
                                <h2 >Total: {p?.slides?.length}</h2>
                                <p className="text-gray-500">{formatdate(p?.createdAt)}</p>
                            </div>
                        </Link>
                    ))}
                </div>
                }
            </div>
        </div>
    )
}