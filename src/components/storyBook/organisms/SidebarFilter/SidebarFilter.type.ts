import { Facility } from '@/api/server/getHomePageContent';
import { PropertyType } from '@/hooks/queries/useProperties';
import { SidebarFilterTypes } from '@/types/GlobalTypes';

export interface AmenityItem {
    id: string;
    label: string;
}

export interface SidebarFilterProps {
    /** Shared filter state */
    sidebarFilter: SidebarFilterTypes;
    /** Setter for shared filter state */
    setSidebarFilter: React.Dispatch<React.SetStateAction<SidebarFilterTypes>>;

    /** Price range min */
    priceMin?: number;
    /** Price range max */
    priceMax?: number;
    /** Price step */
    priceStep?: number;
    /** Currency prefix symbol */
    pricePrefix?: string;

    /** List of amenity items */
    amenities?: Facility[];
    propertyTypes?: PropertyType[];

    /** Additional CSS classes for the sidebar wrapper */
    className?: string;
  countryId: string | number; 
}
