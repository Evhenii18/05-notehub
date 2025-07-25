import React, { useState, useMemo } from "react";
import debounce from "lodash/debounce";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import css from "./App.module.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNotes, createNote, deleteNote } from "../../services/noteService";
import type { Note } from "../../types/note";

type FetchNotesResult = {
  notes: Note[];
  totalPages: number;
};
const ITEMS_PER_PAGE = 12;

const App: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const debouncedSetSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearch(value);
        setCurrentPage(1);
      }, 300),
    []
  );

  const handleSearchChange = (value: string) => {
    setInputValue(value);
    debouncedSetSearch(value);
  };

  const { data, isLoading, isError } = useQuery<FetchNotesResult, Error>({
    queryKey: ["notes", currentPage, search],
    queryFn: () => fetchNotes(currentPage, ITEMS_PER_PAGE, search),
    staleTime: 5 * 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setIsModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const handleCreateNote = (note: Omit<Note, "id">) => {
    createMutation.mutate(note);
  };

  const handleDeleteNote = (id: number) => {
    deleteMutation.mutate(id);
  };

  return (
    <div
      className={css.app}
      style={{ height: "100vh", display: "flex", flexDirection: "column" }}
    >
      <header className={css.header}>
        <SearchBox value={inputValue} onChange={handleSearchChange} />
        {data?.totalPages && data.totalPages > 0 && (
          <Pagination
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            pageCount={data.totalPages}
          />
        )}
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>
      <main className={css.main} style={{ flexGrow: 1, overflowY: "auto" }}>
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error loading notes.</p>}
        {!isLoading && data && (
          <NoteList notes={data.notes} onDelete={handleDeleteNote} />
        )}
      </main>
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onSubmit={handleCreateNote}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default App;
