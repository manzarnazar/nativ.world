'use client'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { PiCaretDown, PiGlobe } from "react-icons/pi"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useTranslation } from "@/hooks/useTranslation"
import { useDispatch, useSelector } from "react-redux"
import { languagesSelector } from "@/redux/reducers/settingsSlice"
import { useLangTranslations } from "@/hooks/queries/useLangTranslations"
import { currentLanguageSelector, setCurrentLanguage, setCurrentTranslations, setIsRTL } from "@/redux/reducers/languageSlice"
import { Language } from "@/hooks/queries/useSettings"
import ImagePreview from "../storyBook/atoms/ImagePreview"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"


const LanguageModal = ({ footer, open: controlledOpen, onOpenChange: controlledOnOpenChange }: { footer?: boolean, open?: boolean, onOpenChange?: (open: boolean) => void }) => {

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const router = useRouter();
    const pathname = usePathname();
    const isConfirmBookingPage = pathname?.includes('/confirm-booking');
    const isAccPage = pathname?.includes('account');

    const [internalOpen, setInternalOpen] = useState(false);
    const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
    const setOpen = controlledOnOpenChange ?? setInternalOpen;

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const languages = useSelector(languagesSelector);
    const currentLanguage = useSelector(currentLanguageSelector);
    const currentLanguageCode = currentLanguage?.code;

    const { data, isFetching, error } = useLangTranslations({ lang_code: currentLanguageCode });

    const translations = data?.data?.translations;

    useEffect(() => {
        if (error) {
            console.log("error in lang translations api =>", error);
        }
        if (translations) {
            dispatch(setCurrentTranslations(translations));
        }
    }, [error, translations]);

    const handleLanguageChange = (language: Language) => {
        if (language?.code === currentLanguageCode) {
            setOpen(false);
            return;
        }
        dispatch(setCurrentLanguage(language));
        dispatch(setIsRTL(language?.is_rtl));

        if (!isConfirmBookingPage) {
            const segments = pathname.split('/');
            segments[1] = language?.code;
            router.push(segments.join('/'));
        }

        setOpen(false);
    };

    const triggerLabel = mounted && currentLanguage?.name
        ? currentLanguage?.name.slice(0, 3)
        : 'Eng';

    const triggerImg = mounted && currentLanguage?.image
        ? currentLanguage?.image
        : null;

    return (
        languages?.length > 1 &&
        <div>
            <Dialog open={open} onOpenChange={setOpen}>
                {
                    !isAccPage &&
                    <DialogTrigger asChild>
                        <div role="button" tabIndex={0} className={`${footer && 'bg-white textPrimaryColor'} flexCenter gap-1 border borderColor rounded-full p-2 cursor-pointer`}>
                            <div className='flexCenter gap-2'>
                                {
                                    triggerImg ?
                                        <ImagePreview
                                            src={triggerImg}
                                            alt='language-flag'
                                            className='w-6! h-6! rounded-full'
                                        />
                                        :
                                        <PiGlobe className="text-xl mt-0.5" />
                                }
                                <span className="capitalize">{triggerLabel}</span>
                            </div>
                            <span><PiCaretDown /></span>
                        </div>
                    </DialogTrigger>
                }
                <DialogContent className={`${isAccPage ? 'overflow-x-hidden overflow-y-auto overscroll-y-contain max-w-full! max-h-full! h-full! rounded-none w-full! gap-0 ' : ''} sm:max-w-[572px] p-0`}>
                    <div>

                        <DialogHeader className='p-6'>
                            <DialogTitle>{t("selectLang")}</DialogTitle>
                        </DialogHeader>

                        {isAccPage ? (
                            <div className='border-t borderColor p-6 flex flex-col gap-4'>
                                {isFetching && languages?.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        {t("loading_languages")}
                                    </div>
                                ) : languages?.length > 0 ? (
                                    <RadioGroup
                                        value={currentLanguageCode}
                                        className="flex flex-col gap-4"
                                    >
                                        {languages?.map((language) => (
                                            <div
                                                className={`flexCenter justify-between border borderColor rounded-[8px] cursor-pointer p-4 transition-all duration-200 ${currentLanguageCode === language?.code
                                                    ? 'border-2 primaryBorder primaryLightBg'
                                                    : 'hover:border-primaryColor/50'
                                                    }  ${isFetching ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                key={language?.code}
                                                onClick={() => !isFetching && handleLanguageChange(language)}
                                            >
                                                <div className='flexCenter gap-2'>
                                                    {
                                                        language?.image ?
                                                            <ImagePreview
                                                                src={language?.image}
                                                                alt={`${language?.name} flag`}
                                                                className='w-6! h-6! rounded-full'
                                                            />
                                                            :
                                                            <PiGlobe className="text-xl mt-0.5" />
                                                    }
                                                    <span className='capitalize'>
                                                        {language?.name}
                                                    </span>
                                                </div>
                                                <RadioGroupItem value={language?.code} id={language?.code} className="pointer-events-none" />
                                            </div>
                                        ))}
                                    </RadioGroup>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        {t("no_languages_available")}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className='border-t borderColor p-6 grid grid-cols-2 sm:grid-cols-3 gap-6'>
                                {isFetching && languages?.length === 0 ? (
                                    <div className="col-span-full text-center py-8 text-gray-500">
                                        {t("loading_languages")}
                                    </div>
                                ) : languages?.length > 0 ? (
                                    languages?.map((language) => (
                                        <div
                                            className={`flexCenter justify-start gap-1 border borderColor rounded-[8px] cursor-pointer p-4 transition-all duration-200 ${currentLanguageCode === language?.code
                                                ? 'border-2 primaryBorder primaryLightBg'
                                                : 'hover:border-primaryColor/50'
                                                } ${isFetching ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            key={language?.code}
                                            onClick={() => !isFetching && handleLanguageChange(language)}
                                        >
                                            <div className='flexCenter gap-2'>
                                                {
                                                    language?.image ?
                                                        <ImagePreview
                                                            src={language?.image}
                                                            alt={`${language?.name} flag`}
                                                            className='w-6! h-6! rounded-full'
                                                        />
                                                        :
                                                        <PiGlobe className="text-xl mt-0.5" />
                                                }
                                                <span className={`capitalize ${currentLanguageCode === language?.code ? 'font-semibold' : ''}`}>
                                                    {language?.name}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full text-center py-8 text-gray-500">
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

export default LanguageModal
