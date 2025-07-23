import React, { useState, useMemo, useEffect } from "react";
import debounce from "lodash/debounce";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import css from "./App.module.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNotes, deleteNote } from "../../services/noteService";

const App: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const queryClient = useQueryClient();

  useEffect(() => {
    const updateItemsPerPage = () => {
      const availableHeight = window.innerHeight - 250;
      const itemHeight = 150;
      const perPage = Math.max(1, Math.floor(availableHeight / itemHeight));
      setItemsPerPage(perPage);
    };
    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

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

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", currentPage, search, itemsPerPage],
    queryFn: () => fetchNotes(currentPage, itemsPerPage, search),
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const handleDeleteNote = (id: number) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className={css.app}>
      <header className={css.header}>
        <SearchBox value={inputValue} onChange={handleSearchChange} />
        {data?.totalPages !== undefined && (
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
      <main className={css.main}>
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error loading notes.</p>}
        {!isLoading && data && (
          <NoteList notes={data.notes} onDelete={handleDeleteNote} />
        )}
      </main>
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onCancel={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
};

export default App;
