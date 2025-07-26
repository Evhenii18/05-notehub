import React, { useState, useMemo } from "react";
import debounce from "lodash/debounce";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import Modal from "../Modal/Modal";
import NoteForm, { type NoteFormValues } from "../NoteForm/NoteForm";
import css from "./App.module.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNotes, createNote } from "../../services/noteService";
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
    placeholderData: (previousData) => previousData,
  });

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setIsModalOpen(false);
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error("Create note error:", error.message);
      } else {
        console.error("Create note error:", error);
      }
    },
  });

  const handleCreateNote = (note: NoteFormValues) => {
    createMutation.mutate(note);
  };

  return (
    <div
      className={css.app}
      style={{ height: "100vh", display: "flex", flexDirection: "column" }}
    >
      <header className={css.header}>
        <SearchBox value={inputValue} onChange={handleSearchChange} />

        {data?.totalPages && data.totalPages > 1 && (
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

        {!isLoading && data && data.notes.length > 0 && (
          <NoteList notes={data.notes} />
        )}

        {!isLoading && data && data.notes.length === 0 && (
          <p>No notes found.</p>
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
