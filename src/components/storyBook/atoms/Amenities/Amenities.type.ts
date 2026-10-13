
import { Facility } from '@/api/server/getHomePageContent';
import { ReactNode } from 'react';

export interface AmenityItem {
  icon: ReactNode;
  label: string;
}

export interface AmenitiesProps {
  amenities?: Facility[];
  /** How many items to show before "See All" expansion */
  initialCount?: number;
  className?: string;
}
