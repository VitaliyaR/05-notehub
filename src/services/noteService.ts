

import axios from 'axios';
import type { Note, NoteTag } from '../types/note';

const BASE_URL = 'https://notehub-public.goit.study/api/notes';
const token = import.meta.env.VITE_NOTEHUB_TOKEN;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});


export interface FetchNotesResponse {
  results: Note[];
  totalPages: number;
}

interface FetchNotesParams {
  page?: number;
  search?: string; 
}

interface CreateNoteParams {
  title: string;
  content: string;
  tag: NoteTag;
}


export const fetchNotes = async ({
  page = 1,
  search = '',
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const params: { page: number; perPage: number; search?: string } = {
    page,
    perPage: 12,
  };

  if (search.trim()) {
    params.search = search.trim();
  }

  const res = await api.get<FetchNotesResponse>('/', { params });
  return res.data;
};


export const createNote = async ({
  title,
  content,
  tag,
}: CreateNoteParams): Promise<Note> => {
  const res = await api.post<Note>('/', { title, content, tag });
  return res.data;
};


export const deleteNote = async (id: string): Promise<Note> => {
  const res = await api.delete<Note>(`/${id}`);
  return res.data;
};


