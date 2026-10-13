import WhyBookWithUs from './sections/WhyBookWithUs'
import PropertiesSection from './sections/PropertiesSection';
import PropertiesSliderSection from './sections/PropertiesSliderSection';
import { HomePageSectionsApiResponse } from '@/api/server/getHomePageSections';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { isLoginSelector } from '@/redux/reducers/userSlice';
import { useRouter } from 'next/navigation';

const capitalizeWords = (value: string) => value.replace(/\b\w/g, (char) => char.toUpperCase());

interface MultiModeHomeProps {
    homePageSectionsData: HomePageSectionsApiResponse | null;
}

const MultiModeHome = ({ homePageSectionsData }: MultiModeHomeProps) => {

    const router = useRouter();

    const isLogin = useSelector(isLoginSelector);
    const sections = homePageSectionsData?.data ?? [];
    const error = homePageSectionsData?.error;

    useEffect(() => {
        if (error) {
            console.log('error => ', homePageSectionsData?.message)
        }
    }, [error]);


    useEffect(() => {
        router.refresh();
    }, [isLogin])


    return (
        <div className="bg-white -mt-6 sm:-mt-2 lg:mt-14 py-6">
            {sections?.map((section) => (
                section?.section_type === 'recently_viewed' ?
                    <PropertiesSliderSection
                        key={section.id}
                        title={capitalizeWords(section.section_title)}
                        properties={section.properties}
                        citySlug={section.target_city?.slug}
                    />
                    :
                    <PropertiesSection
                        key={section.id}
                        title={capitalizeWords(section.section_title)}
                        properties={section.properties}
                        citySlug={section.target_city?.slug}
                        countryId={section.target_country_id}
                    />
            ))
            }
            <WhyBookWithUs />
        </div>
    )
}

export default MultiModeHome