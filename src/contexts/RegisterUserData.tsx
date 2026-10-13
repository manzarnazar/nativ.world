'use client'
import { createContext, useContext, useState, ReactNode } from "react"

export type RegisterFormData = {
    name: string
    country_code: string
    dialCode: string
    phone: string
    email: string
    password: string
    confirmPassword: string
    referralCode: string
    isForgotPass?: boolean
    verifyToken?: string
}


type RegisterUserDataContextType = {
    registerFormData: RegisterFormData
    setRegisterFormData: React.Dispatch<React.SetStateAction<RegisterFormData>>
    resetRegisterFormData: () => void
}

const RegisterUserDataContext = createContext<RegisterUserDataContextType | undefined>(undefined)

export const RegisterUserDataProvider = ({ children }: { children: ReactNode }) => {

    const defaultFormData: RegisterFormData = {
        name: "",
        country_code: "",
        dialCode: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
        referralCode: "",
        isForgotPass: false,
        verifyToken: "",
    }
    const [registerFormData, setRegisterFormData] = useState<RegisterFormData>(defaultFormData)

    const resetRegisterFormData = () => {
        setRegisterFormData(defaultFormData)
    }

    return (
        <RegisterUserDataContext.Provider value={{ registerFormData, setRegisterFormData, resetRegisterFormData }}>
            {children}
        </RegisterUserDataContext.Provider>
    )
}

export const useRegisterUserData = () => {
    const context = useContext(RegisterUserDataContext)
    if (!context) {
        throw new Error("useRegisterUserData must be used within a RegisterUserDataProvider")
    }
    return context
}
