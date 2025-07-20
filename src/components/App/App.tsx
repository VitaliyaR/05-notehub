import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';


import { fetchNotes, deleteNote } from '../../services/noteService';
import type { FetchNotesResponse } from '../../services/noteService';

import NoteList from '../NoteList/NoteList';
import NoteForm from '../NoteForm/NoteForm';
import Modal from '../Modal/Modal';
import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';

import css from './App.module.css';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [debouncedSearch] = useDebounce(search, 300);

  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isError,
  } = useQuery<FetchNotesResponse>({
    queryKey: ['notes', { page, search: debouncedSearch }],
    queryFn: () => fetchNotes({ page, search: debouncedSearch }),
    keepPreviousData: true,
  });

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleNoteCreated = () => {
    queryClient.invalidateQueries({ queryKey: ['notes'] });
    setSearch('');
    setPage(1);
    handleCloseModal();
  };

  const handleDeleteNote = async (id: string) => {
    await deleteNote(id);
    queryClient.invalidateQueries({ queryKey: ['notes'] });
  };

  const hasNotes = !!data?.results?.length;

  return (
    <div className={css.container}>
      <SearchBox value={search} onChange={setSearch} />

      <button className={css.button} onClick={handleOpenModal}>
        Create note +
      </button>

      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading notes</p>}

      {hasNotes && (
        <NoteList notes={data!.results} onDelete={handleDeleteNote} />
      )}

      {hasNotes && data!.totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={data!.totalPages}
          onPageChange={setPage}
        />
      )}

      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <NoteForm onClose={handleCloseModal} onCreated={handleNoteCreated} />
        </Modal>
      )}
    </div>
  );
}

export default App;






