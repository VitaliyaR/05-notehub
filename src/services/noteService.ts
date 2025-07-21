import axios from "axios";
import type { Note, NewNoteData } from "../types/note";

const API_URL = `https://notehub-public.goit.study/api`;
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

export interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

interface FetchNotesParams {
  search?: string;
  tag?: string;
  page?: number;
  perPage?: number;
  sortBy?: "createdAt" | "updatedAt" | "title";
}

export async function fetchNotes({
  search = "",
  tag,
  page = 1,
  perPage = 12,
  sortBy = "createdAt",
}: FetchNotesParams = {}): Promise<NotesResponse> {
  try {
    const response = await axios.get<NotesResponse>(`${API_URL}/notes`, {
      params: {
        search,
        tag,
        page,
        perPage,
        sortBy,
      },
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch notes:", error);
    throw error;
  }
}

export async function createNote(data: NewNoteData): Promise<Note> {
  try {
    const response = await axios.post<Note>(`${API_URL}/notes`, data, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to create note:", error);
    throw error;
  }
}

export async function deleteNote(noteId: string | number): Promise<Note> {
  try {
    const response = await axios.delete<Note>(`${API_URL}/notes/${noteId}`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to delete note:", error);
    throw error;
  }
}