import { Facility } from '@/api/server/getHomePageContent';

export interface RoomFeature {
    /** Display label */
    label: string;
    /** Optional icon node (used in pill layout) */
    icon?: React.ReactNode;
}

export interface RoomFeaturesProps {
    /** List of features to display */
    features: Facility[];
    /** How many items to show before "X+ More" */
    visibleCount?: number;
    extraCount?: number;
    /** Additional CSS classes */
    className?: string;
    roomsCard?: boolean;
    showViewMoreModal?: boolean;
}
