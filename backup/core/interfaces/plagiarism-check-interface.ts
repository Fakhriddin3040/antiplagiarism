interface PlagiarismCheck {
  id: number;
  documentId: number;
  checkedAt: string;
  resultPercent: number;        // общий процент заимствования (например, максимальный или вычисленный)
  matches: PlagiarismMatch[];
}
interface PlagiarismMatch {
  sourceDocument: Document;
  percent: number;
  overlapWords: number;
}
