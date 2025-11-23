import { Play } from "lucide-react"
import { Button } from "../ui/button"
import { HeroVideoDialog } from "../ui/hero-video-dialog"
import { SignInButton, useUser } from "@clerk/clerk-react"
import { Link } from "react-router-dom"


export const Hero = ()=>{
    const {user}=useUser();

    return (
        <div className="flex flex-col items-center justify-center mt-25 space-y-4">
            <h2 className="font-bold text-5xl">Transform Content into Captivating Presentationn⚡</h2>
            <p className="text-xl text-gray-500 max-w-2xl text-center">Generate sleek, editable PPT decks in minutes. AI handles slide design, formatting, and visual content so you can focus on your message, impress your audience, and work smarter, not harder.</p>
            <div className="flex gap-5 mt-10">
                <Button variant={'outline'} size={'lg'}>Watch Video <Play/></Button>
                {!user?
                    <SignInButton mode="modal">
                        <Button size={'lg'}>Get Started</Button>
                    </SignInButton>  
                    :<Link to="/workspace">
                        <Button size={'lg'}>Go to WorkSpace</Button>
                    </Link>
                }
            </div>
            <div className="relative max-w-3xl mt-15">
                <h2 className="text-center font-semibold my-4">Watch how to create AI PPT.</h2>
                <HeroVideoDialog
                    className="block dark:hidden"
                    animationStyle="from-center"
                    videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
                    thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
                    thumbnailAlt="Hero Video"
                />
                <HeroVideoDialog
                    className="hidden dark:block"
                    animationStyle="from-center"
                    videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
                    thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
                    thumbnailAlt="Hero Video"
                />
                </div>
        </div>
    )
}