---
description: Generic guide for integrating real API endpoints, replacing placeholder data and mock types. Includes Axios setup, session management, route guards (HOC), and TanStack Query integration.
---

# API Integration Workflow

This workflow covers the **complete** integration of real API endpoints into a Next.js project, from parsing a Postman collection to replacing mock data, including all authentication infrastructure.

**Stack:** Next.js · TanStack Query · Axios · TypeScript · `js-cookie` · JWT

> **Provide the Postman JSON file** before starting. The AI will parse all endpoints, request bodies, query params, and example responses to drive every step below.

---

## Architecture Overview

```
Browser Cookie (auth_session)
    └── JSON string: { accessToken, refreshToken, role }
            │
            ▼
src/lib/api.ts  ← Axios instance
    ├── request interceptor injects Bearer token from cookie
    └── response interceptor normalises errors
            │
            ▼
src/lib/actions/<feature>/*.ts  ← useQuery / useMutation hooks
            │
            ▼
src/app/(private|public)/**    ← Page / Layout components
    └── src/lib/hoc/with-route-guard.tsx  ← HOC guards layouts
```

---

## Part A – Axios Setup

### File: `src/lib/api.ts`

This is the **single Axios instance** used throughout the app.

```typescript
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { AUTH_SESSION_COOKIE } from "@/constants/auth";
import { env } from "@/env";
import { parseAuthSession } from "@/lib/auth/session";

// ─── Axios instance ────────────────────────────────────────────────────────────
export const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  timeout: 10_000,
  headers: { Accept: "application/json" }
});

// ─── Request interceptor: attach access token ─────────────────────────────────
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  const headers = config.headers as Record<string, string | undefined> | undefined;
  const hasAuthHeader = Boolean(headers?.Authorization || headers?.authorization);

  if (token && !hasAuthHeader) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ─── Response interceptor: normalise errors ────────────────────────────────────
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (axios.isAxiosError(err)) return Promise.reject(err);
    return Promise.reject(new AxiosError("Unknown error"));
  }
);

// ─── Convenience wrappers (return .data directly) ─────────────────────────────
type Cfg = AxiosRequestConfig & { signal?: AbortSignal };

export const get   = async <T>(url: string, config?: Cfg) =>
  (await api.get<T>(url, config)).data;

export const post  = async <T, B = unknown>(url: string, body?: B, config?: Cfg) =>
  (await api.post<T>(url, body, config)).data;

export const put   = async <T, B = unknown>(url: string, body?: B, config?: Cfg) =>
  (await api.put<T>(url, body, config)).data;

export const patch = async <T, B = unknown>(url: string, body?: B, config?: Cfg) =>
  (await api.patch<T>(url, body, config)).data;

export const del   = async <T>(url: string, config?: Cfg) =>
  (await api.delete<T>(url, config)).data;

// ─── Internal: reads access token from cookie ──────────────────────────────────
const getCookieValue = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const prefix = `${name}=`;
  const found = document.cookie
    .split(";")
    .map((p) => p.trim())
    .find((p) => p.startsWith(prefix));
  return found ? found.slice(prefix.length) : null;
};

async function getToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  const rawSession = getCookieValue(AUTH_SESSION_COOKIE);
  if (!rawSession) return null;
  const session = parseAuthSession(rawSession);
  return session?.accessToken ?? null;
}
```

---

## Part B – Authentication

### Types

**`src/types/auth-role.ts`**
```typescript
export type AuthRole = "admin" | "user";
```

**`src/types/auth-session.ts`**
```typescript
import type { AuthRole } from "@/types/auth-role";

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  role: AuthRole;
}
```

### Constants: `src/constants/auth.ts`

```typescript
import type { AuthRole } from "@/types/auth-role";

export const AUTH_SESSION_COOKIE = "auth_session";
export const LOGIN_PATH = "/login";
export const UNAUTHORIZED_PATH = "/";

export const ROLE_HOME_PATHS: Record<AuthRole, string> = {
  admin: "/admin",
  user: "/dashboard",
};
```

### Session Management: `src/lib/auth/session.ts`

```typescript
import { LoginResponse } from "@/types/auth";
import type { AuthRole } from "@/types/auth-role";
import type { AuthSession } from "@/types/auth-session";

const normalizeAuthRole = (role: string | null | undefined): AuthRole | null => {
  const n = role?.toLowerCase();
  return n === "admin" || n === "user" ? (n as AuthRole) : null;
};

const decodeJwtPayload = (token: string): Record<string, unknown> | null => {
  const parts = token.split(".");
  if (parts.length < 2) return null;
  const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  try {
    const decoded = Buffer.from(padded, "base64").toString("utf8");
    return JSON.parse(decoded);
  } catch { return null; }
};

const extractRoleFromToken = (token: string): AuthRole | null => {
  const payload = decodeJwtPayload(token);
  return normalizeAuthRole(payload?.role as string);
};

export const parseAuthSession = (raw: string): AuthSession | null => {
  const tryParse = (input: string): AuthSession | null => {
    try {
      const parsed = JSON.parse(input) as Partial<AuthSession>;
      if (!parsed.accessToken || !parsed.refreshToken) return null;
      const role = normalizeAuthRole(parsed.role) ?? extractRoleFromToken(parsed.accessToken);
      if (!role) return null;
      return { accessToken: parsed.accessToken, refreshToken: parsed.refreshToken, role };
    } catch { return null; }
  };
  return tryParse(raw) ?? tryParse(decodeURIComponent(raw));
};

export const buildAuthSessionFromLoginResponse = (data: LoginResponse): AuthSession => {
  const { accessToken, refreshToken, user } = data.data || {};
  if (!data.success || !accessToken || !refreshToken) {
    throw new Error(data.message || "Authentication failed.");
  }
  const role = normalizeAuthRole(user?.role) ?? extractRoleFromToken(accessToken);
  if (!role) throw new Error("Unable to detect user role.");
  return { accessToken, refreshToken, role };
};
```

