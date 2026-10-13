import { Property } from '@/hooks/queries/useProperties';
import { Room, RoomProperty } from '@/hooks/queries/useRooms';

export interface SearchCardProps {
    item: Room | Property;
    className?: string;
    roomsTypeCard?: boolean;
    propertyData?: RoomProperty;
    setRoomsModal?: (room: Room) => void;
}
