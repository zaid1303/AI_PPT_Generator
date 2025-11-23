import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import { Link, useLocation } from "react-router-dom";
import { Header } from "@/components/custom/Header";
import { PromptBox } from "@/components/custom/PromptBox";
import { MyProject } from "@/components/custom/MyProject";

export const WorkSpace=()=>{
    const {user,isLoaded}=useUser();
    const location=useLocation();
    

    if(!user && isLoaded){
        return(
            <div>
                <div>Please sign in to access the workspace.</div>
                <Link to='/'>
                    <Button>Sign In</Button>
                </Link>
            </div>
        )    
    }
    return (
        <div>
            <Header/>
            {location.pathname==='/workspace' && <div>
                    <PromptBox/>
                    <MyProject/>
                </div>
            }
        </div>
    )
}