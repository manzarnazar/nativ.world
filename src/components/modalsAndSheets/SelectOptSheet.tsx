import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Typography } from "../storyBook/atoms/Typography"
import { PiCaretDown } from "react-icons/pi"
import { SelectOptProps } from "../storyBook/atoms/SelectOpt"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const SelectOptSheet: React.FC<SelectOptProps> = ({
    options,
    value,
    onChange,
    placeholder,
}) => {

    return (
        <div className="md:hidden">
            <Drawer>
                <DrawerTrigger className={`border border-gray-200 md:border-black py-2 px-4 rounded-lg h-9 md:h-auto bodyBg md:bg-white md:rounded-full flexCenter gap-2 text-sm md:text-base`}>
                    <Typography variant="h6" weight="regular" children={placeholder} />
                    <PiCaretDown className="md:text-2xl" color='#000' />
                </DrawerTrigger>
                <DrawerContent className="p-4">
                    <DrawerHeader className="text-start! px-0! border-b">
                        <DrawerTitle>{placeholder}</DrawerTitle>
                    </DrawerHeader>

                    <RadioGroup defaultValue="option-one" className="flex flex-col gap-4 py-4" value={value} onValueChange={onChange}>
                        {
                            options.map((opt) => {
                                return (
                                    <DrawerClose>
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor={opt.label}>{opt.label}</Label>
                                            <RadioGroupItem value={opt.value} id={opt.label} />
                                        </div>
                                    </DrawerClose>
                                )
                            })
                        }
                    </RadioGroup>

                </DrawerContent>
            </Drawer>
        </div>
    )
}

export default SelectOptSheet
