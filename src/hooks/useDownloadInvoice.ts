import { useState } from 'react'
import { toast } from '@/lib/toast';
import { downloadBookingInvoiceApi } from '@/api/client/apiRoutes'

export const useDownloadInvoice = () => {
  const [invoiceLoading, setInvoiceLoading] = useState(false)

  const handleDownloadInvoice = async (bookingNumber: string) => {
    if (!bookingNumber || invoiceLoading) return
    setInvoiceLoading(true)
    try {
      const blob = await downloadBookingInvoiceApi({ bookingNumber })
      const pdfBlob = blob instanceof Blob ? blob : new Blob([blob], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(pdfBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = `invoice_${bookingNumber}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to download invoice')
    } finally {
      setInvoiceLoading(false)
    }
  }

  return { handleDownloadInvoice, invoiceLoading }
}
