export type ToastType = 'success' | 'error' | 'info';

export type HubItemType =
  | 'Article'
  | 'Guide'
  | 'Cheat Sheet'
  | 'Checklist'
  | 'OSCE'
  | 'Glossary'
  | 'Revision Resource';

export interface HubItemSummary {
  hubItemId: string;
  title: string;
  href: string;
  type: HubItemType;
  description?: string;
  tags?: string[];
}

export interface Folder {
  id: number;
  name: string;
  colour: string;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
  containsItem?: boolean;
}

export interface BookmarkFolderSummary {
  id: number;
  name: string;
  colour: string;
}

export interface BookmarkItem {
  id: number;
  folderId: number;
  hubItemId: string;
  savedAt: string;
  item: HubItemSummary;
  folder?: BookmarkFolderSummary;
}

export interface FolderListResponse {
  folders: Folder[];
}

export interface BookmarkListResponse {
  items: BookmarkItem[];
}

export interface FolderPayload {
  id: number;
  name: string;
  colour: string;
  created_at: string;
  updated_at: string;
}

export interface BookmarkPayload {
  id: number;
  folder_id: number;
  hub_item_id: string;
  saved_at: string;
}

export interface DeleteFolderPayload {
  success: true;
  itemsDeleted: number;
}

export interface DeleteBookmarkPayload {
  success: true;
}
