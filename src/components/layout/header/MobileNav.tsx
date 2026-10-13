'use client'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { PiCaretRight, PiList } from 'react-icons/pi'
import { NavLinksType } from '@/types/GlobalTypes'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { currentLangCodeSelector } from "@/redux/reducers/languageSlice"
import ImagePreview from "@/components/storyBook/atoms/ImagePreview"
import { settingsSelector } from "@/redux/reducers/settingsSlice"
import { BasicDetails } from "@/hooks/queries/useSettings"

const MobileNav = ({ navLinks }: { navLinks: NavLinksType[] }) => {

    const settingsData = useSelector(settingsSelector);
    const logo = settingsData?.branding?.logo

    const [isClient, setIsClient] = useState(false)
    const pathname = usePathname();
    const langCode = useSelector(currentLangCodeSelector);

    useEffect(() => {
        setIsClient(true)
    }, [])
    return (
        isClient &&
        <div>
            <Sheet>
                <SheetTrigger className='border-black rounded-full text-black border p-1'>
                    <PiList size={24} color='#000' />
                </SheetTrigger>
                <SheetContent className="px-6">
                    <SheetHeader>
                        <SheetTitle className="hidden"></SheetTitle>
                        <div>
                            <Link href={`/${langCode}`} title='WRTeam Logo'>
                                <div className='w-auto! h-[56px]!'>
                                    <ImagePreview src={logo} alt='WRTeam Logo' className='w-auto!' containerClassName="items-start! justify-start!" />
                                </div>
                            </Link>
                        </div>
                    </SheetHeader>
                    <nav className='flex flex-col gap-6'>
                        {navLinks.map((item) => (
                            <SheetClose asChild key={item.id}>
                                <Link href={item.link} className={`border rounded-xl p-3 flex items-center justify-between gap-3 textPrimaryColor ${pathname === item.link ? 'primaryLightBg primaryLightBorderColor' : ''} `}>
                                    <span className="flex items-center gap-2">
                                        <span className="text-xl">{item.icon}</span>
                                        <span>{item.label}</span>
                                    </span>
                                    <span className="text-xl"><PiCaretRight /></span>
                                </Link>
                            </SheetClose>
                        ))}
                    </nav>
                </SheetContent>
            </Sheet>
        </div>
    )
}

export default MobileNav
