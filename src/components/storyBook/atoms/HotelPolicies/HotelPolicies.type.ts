import { Rule } from "@/hooks/queries/usePropertyDetails";

export interface HotelPoliciesProps {
  policies: Rule[];
  className?: string;
  checkIn?: string;
  checkOut?: string;
}
