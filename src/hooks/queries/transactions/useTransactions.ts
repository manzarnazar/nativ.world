import { useQuery } from "@tanstack/react-query";
import { getTransactionsApi } from "@/api/client/apiRoutes";
import { ApiResponseType, PaginationType } from "@/types/GlobalTypes";

export interface TransactionItem {
  id: number;
  booking_number: string;
  property_name: string;
  gateway: string;
  transaction_id: string;
  amount: string;
  currency: string;
  currency_symbol: string;
  status: "success" | "failed" | "pending" | string;
  payment_type: string;
  description: string;
  type: "debit" | "credit" | string;
  paid_at: string | null;
  created_at: string;
}

export interface TransactionsData {
  items: TransactionItem[];
  pagination: PaginationType;
}

export interface TransactionsApiResponse extends Omit<ApiResponseType, "data"> {
  data: TransactionsData;
}

const DEFAULT_LIMIT = 10;

export const useTransactions = (page: number = 1, limit: number = DEFAULT_LIMIT) => {
  const offset = (page - 1) * limit;

  return useQuery<TransactionsApiResponse>({
    queryKey: ["transactions", page, limit],
    queryFn: async () => {
      const response = await (getTransactionsApi as any)({ limit, offset });
      if (response?.error) {
        throw new Error(response?.message || "Failed to fetch transactions");
      }
      return response as TransactionsApiResponse;
    },
  });
};
