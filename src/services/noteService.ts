import axios from 'axios';
import type { Note } from '../types/note';

const BASE_URL = 'https://notehub-public.goit.study/api';
const token = import.meta.env.VITE_NOTEHUB_TOKEN;
const headers = {
  Authorization: `Bearer ${token}`,
};

export const fetchNotes = async (
  page: number,
  perPage: number,
  search: string = ''
): Promise<{ notes: Note[]; totalPages: number }> => {
  const params: {
    page: number;
    perPage: number;
    search?: string;
  } = {
    page,
    perPage,
  };

  if (search.trim()) {
    params.search = search.trim();
  }

  const response = await axios.get(`${BASE_URL}/notes`, {
    headers,
    params,
  });
  return response.data;
};

export const createNote = async (note: Omit<Note, 'id'>): Promise<Note> => {
  const response = await axios.post(`${BASE_URL}/notes`, note, { headers });
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await axios.delete(`${BASE_URL}/notes/${id}`, { headers });
  return response.data;
};
