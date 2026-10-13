'use client'
import EmptyStatus from '@/components/commonComponents/EmptyStatus'
import { useTranslation } from '@/hooks/useTranslation'

const PageNotFound = () => {

    const { t } = useTranslation();

    return (
        <EmptyStatus type="pageNotFound" title={t("pageNotFoundTitle")} description={t("pageNotFoundDescription")} />
    )
}

export default PageNotFound
