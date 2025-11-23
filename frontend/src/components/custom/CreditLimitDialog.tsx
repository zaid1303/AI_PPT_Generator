
import { Link } from "react-router-dom"
import { AlertDialog,AlertDialogAction,AlertDialogCancel,AlertDialogContent,AlertDialogDescription,AlertDialogFooter,AlertDialogHeader,AlertDialogTitle, } from "../ui/alert-dialog"

type props={
    openAlert:boolean,
    setOpenDialog:any
}

export const CreditLimitDialog=({openAlert,setOpenDialog}:props)=>{
    return (
        <div>
            <AlertDialog open={openAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Opps!
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            You don't have any Free Credits left, Join Unlimited Project create plan
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={()=>setOpenDialog(false)}>Cancel</AlertDialogCancel>
                        <Link to={'/pricing'}>
                            <AlertDialogAction>
                                Subscribe
                            </AlertDialogAction>
                        </Link>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}