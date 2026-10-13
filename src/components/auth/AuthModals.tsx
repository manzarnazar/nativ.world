import { useEffect, useState } from 'react'
import SigninModal from './SigninModal'
import RegisterModal from './RegisterModal'
import ForgotPassModal from './ForgotPassModal'
import OtpModal from './OtpModal'
import { RegisterUserDataProvider } from '@/contexts/RegisterUserData'
import { useDispatch, useSelector } from 'react-redux'
import ResetPassModal from './ResetPassModal'
import { isLoginModalOpenSelector, setLoginModalState } from '@/redux/reducers/helpersReducer'
import { toast } from '@/lib/toast'
import { useTranslation } from '@/hooks/useTranslation'

export type modalTypes = "signin" | "register" | "forgotPass" | "otp" | "resetPass"

const AuthModals = () => {

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const isLoginModalOpen = useSelector(isLoginModalOpenSelector);

    const [openModals, setOpenModals] = useState({
        sigin: false,
        register: false,
        forgotPass: false,
        otp: false,
        resetPass: false,
    });

    const [continueWithEmail, setContinueWithEmail] = useState<boolean>(false)

    const handleOpenModal = (modal: modalTypes) => {
        setOpenModals(prev => {
            const key = modal === 'signin' ? 'sigin' : modal;
            return { ...prev, [key]: true };
        });
    }

    const handleCloseModal = (modal: modalTypes) => {
        setOpenModals(prev => {
            const key = modal === 'signin' ? 'sigin' : modal;
            return { ...prev, [key]: false };
        });
    }

    useEffect(() => {
        if (isLoginModalOpen) {
            toast.error(t('loginFirst'));
            setOpenModals(prev => ({
                ...prev,
                sigin: true
            }));
            dispatch(setLoginModalState(false));
        }
    }, [isLoginModalOpen])

    return (
        <RegisterUserDataProvider>
            <SigninModal openSigninModal={openModals.sigin} handleOpenModal={handleOpenModal} handleCloseModal={handleCloseModal} continueWithEmail={continueWithEmail} setContinueWithEmail={setContinueWithEmail} handleOpenRegisterModal={() => handleOpenModal('register')} />

            <RegisterModal openRegisterModal={openModals.register} setOpenRegisterModal={(open) => open ? handleOpenModal('register') : handleCloseModal('register')} handleCloseModal={handleCloseModal} handleOpenModal={handleOpenModal} continueWithEmail={continueWithEmail} setOpenOtpModal={() => handleOpenModal('otp')} />

            <OtpModal openOtpModal={openModals.otp} handleOpenModal={handleOpenModal} handleCloseModal={handleCloseModal} setOpenRegisterModal={() => handleOpenModal('register')} openResetPassModal={() => handleOpenModal('resetPass')} />

            <ForgotPassModal openForgotPassModal={openModals.forgotPass} handleOpenModal={handleOpenModal} handleCloseModal={handleCloseModal} setOpenOtpModal={() => handleOpenModal('otp')}
                continueWithEmail={continueWithEmail}
            />

            <ResetPassModal openResetPassModal={openModals.resetPass} handleCloseModal={() => handleCloseModal('resetPass')} />


        </RegisterUserDataProvider>
    )
}

export default AuthModals