### Cookie Client: `src/lib/cookie-client.ts`

```typescript
"use client";
import Cookies from "js-cookie";

export const cookie = {
  get: (key: string) => typeof window !== "undefined" ? (Cookies.get(key) ?? null) : null,
  set: (key: string, value: string, days = 365) => {
    if (typeof window === "undefined") return;
    Cookies.set(key, value, { expires: days, sameSite: "Lax", path: "/", secure: process.env.NODE_ENV === "production" });
  },
  remove: (key: string) => {
    if (typeof window === "undefined") return;
    Cookies.remove(key);
  }
};
```

---

## Part C – Route Guards (HOC)

### Server-side guard: `src/lib/auth/route-guard.ts`

```typescript
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { AuthRole } from "@/types/auth-role";
import { AUTH_SESSION_COOKIE, LOGIN_PATH, ROLE_HOME_PATHS, UNAUTHORIZED_PATH } from "@/constants/auth";
import { parseAuthSession } from "@/lib/auth/session";

export const getSessionFromRequest = async () => {
  const cookieStore = await cookies();
  const raw = cookieStore.get(AUTH_SESSION_COOKIE)?.value;
  return raw ? parseAuthSession(raw) : null;
};

export const requirePrivateRole = async (allowedRoles: AuthRole[]) => {
  const session = await getSessionFromRequest();
  if (!session) redirect(LOGIN_PATH);
  if (!allowedRoles.includes(session.role)) redirect(UNAUTHORIZED_PATH);
  return session;
};

export const redirectIfAuthenticated = async () => {
  const session = await getSessionFromRequest();
  if (session) redirect(ROLE_HOME_PATHS[session.role]);
};
```

### HOC wrappers: `src/lib/hoc/with-route-guard.tsx`

```typescript
import { ReactNode } from "react";
import type { AuthRole } from "@/types/auth-role";
import { redirectIfAuthenticated, requirePrivateRole } from "@/lib/auth/route-guard";

type LayoutProps = { children: ReactNode };
type LayoutComponent = (props: LayoutProps) => ReactNode | Promise<ReactNode>;

export const withPrivateRoute = (Layout: LayoutComponent, options: { allowedRoles: AuthRole[] }) => {
  return async function GuardedLayout(props: LayoutProps) {
    await requirePrivateRole(options.allowedRoles);
    return <Layout {...props} />;
  };
};

export const withPublicRoute = (Layout: LayoutComponent) => {
  return async function GuardedLayout(props: LayoutProps) {
    await redirectIfAuthenticated();
    return <Layout {...props} />;
  };
};
```

---

## Part D – TanStack Query Setup

### Query client: `src/lib/query-client.ts`

```typescript
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
});
```

---

## Part E – Postman → Action Hook Mapping

### Step 1 – Parse the Postman Collection

Group endpoints by resource (e.g. `product`, `order`, `user`).

### Step 2 – Define TypeScript Types (`src/types/<feature>.ts`)

```typescript
export interface PaginationMeta {
  page: number; limit: number; total: number; totalPage: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    meta: PaginationMeta;
    data: T[];
  };
}
```

### Step 3 – Create Action Hooks (`src/lib/actions/<feature>/`)

**Query hook template:**
```typescript
"use client";
import { useQuery } from "@tanstack/react-query";
import { api as instance } from "@/lib/api";

export const useGetResources = (params?: Record<string, any>, enabled = true) => {
  return useQuery({
    queryKey: ["resources", params],
    enabled,
    queryFn: async () => {
      const response = await instance.get<PaginatedResponse<any>>("/resources", { params });
      return response.data;
    }
  });
};
```

**Mutation hook template:**
```typescript
"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { post } from "@/lib/api";

export const useCreateResource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => post<ApiResponse<any>>("/resources", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    }
  });
};
```

---

## Part F – Cleanup & Verification

1. **Remove Mock Data**: Delete files in `src/data/` and local `MOCK_DATA` constants.
2. **Type Safety**: Ensure all components use types from `src/types/`.
3. **Validation**:
   - `npm run typecheck`
   - `npm run lint`
   - Verify network requests in browser DevTools.
   - Test Auth redirects and Logout.
