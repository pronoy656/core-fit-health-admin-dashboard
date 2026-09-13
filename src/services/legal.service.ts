import { del, get, patch, post } from "@/lib/api";
import {
  CreateLegalPayload,
  DeleteLegalResponse,
  getLegalId,
  LegalPage,
  LegalPageListItem,
  UpdateLegalPayload
} from "@/types";

export const legalService = {
  /**
   * Get all legal pages list (public)
   * Normalizes response arrays and IDs from various backend envelope formats
   */
  getAll: async (signal?: AbortSignal): Promise<LegalPageListItem[]> => {
    const res = await get<any>("/legal", { signal });

    let rawList: any[] = [];
    if (Array.isArray(res)) {
      rawList = res;
    } else if (Array.isArray(res?.data)) {
      rawList = res.data;
    } else if (Array.isArray(res?.data?.data)) {
      rawList = res.data.data;
    } else if (Array.isArray(res?.data?.result)) {
      rawList = res.data.result;
    } else if (Array.isArray(res?.data?.legalPages)) {
      rawList = res.data.legalPages;
    } else if (Array.isArray(res?.data?.legal)) {
      rawList = res.data.legal;
    } else if (Array.isArray(res?.result)) {
      rawList = res.result;
    }

    return rawList.map((item) => {
      const id = getLegalId(item);
      return {
        ...item,
        _id: id,
        id: id,
        title: item.title || "Untitled Document",
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: item.updatedAt || item.createdAt || new Date().toISOString()
      };
    });
  },

  /**
   * Get single legal page details (public)
   */
  getById: async (id: string, signal?: AbortSignal): Promise<LegalPage> => {
    if (!id || id === "undefined" || id === "null") {
      throw new Error("Valid MongoDB Document ID is required");
    }

    const res = await get<any>(`/legal/${id}`, { signal });
    const data = res?.data?.data || res?.data || res;
    const resolvedId = getLegalId(data) || id;

    return {
      ...data,
      _id: resolvedId,
      id: resolvedId,
      title: data.title || "Untitled Document",
      content: data.content || "",
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || data.createdAt || new Date().toISOString()
    };
  },

  /**
   * Create new legal page (admin only)
   */
  create: async (payload: CreateLegalPayload): Promise<LegalPage> => {
    const res = await post<any, CreateLegalPayload>("/legal", payload);
    const data = res?.data?.data || res?.data || res;
    const resolvedId = getLegalId(data);

    return {
      ...data,
      _id: resolvedId,
      id: resolvedId
    };
  },

  /**
   * Update existing legal page (admin only)
   */
  update: async (id: string, payload: UpdateLegalPayload): Promise<LegalPage> => {
    if (!id || id === "undefined" || id === "null") {
      throw new Error("Valid MongoDB Document ID is required for update");
    }

    const res = await patch<any, UpdateLegalPayload>(`/legal/${id}`, payload);
    const data = res?.data?.data || res?.data || res;
    const resolvedId = getLegalId(data) || id;

    return {
      ...data,
      _id: resolvedId,
      id: resolvedId
    };
  },

  /**
   * Delete legal page (admin only)
   */
  delete: async (id: string): Promise<DeleteLegalResponse> => {
    if (!id || id === "undefined" || id === "null") {
      throw new Error("Valid MongoDB Document ID is required for deletion");
    }

    return await del<DeleteLegalResponse>(`/legal/${id}`);
  }
};
