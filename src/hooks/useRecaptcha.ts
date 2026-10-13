/**
 * useRecaptcha Hook
 * Manages reCAPTCHA initialization and cleanup for Firebase phone auth
 */
import { useCallback, useEffect } from "react"
import { RecaptchaVerifier } from "firebase/auth"
import { firebaseAuth } from "@/utils/Firebase"

const RECAPTCHA_CONTAINER_ID = "recaptcha-container-otp-modal"

declare global {
    interface Window {
        recaptchaVerifier: RecaptchaVerifier | null
    }
}

interface UseRecaptchaReturn {
    generateRecaptcha: () => RecaptchaVerifier | null
    clearRecaptcha: () => void
}

export const useRecaptcha = (open: boolean): UseRecaptchaReturn => {

    const auth = firebaseAuth;
    /**
     * Clears the reCAPTCHA verifier instance and empties the container DOM node.
     * Safe to call multiple times.
     */
    const clearRecaptcha = useCallback(() => {
        try {
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear()
                window.recaptchaVerifier = null
            }

            const recaptchaContainer = document.getElementById(RECAPTCHA_CONTAINER_ID)
            if (recaptchaContainer && recaptchaContainer.parentNode) {
                // Replacing the DOM node completely wipes Firebase's hidden attachment state
                const newContainer = recaptchaContainer.cloneNode(false) as HTMLElement
                recaptchaContainer.parentNode.replaceChild(newContainer, recaptchaContainer)
            }
        } catch (error) {
            console.error("Error clearing recaptcha:", error)
        }
    }, [])

    /**
     * Initialises the invisible reCAPTCHA verifier and attaches it to the
     * container element. Returns the existing verifier if already initialised.
     *
     * @returns RecaptchaVerifier instance or null on failure
     */
    const generateRecaptcha = useCallback((): RecaptchaVerifier | null => {
        // Reuse existing verifier to avoid "already rendered" Firebase error
        if (window.recaptchaVerifier) {
            return window.recaptchaVerifier
        }

        const recaptchaContainer = document.getElementById(RECAPTCHA_CONTAINER_ID)
        if (!recaptchaContainer) {
            console.error(`Container element '#${RECAPTCHA_CONTAINER_ID}' not found.`)
            return null
        }

        try {
            // Wipe any stale Firebase-injected markup before re-init
            recaptchaContainer.innerHTML = ""

            window.recaptchaVerifier = new RecaptchaVerifier(
                auth,
                RECAPTCHA_CONTAINER_ID,
                { size: "invisible" }
            )

            return window.recaptchaVerifier
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error)
            console.error("Error initializing RecaptchaVerifier:", message)
            return null
        }
    }, [])

    // Init when the modal opens; clean up when it closes or component unmounts
    useEffect(() => {
        let timeout: NodeJS.Timeout

        if (open) {
            timeout = setTimeout(() => {
                generateRecaptcha()
            }, 100)
        }

        return () => {
            if (timeout) clearTimeout(timeout)
            clearRecaptcha()
        }
    }, [open, generateRecaptcha, clearRecaptcha])

    return { generateRecaptcha, clearRecaptcha }
}
