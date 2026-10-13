import { useEffect, useState } from 'react'
import { RegisterUserDataProvider } from '@/contexts/RegisterUserData'
import { useDispatch, useSelector } from 'react-redux'
import { isLoginModalOpenSelector, setLoginModalState } from '@/redux/reducers/helpersReducer'
import { toast } from '@/lib/toast'
import { useTranslation } from '@/hooks/useTranslation'
import RegisterWithModal from './RegisterWithModal'
import OtpModal from './OtpModal'
import RegisterFormModal from './RegisterFormModal'

export type modalTypes = "registerWith" | "register" | "otp"

const RegistratoinModals = () => {

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const isLoginModalOpen = useSelector(isLoginModalOpenSelector);

    const [openModals, setOpenModals] = useState({
        registerWith: false,
        register: false,
        otp: false,
    });

    const [continueWithEmail, setContinueWithEmail] = useState<boolean>(false)

    const handleOpenModal = (modal: modalTypes) => {
        setOpenModals(prev => {
            const key = modal === 'registerWith' ? 'registerWith' : modal;
            return { ...prev, [key]: true };
        });
    }

    const handleCloseModal = (modal: modalTypes) => {
        setOpenModals(prev => {
            const key = modal === 'registerWith' ? 'registerWith' : modal;
            return { ...prev, [key]: false };
        });
    }

    useEffect(() => {
        if (isLoginModalOpen) {
            toast.error(t('loginFirst'));
            setOpenModals(prev => ({
                ...prev,
                registerWith: true
            }));
            dispatch(setLoginModalState(false));
        }
    }, [isLoginModalOpen])

    return (
        <RegisterUserDataProvider>
            <RegisterWithModal openRegisterWithModal={openModals.registerWith} handleOpenModal={handleOpenModal} handleCloseModal={handleCloseModal} continueWithEmail={continueWithEmail} setContinueWithEmail={setContinueWithEmail} />

            <OtpModal openOtpModal={openModals.otp} handleOpenModal={handleOpenModal} handleCloseModal={handleCloseModal} setOpenRegisterWithModal={() => handleOpenModal('registerWith')} />

             <RegisterFormModal open={openModals?.register} handleCloseModal={handleCloseModal} continueWithEmail={continueWithEmail} />


        </RegisterUserDataProvider>
    )
}

export default RegistratoinModals