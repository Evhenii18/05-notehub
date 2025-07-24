import axios from "axios";
import type { Note } from "../types/note";

const API = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
  },
});

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  page: number,
  limit: number,
  search: string
): Promise<FetchNotesResponse> => {
  const params: Record<string, string> = {
    page: page.toString(),
    limit: limit.toString(),
  };
  if (search.trim()) {
    params.search = search.trim();
  }

  const response = await API.get<FetchNotesResponse>('/notes', { params });
  return response.data;
};


export async function createNote(
  note: Omit<Note, "id" | "createdAt" | "updatedAt">
): Promise<Note> {
  const response = await API.post<Note>("/notes", note);
  return response.data;
}

export async function deleteNote(id: number): Promise<void> {
  await API.delete<void>(`/notes/${id}`);
}
