import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import type { NoteTag } from "../../types/note";
import { createNote } from "../../services/noteService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import css from "./NoteForm.module.css";

interface NoteFormProps {
  onClose: () => void;
}

interface NoteFormValues {
  title: string;
  content: string;
  tag: NoteTag;
}

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be at most 50 characters")
    .required("Required"),
  content: Yup.string().max(500, "Content must be at most 500 characters"),
  tag: Yup.mixed<NoteTag>()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
    .required("Required"),
});

const NoteForm: React.FC<NoteFormProps> = ({ onClose }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation(createNote, {
    onSuccess: () => {
      queryClient.invalidateQueries(["notes"]);
      onClose();
    },
  });

  const formik = useFormik<NoteFormValues>({
    initialValues: {
      title: "",
      content: "",
      tag: "Todo",
    },
    validationSchema,
    onSubmit: (values) => {
      mutation.mutate(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          className={css.input}
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.title && formik.errors.title ? (
          <span className={css.error}>{formik.errors.title}</span>
        ) : null}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          value={formik.values.content}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.content && formik.errors.content ? (
          <span className={css.error}>{formik.errors.content}</span>
        ) : null}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          value={formik.values.tag}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
        {formik.touched.tag && formik.errors.tag ? (
          <span className={css.error}>{formik.errors.tag}</span>
        ) : null}
      </div>

      <div className={css.actions}>
        <button type="button" className={css.cancelButton} onClick={onClose}>
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={mutation.isLoading}
        >
          Create note
        </button>
      </div>
    </form>
  );
};

export default NoteForm;
