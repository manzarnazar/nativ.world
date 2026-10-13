'use client'
import { useState, useCallback } from 'react'
import { z } from 'zod'
import Layout from '../layout/Layout'
import { Typography } from '../storyBook/atoms/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { PiUserCircle, PiChatCenteredText } from 'react-icons/pi'
import { PiEnvelope, PiMapPinLine, PiPhone } from 'react-icons/pi'
import Divider from '../storyBook/atoms/Divider'
import Input from '../storyBook/atoms/Input/Input'
import { Button } from '../storyBook/atoms/Button'
import MobileBreadcrum from '../storyBook/molecules/mobileBreadcrum/MobileBreadcrum'
import { useContactUs } from '@/hooks/queries/general/useContactUs'
import { toast } from '@/lib/toast';
import { useSelector } from 'react-redux'
import { userDataSelector } from '@/redux/reducers/userSlice'
import { settingsSelector } from '@/redux/reducers/settingsSlice'
import ImagePreview from '../storyBook/atoms/ImagePreview'
import Link from 'next/link'

const NAME_MAX = 50
const EMAIL_MAX = 150
const SUBJECT_MAX = 100
const MESSAGE_MAX = 500


interface ContactForm {
  name: string
  email?: string
  subject: string
  message: string
}

type ContactFormErrors = Partial<Record<keyof ContactForm, string>>

