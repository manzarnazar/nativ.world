import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from '@/lib/toast';
import { addFavoritesApi, removeFavoritesApi } from '@/api/client/apiRoutes';
import { isLoginSelector } from '@/redux/reducers/userSlice';
import { setLoginModalState } from '@/redux/reducers/helpersReducer';

export const useAddRemoveFavorites = () => {
    const dispatch = useDispatch();
    const isLogin = useSelector(isLoginSelector);
    const [loadingSlug, setLoadingSlug] = useState<string | null>(null);

    const toggleFavorite = useCallback(
        async (slug: string, isFavorited: boolean): Promise<boolean | null> => {
            if (!slug) return null;

            if (!isLogin) {
                dispatch(setLoginModalState(true));
                return null;
            }

            setLoadingSlug(slug);
            try {
                const response = isFavorited
                    ? await removeFavoritesApi({ slug })
                    : await addFavoritesApi({ slug });

                if (response?.error) {
                    throw new Error(response?.message || 'Failed to update favorites');
                }

                return !isFavorited;
            } catch (error: any) {
                toast.error(error?.response?.data?.message || error?.message || 'Failed to update favorites');
                return null;
            } finally {
                setLoadingSlug(null);
            }
        },
        [isLogin, dispatch]
    );

    const isTogglingFavorite = useCallback((slug: string) => loadingSlug === slug, [loadingSlug]);

    return { toggleFavorite, isTogglingFavorite };
};
