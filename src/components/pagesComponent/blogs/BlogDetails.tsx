'use client'
import { Suspense } from 'react'
import RichTextContent from '@/components/commonComponents/RichText'
import Layout from '@/components/layout/Layout'
import DeepLinkSheet from '@/components/modalsAndSheets/DeepLinkSheet'
import ShareModal from '@/components/modalsAndSheets/ShareModal'
import Badge from '@/components/storyBook/atoms/Badge'
import ImagePreview from '@/components/storyBook/atoms/ImagePreview'
import { Typography } from '@/components/storyBook/atoms/Typography'
import SectionInfo from '@/components/storyBook/molecules/SectionInfo'
import BlogCard from '@/components/storyBook/organisms/BlogCard'
import { BlogsDataType, Category } from '@/hooks/queries/blogs/useBlogs'
import { useTranslation } from '@/hooks/useTranslation'
import { MobileBreadcrum } from '@/components/storyBook/molecules/mobileBreadcrum'
import { Button } from '@/components/storyBook/atoms/Button'
import { PiArrowLeft } from 'react-icons/pi'
import { useRouter } from 'next/navigation'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { useIsMobile } from '@/hooks/useMobile'
import { BlogData } from '@/app/[langCode]/blogs/[slug]/page'
import { motion } from 'framer-motion'
import { listVariants, itemVariants } from '@/lib/motionVariants'

interface BlogDetailsProps {
  blog: BlogData
}

// ─── Component ────────────────────────────────────────────────────────────────

const BlogDetails = ({ blog }: BlogDetailsProps) => {

  const { t } = useTranslation();
  const router = useRouter();
  const isMobile = useIsMobile();

  const blogData = blog as BlogData;
  const relatedBlogs = blog?.related_blogs;

  const scrolled = true;

  return (
    <Layout>

      <div className={`${scrolled ? 'fixed py-2 bg-white top-0' : 'absolute top-10'} z-12  w-full md:hidden`}>
        <div className="container flex items-center justify-between">
          <div className="flexCenter gap-4">
            <Button variant={`${scrolled ? 'text' : 'ghost'}`} className={`${scrolled ? 'p-0!' : 'h-10 w-10'}  shrink-0 border-0 hover:bg-transparent focus:ring-0 textPrimaryColor!`} onClick={() => router.back()}>
              <PiArrowLeft className='text-2xl' />
            </Button>
            <Typography variant="h6" weight="medium" className="text-base!">{t('blogDetails')}</Typography>

          </div>

          <div className={`flex items-center justify-end gap-3 h-10 w-10`}>
            <ShareModal />
          </div>
        </div>

      </div>

      <>
        <section className='container py-8 md:py-12 space-y-4 mt-12 md:mt-0'>

          <Badge
            label={blogData?.category?.name}
            variant={'primary'}
            className='block! md:hidden! primaryColor! font-semibold! text-sm! capitalize'
          />

          <SectionInfo titleVariant='h1' titleWeight='bold' title={blogData?.title} desc={blogData?.excerpt} className='' blogsDetailsPage={true} />

          <div className='flex items-center justify-between bg-white rounded-2xl border p-4'>

            <div className='flex items-center gap-10 h-full'>
              <div className='hidden md:flex flex-col gap-2'>
                <Typography variant='caption'>
                  {t('category')}
                </Typography>
                <Typography variant='h6' weight='semibold' className='text-base! capitalize'>
                  {blogData?.category?.name}
                </Typography>
              </div>
              <div className='bodyBg border h-13 hidden md:block' />
              <div className='flex flex-col gap-2'>
                <Typography variant='caption'>
                  {t('publishDate')}
                </Typography>
                <Typography variant='h6' weight='semibold' className='text-base!'>
                  {blogData?.published_at}
                </Typography>
              </div>
              <div className='bodyBg border h-13' />
              <div className='flex flex-col gap-2'>
                <Typography variant='caption'>
                  {t('readTime')}
                </Typography>
                <Typography variant='h6' weight='semibold' className='text-base!'>
                  {blogData?.read_time_minutes} {t(blogData?.read_time_minutes! > 1 ? 'minutes' : 'minute')}
                </Typography>
              </div>

            </div>
            <div className='md:block hidden'>
              <ShareModal />
            </div>

          </div>

          <div className='w-auto h-[181px] md:h-[479px] lg:h-[823px]'>
            <ImagePreview src={blogData?.featured_image} alt={'blog'} rounded='2xl' className='aspect-1620/823!' />
          </div>

        </section>

        <section className='bg-white md:py-12'>
          <div className="container">
            <RichTextContent content={blogData?.content} />
          </div>
        </section>

        {
          relatedBlogs && relatedBlogs?.length > 0 &&
          <section className='container py-8 md:py-12 flex flex-col gap-2 md:commonGap'>

            <motion.div
              variants={itemVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              <SectionInfo title={t('relatedBlogs')} desc={t('relatedDesc')} />
            </motion.div>

            {isMobile ? (
              <Carousel className="w-full">
                <CarouselContent>
                  {relatedBlogs?.map((blog) => (
                    <CarouselItem key={blog.id} className="basis-4/5 sm:basis-1/2">
                      <motion.div
                        variants={itemVariants}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}
                      >
                        <BlogCard blog={blog as BlogsDataType} />
                      </motion.div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            ) : (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 min-1200:grid-cols-3! commonGap"
                variants={listVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
              >
                {relatedBlogs?.map((blog) => (
                  <motion.div key={blog.id} variants={itemVariants}>
                    <BlogCard blog={blog as BlogsDataType} />
                  </motion.div>
                ))}
              </motion.div>
            )}

          </section>
        }
      </>

      <div className="md:hidden">
        <Suspense>
          <DeepLinkSheet />
        </Suspense>
      </div>
    </Layout>
  )
}

export default BlogDetails
