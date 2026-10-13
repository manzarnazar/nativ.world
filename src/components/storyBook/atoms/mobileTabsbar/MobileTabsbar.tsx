'use client'

import { scrollToSection } from '@/utils/helpers'
import { MobileTabsbarProps } from './MobileTabsbar.type'

const MobileTabsbar = ({ tabs, activeTab, fixed = false }: MobileTabsbarProps) => {
    return (
        <div id="page-tabbar" className={`${fixed ? 'fixed! top-13' : 'sticky top-0 md:top-26'} z-1001 w-full block bg-white border-y pt-2`}>
            <div className="flex items-center overflow-x-auto no-scrollbar border-gray-100 container">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => scrollToSection(tab.id)}
                        className={`shrink-0 px-6 py-3 text-sm md:text-base font-medium transition-colors border-b-3 -mb-px ${activeTab === tab.id
                            ? 'primaryBorder primaryColor'
                            : 'border-transparent'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default MobileTabsbar
