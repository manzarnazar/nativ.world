// Maps Firebase auth error codes to translation keys defined in en.json
const FIREBASE_ERROR_MAP: Record<string, string> = {
    'auth/invalid-phone-number':   'firebaseInvalidPhone',
    'auth/too-short':              'firebasePhoneTooShort',
    'auth/too-long':               'firebasePhoneTooLong',
    'auth/missing-phone-number':   'firebaseMissingPhone',
    'auth/invalid-verification-code': 'firebaseInvalidOtp',
    'auth/code-expired':           'firebaseOtpExpired',
    'auth/session-expired':        'firebaseOtpExpired',
    'auth/user-disabled':          'firebaseUserDisabled',
    'auth/user-not-found':         'firebaseUserNotFound',
    'auth/wrong-password':         'firebaseWrongPassword',
    'auth/too-many-requests':      'firebaseTooManyRequests',
    'auth/network-request-failed': 'firebaseNetworkError',
    'auth/email-already-in-use':   'firebaseEmailInUse',
    'auth/invalid-email':          'firebaseInvalidEmail',
    'auth/weak-password':          'firebaseWeakPassword',
    'auth/popup-closed-by-user':   'firebasePopupClosed',
    'auth/cancelled-popup-request':'firebasePopupClosed',
    'auth/operation-not-allowed':  'firebaseOperationNotAllowed',
    'auth/quota-exceeded':         'firebaseTooManyRequests',
    'auth/missing-verification-code': 'firebaseInvalidOtp',
    'auth/invalid-credential':     'firebaseInvalidCredential',
    'auth/account-exists-with-different-credential': 'firebaseAccountExistsDifferentCred',
}

export function getFirebaseErrorMessage(error: unknown, t: (key: string) => string, fallbackKey = 'somethingWentWrong'): string {
    if (!error) return t(fallbackKey)

    // Extract Firebase error code
    const code = (error as any)?.code as string | undefined
    if (code && FIREBASE_ERROR_MAP[code]) {
        return t(FIREBASE_ERROR_MAP[code])
    }

    // Extract message and check for known Firebase patterns
    const message = (error as any)?.message as string | undefined
    if (message) {
        // Firebase formats: "Firebase: <human msg> (auth/error-code)."
        const match = message.match(/\(auth\/([^)]+)\)/)
        if (match) {
            const extractedCode = `auth/${match[1]}`
            if (FIREBASE_ERROR_MAP[extractedCode]) {
                return t(FIREBASE_ERROR_MAP[extractedCode])
            }
        }
        // TOO_SHORT pattern without parentheses
        if (message.includes('TOO_SHORT') || message.includes('invalid-phone-number')) {
            return t('firebaseInvalidPhone')
        }
        if (message.includes('TOO_LONG')) {
            return t('firebasePhoneTooLong')
        }
        if (message.includes('INVALID_CODE') || message.includes('invalid-verification-code')) {
            return t('firebaseInvalidOtp')
        }
        if (message.includes('SESSION_EXPIRED') || message.includes('code-expired')) {
            return t('firebaseOtpExpired')
        }
        if (message.includes('TOO_MANY_REQUESTS') || message.includes('too-many-requests')) {
            return t('firebaseTooManyRequests')
        }
    }

    return t(fallbackKey)
}
