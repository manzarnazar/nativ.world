import { useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { signOut } from "firebase/auth"
import { toast } from '@/lib/toast';
import { firebaseAuth } from "@/utils/Firebase"
import { logoutApi } from "@/api/client/apiRoutes"
import { firebaseTokenSelector, logoutSuccess } from "@/redux/reducers/userSlice"
import { useTranslation } from "@/hooks/useTranslation"
import { currentLangCodeSelector } from "@/redux/reducers/languageSlice";
import { useClearUserCache } from "@/hooks/useClearUserCache"
import { removeAuthTokenCookie } from "@/utils/authToken";

export const useLogoutUser = () => {
    const dispatch = useDispatch()
    const router = useRouter()
    const { t } = useTranslation()
    const firebaseToken = useSelector(firebaseTokenSelector)
    const authentication = firebaseAuth
    const langCode = useSelector(currentLangCodeSelector);
    const { clearUserCache } = useClearUserCache()

    const handleUserLogout = useCallback(async () => {
        try {
            await signOut(authentication)

            if (typeof window !== 'undefined') {
                window.recaptchaVerifier = null
            }

            const response = await logoutApi({
                fcm_token: firebaseToken
            })

            if (response && !response.error) {
                toast.success(t('logoutSuccess'))
                dispatch(logoutSuccess())
                removeAuthTokenCookie()
                clearUserCache()
                router.push(`/${langCode}`)
            } else {
                toast.error(response?.message || t('logoutFailed'))
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error?.message || t('somethingWentWrong'))
        }
    }, [authentication, firebaseToken, dispatch, router, t, clearUserCache])

    return { handleUserLogout }
}
