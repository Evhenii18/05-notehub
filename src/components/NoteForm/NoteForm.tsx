import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import css from "./NoteForm.module.css";
import type { Note } from "../../types/note";

interface NoteFormProps {
  onSubmit: (data: Omit<Note, "id">) => void;
  onCancel: () => void;
}

type NoteFormValues = {
  title: string;
  content: string;
  tag: Note["tag"];
};

const validationSchema = Yup.object({
  title: Yup.string().min(3).max(50).required("Required"),
  content: Yup.string().max(500),
  tag: Yup.string()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
    .required("Required"),
});

const NoteForm: React.FC<NoteFormProps> = ({ onSubmit, onCancel }) => {
  const formik = useFormik<NoteFormValues>({
    initialValues: { title: "", content: "", tag: "Todo" },
    validationSchema,
    onSubmit: (values) => onSubmit(values),
  });

  return (
    <form className={css.form} onSubmit={formik.handleSubmit}>
      <div className={css.forGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          className={css.input}
          onChange={formik.handleChange}
          value={formik.values.title}
        />
        {formik.touched.title && formik.errors.title && (
          <span className={css.error}>{formik.errors.title}</span>
        )}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          onChange={formik.handleChange}
          value={formik.values.content}
        />
        {formik.touched.content && formik.errors.content && (
          <span className={css.error}>{formik.errors.content}</span>
        )}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          onChange={formik.handleChange}
          value={formik.values.tag}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
        {formik.touched.tag && formik.errors.tag && (
          <span className={css.error}>{formik.errors.tag}</span>
        )}
      </div>

      <div className={css.actions}>
        <button type="button" className={css.cancelButton} onClick={onCancel}>
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={!formik.isValid}
        >
          Create note
        </button>
      </div>
    </form>
  );
};

export default NoteForm;
