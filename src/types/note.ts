export type Note = {
  id: number;
  title: string;
  content: string;
  tag: "toDo" | "work" | "important";
  createdAt: string;
  updatedAt: string;
};
