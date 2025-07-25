import type { AxiosResponse } from 'axios';
import axios from 'axios';
import type { Note, NoteTag } from '../types/note';

const API_URL = 'https://notehub-public.goit.study/api';
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

axios.defaults.headers.common['Authorization'] = `Bearer ${TOKEN}`;

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
  currentPage: number;
  totalNotes: number;
}

export async function fetchNotes(params: FetchNotesParams): Promise<FetchNotesResponse> {
  const response: AxiosResponse<FetchNotesResponse> = await axios.get(`${API_URL}/notes`, {
    params,
  });
  return response.data;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: NoteTag;
}

export async function createNote(payload: CreateNotePayload): Promise<Note> {
  const response: AxiosResponse<Note> = await axios.post(`${API_URL}/notes`, payload);
  return response.data;
}

export async function deleteNote(id: number): Promise<Note> {
  const response: AxiosResponse<Note> = await axios.delete(`${API_URL}/notes/${id}`);
  return response.data;
}
