'use client'

import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { isLoginSelector } from '@/redux/reducers/userSlice'
import { currentLangCodeSelector } from '@/redux/reducers/languageSlice'
import { setLoginModalState } from '@/redux/reducers/helpersReducer'

interface WithAuthProps {
    children: React.ReactNode
}

const WithAuth = ({ children }: WithAuthProps) => {
    const isLogin = useSelector(isLoginSelector)
    const langCode = useSelector(currentLangCodeSelector)
    const router = useRouter()
    const dispatch = useDispatch()

    useEffect(() => {
        if (!isLogin) {
            dispatch(setLoginModalState(true));
            router.push(`/`)
        }
    }, [isLogin, langCode])

    if (!isLogin) return null

    return <>{children}</>
}

export default WithAuth
