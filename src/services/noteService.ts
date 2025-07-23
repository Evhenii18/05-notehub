import axios from "axios";
import type { Note } from "../types/note";



const API = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
  },
});

export const fetchNotes = async (
  page: number,
  perPage: number,
  query: string
): Promise<{ notes: Note[]; totalPages: number }> => {
  const response = await API.get("/notes", {
    params: {
      page,
      perPage,
      ...(query.trim() !== "" ? { q: query } : {}),
    },
  });
  return response.data;
};

export const createNote = async (note: Omit<Note, "id" | "createdAt" | "updatedAt">): Promise<Note> => {
  const response = await API.post<Note>("/notes", note);
  return response.data;
};

export const deleteNote = async (id: number): Promise<void> => {
  await API.delete<void>(`/notes/${id}`);
};

