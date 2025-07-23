export type Note = {
  id: number;
  title: string;
  content: string;
  tag: "personal" | "work" | "important";
  createdAt: string;
  updatedAt: string;
};
