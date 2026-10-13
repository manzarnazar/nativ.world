'use client'
import { useTranslation } from "@/hooks/useTranslation"
import Layout from "../../layout/Layout"
import { Breadcrumb } from "../../storyBook/molecules/Breadcrumb"
import ReserveCard from "../../storyBook/organisms/ReserveNowCard/ReserveCard"
import { Typography } from "../../storyBook/atoms/Typography"
import GuetDetailsPaymentOpts from "./GuetDetailsPaymentOpts"
import { useIsMobile } from "@/hooks/useMobile"
import PropertyCard from "./PropertyCard"
import { useEffect, useState } from "react"
import { MobileBreadcrum } from "@/components/storyBook/molecules/mobileBreadcrum"
import { useSelector } from "react-redux"
import { bookingLockIdSelector } from "@/redux/reducers/helpersReducer"
import { useRouter } from "next/navigation"
import { currentLangCodeSelector } from "@/redux/reducers/languageSlice"


const ConfirmBooking = () => {

    const { t } = useTranslation();
    const isMobile = useIsMobile();
    const [isPayAtProperty, setIsPayAtProperty] = useState(false);

    const router = useRouter();

    const bookingLockId = useSelector(bookingLockIdSelector);
    const langCode = useSelector(currentLangCodeSelector)


    useEffect(() => {
        if (!bookingLockId) {
            router.push(`/${langCode}`)
            return;
        }
    }, [bookingLockId])




    return (
        <Layout>
            {
                isMobile ?
                    <MobileBreadcrum title={t("confirmYourBooking")} />
                    :
                    <Breadcrumb activeLabel={t("confirmYourBooking")} />
            }
            <div className="relative after:absolute after:inset-0 after:w-1/4 lg:after:bg-white after:z-1 py-6 md:py-0">

                <div className="container relative z-2">
                    <div className="grid grid-cols-12">
                        {/* Left Column */}
                        {
                            <GuetDetailsPaymentOpts setIsPayAtProperty={setIsPayAtProperty} />
                        }

                        {/* Right Column */}
                        {
                            !isMobile &&
                            <div className="col-span-12 lg:col-span-5">
                                <div className="space-y-6 py-6 lg:py-20 pl-10 rtl:pl-0 rtl:pr-10">
                                    <div className="space-y-2">
                                        <Typography
                                            variant="h5"
                                            weight="semibold"
                                            className="textPrimaryColor! text-2xl!"
                                        >
                                            {t("bookingSummary")}
                                        </Typography>

                                        <div>
                                            <PropertyCard />
                                        </div>
                                    </div>

                                    <ReserveCard isPayAtProperty={isPayAtProperty} />
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default ConfirmBooking