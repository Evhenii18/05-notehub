import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../services/noteService";
import css from "./NoteForm.module.css";
import type { Note } from "../../types/note";

type NoteFormProps = {
  onCancel: () => void;
};

type NewNote = {
  title: string;
  content: string;
  tag: Note["tag"];
};

const NoteForm: React.FC<NoteFormProps> = ({ onCancel }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newNote: NewNote) => createNote(newNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onCancel();
    },
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      content: "",
      tag: "personal" as Note["tag"],
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      content: Yup.string().required("Content is required"),
      tag: Yup.string()
        .oneOf(["personal", "work", "study"])
        .required("Tag is required"),
    }),
    onSubmit: (values) => {
      mutation.mutate(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className={css.form}>
      <input
        className={css.input}
        name="title"
        placeholder="Title"
        onChange={formik.handleChange}
        value={formik.values.title}
      />
      <textarea
        className={css.textarea}
        name="content"
        placeholder="Content"
        onChange={formik.handleChange}
        value={formik.values.content}
      />
      <select
        className={css.select}
        name="tag"
        onChange={formik.handleChange}
        value={formik.values.tag}
      >
        <option value="personal">Personal</option>
        <option value="work">Work</option>
        <option value="study">Study</option>
      </select>
      <div className={css.actions}>
        <button
          className={css.submitButton}
          type="submit"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Saving..." : "Save"}
        </button>
        <button className={css.cancelButton} type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default NoteForm;
