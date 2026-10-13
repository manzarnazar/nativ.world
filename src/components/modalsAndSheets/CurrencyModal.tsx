'use client'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { PiCaretDown } from "react-icons/pi"
import { useEffect, useState } from "react"
import { useTranslation } from "@/hooks/useTranslation"
import { CurrencyDataType, useCurrencies } from "@/hooks/queries/general/useCurrencies"
import { useDispatch, useSelector } from "react-redux"
import { currentCurrencySelector, setCurrentCurrency } from "@/redux/reducers/currencySlice"
import { setCurrencyCookie } from "@/utils/currencyCookie"
import { usePathname } from "next/navigation"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"


const CurrencyModal = ({ footer, open: controlledOpen, onOpenChange: controlledOnOpenChange }: { footer?: boolean, open?: boolean, onOpenChange?: (open: boolean) => void }) => {

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const pathName = usePathname();
    const isAccPage = pathName?.includes('account');

    const currentCurrency = useSelector(currentCurrencySelector);

    const [internalOpen, setInternalOpen] = useState<boolean>(false);
    const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
    const setIsOpen = controlledOnOpenChange ?? setInternalOpen;

    const { data, isLoading, error, isError } = useCurrencies();

    const currencies = data?.data?.items || [];

    useEffect(() => {
        if (isError) {
            console.log("error in currencies api =>", error);
        }
    }, [isError]);

    const currentCurrenyCode = currentCurrency?.currency_code

    const handleChangeCurrency = (currency: CurrencyDataType) => {
        dispatch(setCurrentCurrency(currency))
        setCurrencyCookie(currency.currency_code)
        setIsOpen(false);
    }

    return (
        currencies?.length > 1 &&
        <div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                {
                    !isAccPage &&
                    <DialogTrigger asChild>
                        {
                            currentCurrenyCode ?
                                <div role="button" tabIndex={0} className={`${footer && 'bg-white textPrimaryColor'} flexCenter gap-1 border borderColor rounded-full p-2 cursor-pointer`}>
                                    <span>{currentCurrency?.currency_symbol} {currentCurrency?.currency_code}</span>
                                    <span><PiCaretDown /></span>
                                </div>
                                :
                                <div role="button" tabIndex={0} className={`${footer && 'bg-white textPrimaryColor'} flexCenter gap-1 border borderColor rounded-full p-2 cursor-pointer`}>
                                    <span>{t('changeCurrency')}</span>
                                    <span><PiCaretDown /></span>
                                </div>
                        }
                    </DialogTrigger>
                }
                <DialogContent className={`${isAccPage ? 'overflow-x-hidden overflow-y-auto overscroll-y-contain max-w-full! max-h-full! h-full! rounded-none' : ''} sm:max-w-200 p-0`}>
                     <div>

                    <DialogHeader className='p-6'>
                        <DialogTitle>{t("selectCurrency")}</DialogTitle>
                    </DialogHeader>

                    {isAccPage ? (
                        <div className='border-t borderColor p-6 flex flex-col gap-4'>
                            {isLoading && currencies.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    {t("loading_languages")}
                                </div>
                            ) : currencies.length > 0 ? (
                                <RadioGroup
                                    value={currentCurrenyCode}
                                    className="flex flex-col gap-4"
                                >
                                    {currencies.map((currency) => (
                                        <div
                                            className={`flexCenter justify-between border borderColor rounded-xl cursor-pointer p-4 transition-all duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            key={currency?.country_name}
                                            onClick={() => handleChangeCurrency(currency)}
                                        >
                                            <div className="flex flex-col gap-1">
                                                <div className='flex gap-1'>
                                                    <span>{currency?.currency_symbol}</span>
                                                    <span>-</span>
                                                    <span>{currency?.currency_code}</span>
                                                </div>
                                                <span className="textSecondaryColor text-sm">{currency?.currency_name}</span>
                                            </div>
                                            <RadioGroupItem value={currency?.currency_code} id={currency?.country_name} className="pointer-events-none" />
                                        </div>
                                    ))}
                                </RadioGroup>
                            ) : (
                                <div className="text-center py-8 textSecondaryColor">
                                    {t("no_languages_available")}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className='border-t borderColor p-6 grid grid-cols-2 sm:grid-cols-3 gap-6'>
                            {isLoading && currencies.length === 0 ? (
                                <div className="col-span-full text-center py-8 text-gray-500">
                                    {t("loading_languages")}
                                </div>
                            ) : currencies.length > 0 ? (
                                currencies.map((currency) => (
                                    <div
                                        className={`flexCenter justify-start gap-1 border borderColor rounded-xl cursor-pointer p-4 transition-all duration-200 ${currentCurrenyCode === currency?.currency_code
                                            ? 'border-2 primaryBorder bg-primaryColor/5'
                                            : 'hover:border-primaryColor/50'
                                            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        key={currency?.country_name}
                                        onClick={() => handleChangeCurrency(currency)}
                                    >
                                        <div className="flex flex-col gap-1">
                                            <div className='flex gap-1'>
                                                <span>{currency?.currency_symbol}</span>
                                                <span>-</span>
                                                <span className={currentCurrenyCode === currency?.country_name ? 'font-semibold' : ''}>
                                                    {currency?.currency_code}
                                                </span>
                                            </div>
                                            <span className="textSecondaryColor text-sm">{currency?.currency_name}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-8 textSecondaryColor">
                                    {t("no_languages_available")}
                                </div>
                            )}
                        </div>
                    )}
                     </div>

                </DialogContent>
            </Dialog>
        </div>
    )
}

export default CurrencyModal