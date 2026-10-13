import { useMutation } from "@tanstack/react-query";
import { changePasswordApi } from "@/api/client/apiRoutes";

export interface ChangePasswordPayload {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (payload: ChangePasswordPayload) => {
      const response = await (changePasswordApi as any)(payload);
      if (response?.error) {
        throw new Error(response?.message || "Failed to change password");
      }
      return response;
    },
  });
};
