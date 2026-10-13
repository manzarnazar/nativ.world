'use client'
import { PiSliders } from "react-icons/pi"
import SidebarFilter from "../storyBook/organisms/SidebarFilter"
import { SidebarFilterTypes } from "@/types/GlobalTypes"
import { Typography } from "../storyBook/atoms/Typography"
import { useTranslation } from "@/hooks/useTranslation"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import Divider from "../storyBook/atoms/Divider"
import { Button } from "../storyBook/atoms/Button"
import { PropertyType } from "@/hooks/queries/useProperties"
import { Facility } from "@/api/server/getHomePageContent"

interface SidebarFilterSheetProps {
    sidebarFilter: SidebarFilterTypes
    setSidebarFilter: React.Dispatch<React.SetStateAction<SidebarFilterTypes>>
    hasActiveFilters?: boolean,
    clearAll: () => void
    priceMin: number
    priceMax: number
    amenities?: Facility[]
    propertyTypes?: PropertyType[]
    pricePrefix: string
    countryId: string | number; 
}

const SidebarFilterSheet = ({ sidebarFilter, setSidebarFilter, hasActiveFilters, clearAll, priceMin, priceMax, amenities, propertyTypes, pricePrefix, countryId }: SidebarFilterSheetProps) => {

    const { t } = useTranslation();

    return (
        <div className="lg:hidden">
            <Drawer>
                <DrawerTrigger className={`${hasActiveFilters && 'primaryBorder! border-2 relative after:absolute after:w-2 after:h-2 after:primaryBg after:rounded-full after:-top-1 md:after:top-1 after:right-0'} border border-gray-200 md:border-black py-2 px-4 rounded-lg h-9 md:h-auto bodyBg md:bg-white md:rounded-full flexCenter gap-2 text-sm md:text-base`}>
                    <PiSliders className="md:text-2xl" color='#000' />
                    <Typography variant="h6" weight="regular" children={t("filters")} />
                </DrawerTrigger>
                <DrawerContent className="p-4">
                    <DrawerHeader className="text-start! px-0! border-b">
                        <DrawerTitle>{t("filters")}</DrawerTitle>
                    </DrawerHeader>
                    <div className="h-139.5 overflow-y-auto pt-4">

                        <SidebarFilter
                            sidebarFilter={sidebarFilter}
                            setSidebarFilter={setSidebarFilter}
                            priceMin={priceMin}
                            priceMax={priceMax}
                            amenities={amenities}
                            propertyTypes={propertyTypes}
                            pricePrefix={pricePrefix}
                            countryId={countryId}
                        />
                    </div>
                    <div className="flexCenter gap-2 bg-white pt-3">
                        <DrawerClose asChild>
                            <Button variant="outline" size="md" children={t('clear')} className="primaryBorder w-full" onClick={() => clearAll()} />
                        </DrawerClose>
                        <DrawerClose asChild>
                            <Button variant="primary" size="md" children={t('apply')} className="w-full" />
                        </DrawerClose>
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    )
}

export default SidebarFilterSheet
