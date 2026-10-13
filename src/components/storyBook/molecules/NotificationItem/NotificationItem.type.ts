export interface NotificationItemProps {
  title: string;
  body: string;
  createdAt: string;
  isRead: boolean;
  type: string;
  image?: string | null;
  link?: string | null;
  className?: string;
}
