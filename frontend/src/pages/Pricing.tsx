import { Header } from "@/components/custom/Header"
import { PricingTable } from "@clerk/clerk-react"

export const Pricing=()=>{
    return (
        <div>
            <Header/>
            <div className="flex items-center justify-center min-j-[80vh] mt-20">
                <div className="text-center max-w-4xl w-full px-4">
                    <h2 className="font-bold text-3xl mb-2">Pricing</h2>
                    <p className="text-gray-600 mb-8">Start Creating unlimited PPT sliders</p>
                    <div className="flex justify-center">
                        <PricingTable/>
                    </div>
                </div>
            </div>
        </div>
    )
}