const ContactUsPage = () => {

  const { t } = useTranslation();

  const settingsData = useSelector(settingsSelector);
  const userDetails = useSelector(userDataSelector);

  const [formData, setFormData] = useState<ContactForm>({
    name: userDetails?.name || "",
    email: userDetails?.email || "",
    subject: '',
    message: '',
  })
  const [errors, setErrors] = useState<ContactFormErrors>({})

  const contactSchema = z.object({
    name: z.string().min(2, t('nameMinLength')),
    email: z.string().email(t('invalidEmail')),
    subject: z.string().min(2, t('nameMinLength')),
    message: z.string().min(1, t('messageRequired')).max(MESSAGE_MAX, t('messageMaxLength')),
  })

  const validate = useCallback((): boolean => {
    const result = contactSchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors: ContactFormErrors = {}
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof ContactForm
        if (!fieldErrors[field]) fieldErrors[field] = err.message
      })
      setErrors(fieldErrors)
      return false
    }
    setErrors({})
    return true
  }, [formData])

  const { mutate: submitContactUs, isPending: isLoading } = useContactUs()

  const handleChange = (field: keyof ContactForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validate()) return
    submitContactUs(formData, {
      onSuccess: () => {
        toast.success(t('contactUsSuccess'))
        setFormData({ name: '', email: '', subject: '', message: '' })
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })
  }

  const contactData = [
    {
      icon: <PiMapPinLine className="text-2xl" />,
      title: t('location'),
      description: settingsData?.branding?.contact_address,
    },
    {
      icon: <PiEnvelope className="text-2xl" />,
      title: t('mailUs'),
      description: settingsData?.branding?.contact_email,
    },
    {
      icon: <PiPhone className="text-2xl" />,
      title: t('callUs'),
      description: settingsData?.branding?.contact_phone,
    },
  ]

  const socialData = settingsData?.social_media_links

  return (
    <Layout>
      <MobileBreadcrum title={t('contactUs')} />
      <section className='bg-white commonPY'>
        <div className="container space-y-6">
          <Typography variant='h1' weight='semibold' className='hidden md:block text-2xl!'>{t('contactUs')}</Typography>
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:rounded-2xl bg-white lg:shadow-[1px_1px_4px_0px_#0000001F] gap-y-6">
            <div className="col-span-1 lg:col-span-5 rounded-2xl lg:rounded-l-2xl lg:rounded-r-none primaryLightBg p-4 lg:p-6 space-y-7.5 lg:border-r">
              <div className='flex flex-col gap-2'>
                <Typography variant='h5' weight='semibold'>{t('getInTouch')}</Typography>
                <Typography variant='desc1' weight='regular'>{t('getInTouchDesc')}</Typography>
              </div>

              <div className="flex flex-col gap-6">
                {contactData?.map((item, index) => (
                  <div key={index} className="bg-white rounded-2xl p-3 lg:p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full primaryBg flex items-center justify-center text-white shrink-0">
                      {item.icon}
                    </div>
                    <div className='flex flex-col gap-1'>
                      <Typography variant='h6' weight='semibold'>{item.title}</Typography>
                      <Typography variant='desc2' weight='medium'>{item.description}</Typography>
                    </div>
                  </div>
                ))}
              </div>
              {
                socialData?.length > 0 &&
                <div className="flex flex-col gap-6">
                  <Typography variant='h5' weight='semibold'>{t('connetWithSocial')}</Typography>
                  <div className="flex items-center gap-6 flex-wrap">
                    {socialData?.map((item, index) => (
                      <Link href={item?.link} target='_blank' key={index} className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white cursor-pointer hover:bg-black/80 transition-colors">
                        <ImagePreview src={item?.image} alt='social-media' className='w-5! h-5!' />
                      </Link>
                    ))}
                  </div>
                </div>
              }
            </div>

            <div className="col-span-1 lg:col-span-7 lg:rounded-r-2xl p-0 lg:p-6 space-y-7.5">
              <div className='flex flex-col gap-2'>
                <Typography variant='h5' weight='semibold'>{t('writeToUs')}</Typography>
                <Typography variant='desc1' weight='regular'>{t('writeToUsDesc')}</Typography>
              </div>
              <Divider />
              <form onSubmit={handleSubmit} className='flex flex-col commonGap'>
                <div className='grid grid-cols-1 md:grid-cols-2 commonGap'>
                  <Input
                    label={t('name')}
                    placeholder="e.g, Jack Williams"
                    required
                    fullWidth
                    leftIcon={<PiUserCircle className="text-xl" />}
                    value={formData.name}
                    onChange={handleChange('name')}
                    error={errors.name}
                    maxLength={NAME_MAX}
                  />
                  <Input
                    label={t('email')}
                    placeholder="e.g, JackWilliams11@gmail.com"
                    fullWidth
                    leftIcon={<PiEnvelope className="text-xl" />}
                    value={formData.email}
                    onChange={handleChange('email')}
                    error={errors.email}
                    required
                    maxLength={EMAIL_MAX}
                  />
                </div>
                <div>
                  <Input
                    label={t('subject')}
                    placeholder="e.g, Refund Issue"
                    required
                    fullWidth
                    leftIcon={<PiChatCenteredText className="text-xl" />}
                    value={formData.subject}
                    onChange={handleChange('subject')}
                    error={errors.subject}
                    maxLength={SUBJECT_MAX}
                  />
                </div>
                <div>
                  <div className="w-full">
                    <label className="block text-sm md:text-base font-medium mb-1.5">
                      {t('msg')}<span className="errorColor ml-1">*</span>
                    </label>
                    <textarea
                      maxLength={MESSAGE_MAX}
                      value={formData.message}
                      onChange={handleChange('message')}
                      className={`block w-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 border bg-white placeholder:textSecondaryColor focus:border-[var--primary-color] focus:ring-[var--primary-color] px-4 py-3 text-sm rounded-lg resize-none min-h-30 ${errors.message ? 'border-red-500' : 'border-black'}`}
                      placeholder="Tell us how we can help you..."
                    />
                    {errors.message && <p className="text-xs errorColor mt-1">{errors.message}</p>}
                  </div>
                </div>
                <div className='flex items-center justify-end'>
                  <Button variant='primary' type='submit' className='btn_md md:btn_lg' loading={isLoading}>
                    {t('submitMsg')}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout >
  )
}

export default ContactUsPage
