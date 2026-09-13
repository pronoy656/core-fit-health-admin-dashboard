import { ApiResponse } from "./auth";

export interface LegalPageListItem {
  _id?: string;
  id?: string;
  legalId?: string;
  documentId?: string;
  title: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LegalPage {
  _id?: string;
  id?: string;
  legalId?: string;
  documentId?: string;
  title: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateLegalPayload {
  title: string;
  content: string;
}

export interface UpdateLegalPayload {
  title?: string;
  content?: string;
}

export type LegalPagesListResponse = ApiResponse<LegalPageListItem[]>;
export type LegalPageResponse = ApiResponse<LegalPage>;
export type DeleteLegalResponse = ApiResponse<null> | { success: boolean; statusCode: number; message: string };

export function getLegalId(item?: any): string {
  if (!item) return "";
  if (typeof item === "string") {
    return item === "undefined" || item === "null" ? "" : item;
  }
  const id =
    item._id ||
    item.id ||
    item.legalId ||
    item.documentId ||
    item._doc?._id ||
    item._doc?.id ||
    "";
  if (id === "undefined" || id === "null") return "";
  return String(id);
}
