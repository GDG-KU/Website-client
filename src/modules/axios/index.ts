import axios, { isAxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from "axios";

import { getCookie, deleteCookie, setCookie } from "cookies-next/client";

class ApiClient {
  instance: AxiosInstance;

  isTokenRefreshing = false;
  waitingRefreshList: InternalAxiosRequestConfig[] = [];

  private _injectResponseInterceptor() {
    this.instance.interceptors.response.use(undefined, async (err) => {
      if (isAxiosError(err) && err.status === 401 && err.config) {
        this.waitingRefreshList.push(err.config);

        if (!this.isTokenRefreshing) {
          this.isTokenRefreshing = true;

          try {
            const { data } = await this.instance.post<{ access_token: string }>("/auth/refresh");

            const accessToken = data.access_token;
            setCookie("accessToken", accessToken);

            while (this.waitingRefreshList.length > 0) {
              const config = this.waitingRefreshList.shift();
              if (!config) break;

              this.instance.request(config);
            }
          } catch (error) {
            console.error("[Error] Failed to refresh token. ", error);
            deleteCookie("accessToken");

            window.location.href = "/";
          } finally {
            this.isTokenRefreshing = false;
          }
        }
      }

      return err;
    });
  }

  constructor() {
    this.instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    this.instance.interceptors.request.use((config) => {
      // TODO: Cookie에서 꺼낼 수 있도록
      const accessToken = getCookie("accessToken");

      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${accessToken}`;

      return config;
    });

    this._injectResponseInterceptor();
  }
}

export const apiInstance = new ApiClient().instance;

export default ApiClient;
