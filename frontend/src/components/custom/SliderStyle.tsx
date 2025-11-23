import { useState } from 'react'
import dark from '../../assets/dark.jpg'
import MinWhite from '../../assets/Minimalist-White.jpg'
import modgrad from '../../assets/modern-gradient.jpg'
import pastel from '../../assets/pastel-ppt.jpg'
import prof from '../../assets/professional.jpg'
import tech from '../../assets/tech.jpg'

type Props={
    selectStyle:any
}

export type DesignStyles={
    styleName:string,
    colors:any,
    designGuide:string,
    icon:string,
    bannerImage:any
}

export const SliderStyle=({selectStyle}:Props)=>{

    const Design_Styles=[
  {
    "styleName": "Professional Blue 💼",
    "colors": {
      "primary": "#0A6C02",
      "secondary": "#A04C2C",
      "accent": "#1C1C1C",
      "background": "#FFFFFF",
      "gradient": "linear-gradient(135deg, #0A6C02, #E8F0FE)"
    },
    "designGuide": "🧠 Create a professional, corporate-style presentation with blue tones, subtle gradients, clean layouts, and white space. Use subtle gradients and geometric backgrounds for a trustworthy business feel.",
    "icon": "Briefcase",
    "bannerImage": prof
  },
  {
    "styleName": "Minimal White ⚪",
    "colors": {
      "primary": "#1C1C1C",
      "secondary": "#AAAAAA",
      "accent": "#FFFFFF",
      "background": "#F4F4F4",
      "gradient": "linear-gradient(135deg, #FFFFFF, #DEEDDD)"
    },
    "designGuide": "🧠 Generate a minimalist slide deck with white, light grey accents. Keep layouts clean, use white and light grey backgrounds, and emphasize typography with a very simple design.",
    "icon": "Square",
    "bannerImage": MinWhite
  },
  {
    "styleName": "Modern Gradient 🌈",
    "colors": {
      "primary": "#82A8E2",
      "secondary": "#2F2F2F",
      "accent": "#1C1C1C",
      "background": "#FFFFFF",
      "gradient": "linear-gradient(135deg, #82A8E2, #92F9F9)"
    },
    "designGuide": "🧠 Design a modern gradient-style PPT with gradient backgrounds, glassmorphism overlays, and smooth transitions. Use modern fonts, vibrant colors, and clean, tech-savvy vibe.",
    "icon": "Sparkles",
    "bannerImage": modgrad
  },
  {
    "styleName": "Elegant Dark 🖤",
    "colors": {
      "primary": "#0D0D0D",
      "secondary": "#1F1F1F",
      "accent": "#D4AF37",
      "background": "#0D0D0D",
      "gradient": "linear-gradient(135deg, #0D0D0D, #1F1F1F)"
    },
    "designGuide": "🧠 Create a luxury-style dark presentation with black and gold tones, serif fonts, and subtle lighting effects. Keep it premium, cinematic, and elegant.",
    "icon": "Star",
    "bannerImage": dark
  },
  {
    "styleName": "Creative Pastel 🎨",
    "colors": {
      "primary": "#F6D6FF",
      "secondary": "#B4F8C8",
      "accent": "#A0E7E5",
      "background": "#FFFFFF",
      "gradient": "linear-gradient(135deg, #F6D6FF, #A0E7E5, #B4F8C8)"
    },
    "designGuide": "🧠 Build a creative pastel-style presentation with soft tones and hand-drawn illustrations. Ideal for design portfolios or fun workshops.",
    "icon": "Palette",
    "bannerImage": pastel
  },
  {
    "styleName": "Startup Pitch 🚀",
    "colors": {
      "primary": "#0052CC",
      "secondary": "#36B37E",
      "accent": "#FF5630",
      "background": "#FFFFFF",
      "gradient": "linear-gradient(135deg, #0052CC, #36B37E)"
    },
    "designGuide": "🧠 Design a sleek startup pitch presentation with blue-green tones, bold headings, clean data charts, and a clean-screen solution layout. Keep slides dynamic and investor-focused.",
    "icon": "Rocket",
    "bannerImage": tech
  }
]


    const [SelectedStyle,setSelectedStyle]=useState<string>();

    return (
        <div className="mt-5">
            <h2 className="font-bold text-xl">Select Slider Style</h2>
            <div className='grid grid-cols-2 md:grid-cols-3 gap-5 mt-4'>
                {Design_Styles.map((design,index)=>(
                    <div key={index} className={`cursor-pointer ${design.styleName==SelectedStyle?'p-2 border-2 border-primary rounded-2xl':''}`} onClick={() => {
                    setSelectedStyle(design.styleName);
                    selectStyle(design);
                }}
>
                        <img src={design.bannerImage} alt={design.styleName} width={300} height={300} className={`w-full h-[150px] rounded-2xl object-cover ${design.styleName!=SelectedStyle?'hover:scale-105 transition-all':''}`}/>
                        <h2 className='font-medium text-center mt-1'>{design.styleName}</h2>
                    </div>   
                ))}
            </div>
        </div>
    )
}