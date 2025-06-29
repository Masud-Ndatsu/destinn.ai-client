export interface Opportunity {
  id: string;
  title: string;
  category: string;
  location: string;
  deadline: string;
  status: "published" | "draft";
}
