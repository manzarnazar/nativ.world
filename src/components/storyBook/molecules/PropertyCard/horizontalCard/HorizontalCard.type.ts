import { Property } from '@/hooks/queries/useProperties';

export interface HorizontalCardProps {
    /** Full property data object */
    property: Property;
    /** Card click handler */
    onClick?: () => void;
    /** Additional CSS classes for the card wrapper */
    className?: string;
}
