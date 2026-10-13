import { useMutation } from "@tanstack/react-query";
import { updateProfileApi } from "@/api/client/apiRoutes";
import { setUserData } from "@/redux/reducers/userSlice";
import { useDispatch } from "react-redux";

export interface UpdateProfilePayload {
  name?: string;
  profile?: File | "";
  email?: string;
  verification_token?: string;
  country_code?: string;
  dial_code?: string;
  phone?: string;
  firebase_id_token?: string;
  referral_code?: string;
}

export const useUpdateProfile = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async (payload: UpdateProfilePayload) => {
      const response = await updateProfileApi(payload as any);
      if (response?.error) {
        throw new Error(response?.message || "Failed to update profile");
      }
      return response;
    },
    onSuccess: (data) => {
      if (data?.data?.user) {
        dispatch(setUserData(data.data.user));
      }
    },
  });
};
