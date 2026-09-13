import Cookies from "js-cookie";

export const ACCESS_TOKEN_KEY = "accessToken";

export const cookie = {
  get: (key: string): string | null => {
    if (typeof window === "undefined") return null;
    return Cookies.get(key) ?? null;
  },
  set: (key: string, value: string, days = 7) => {
    if (typeof window === "undefined") return;
    Cookies.set(key, value, {
      expires: days,
      sameSite: "Lax",
      path: "/",
      secure: process.env.NODE_ENV === "production"
    });
  },
  remove: (key: string): void => {
    if (typeof window === "undefined") return;
    Cookies.remove(key, { path: "/" });
  }
};

export const getAccessToken = (): string | null => {
  return cookie.get(ACCESS_TOKEN_KEY);
};

export const setAccessToken = (token: string): void => {
  cookie.set(ACCESS_TOKEN_KEY, token);
};

export const removeAccessToken = (): void => {
  cookie.remove(ACCESS_TOKEN_KEY);
};
