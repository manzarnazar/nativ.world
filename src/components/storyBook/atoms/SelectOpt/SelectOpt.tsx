import React from "react"
import { Typography } from "../Typography"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useTranslation } from "@/hooks/useTranslation"
import { SelectOptProps } from "./SelectOpt.type"
import SelectOptSheet from "@/components/modalsAndSheets/SelectOptSheet"

const SelectOpt: React.FC<SelectOptProps> = ({
    options,
    value,
    onChange,
    placeholder,
    triggerClassName = 'lg:w-65',
    className = '',
}) => {

    const { t } = useTranslation();

    return (
        <>
            <div className={`hidden md:flexCenter gap-2 ${className}`}>
                <Typography variant="h6" weight="regular" children={`${t('sortBy')} :`} className="hidden md:block w-max" />
                <Select value={value} onValueChange={onChange}>
                    <SelectTrigger className={`${triggerClassName} textSecondaryColor`}>
                        <SelectValue placeholder={placeholder ?? t('default')} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {options.map((opt, idx) => (
                                <SelectItem value={opt.value} key={idx}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <SelectOptSheet options={options}
                value={value}
                onChange={onChange}
                placeholder={t('sortBy')} />
        </>
    )
}

export default SelectOpt
