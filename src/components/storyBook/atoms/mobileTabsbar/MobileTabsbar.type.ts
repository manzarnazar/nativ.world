export interface TabItem {
    id: string
    label: string
}

export interface MobileTabsbarProps {
    tabs: TabItem[]
    activeTab: string
    fixed?: boolean
}
