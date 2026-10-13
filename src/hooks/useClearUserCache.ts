import { useCallback } from "react"
import { queryClient } from "@/lib/queryClient"

const USER_QUERY_KEYS = ['bookingsList', 'bookingDetails', 'offers', 'userDetails']

export const useClearUserCache = () => {
    const clearUserCache = useCallback(() => {
        USER_QUERY_KEYS.forEach(key => {
            queryClient.removeQueries({ queryKey: [key] })
        })
    }, [])

    return { clearUserCache }
}
