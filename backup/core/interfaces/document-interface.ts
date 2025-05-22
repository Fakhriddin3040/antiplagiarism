export interface Document {
  id: number;
  title: string;
  authorId: number;
  folderId: number;
  uploadDate: string;
  content?: string;
  status?: 'NEW' | 'CHECKED';
  plagiarismPercent?: number;
}
