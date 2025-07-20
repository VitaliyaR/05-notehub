import css from "./App.module.css";
import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";

import { fetchNotes } from "../../services/noteService";
import type { NotesResponse } from "../../services/noteService";

import Pagination from "../Pagination/Pagination";
import NoteList from "../NoteList/NoteList";
import NoteForm from "../NoteForm/NoteForm";
import Modal from "../Modal/Modal";
import SearchBox from "../SearchBox/SearchBox";
import Loader from "../Loader/Loader";
import ErrorMessage from "../Error/ErrorMessage";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const updateSearchQuery = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, 300);

  const handleSearch = (value: string) => {
    setSearchInput(value);
    updateSearchQuery(value);
  };

  const { data, isLoading, isError, isSuccess } = useQuery<NotesResponse>({
    queryKey: ["notes", searchQuery, currentPage],
    queryFn: () =>
      fetchNotes({
        page: currentPage,
        search: searchQuery.trim() || undefined,
      }),
    placeholderData: keepPreviousData,
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchInput} onSearch={handleSearch} />
        {isSuccess && data.totalPages > 1 && (
          <Pagination
            page={currentPage}
            total={data.totalPages}
            onChange={setCurrentPage}
          />
        )}
        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {isSuccess && data.results.length > 0 && (
        <NoteList notes={data.results} />
      )}
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onSuccess={closeModal} onCancel={closeModal} />
        </Modal>
      )}
    </div>
  );
}





