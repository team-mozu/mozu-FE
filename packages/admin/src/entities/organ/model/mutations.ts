import { setAuthTokens } from "@mozu/util-config";
import { useMutation } from "@tanstack/react-query";
import { login } from "../api";
import type { OrganLoginRequest, OrganLoginResponse } from "../api/type";

export const useAdminLogin = () => {
  return useMutation({
    mutationFn: (data: OrganLoginRequest) => login(data),
    onSuccess: (res: OrganLoginResponse) => {
      setAuthTokens(res.accessToken, res.refreshToken, "admin");
    },
  });
};
