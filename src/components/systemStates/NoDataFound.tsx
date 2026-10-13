'use client'
import { useTranslation } from "@/hooks/useTranslation"
import EmptyStatus from "../commonComponents/EmptyStatus"

const NoDataFound = () => {

  const { t } = useTranslation()

  return (
    <EmptyStatus type="noDataFound" title={t('noDataFoundTitle')} description={t('noDataFoundDescription')} />
  )
}

export default NoDataFound
