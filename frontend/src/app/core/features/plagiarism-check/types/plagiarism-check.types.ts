import {PlagiarismVerdict} from '../../document/types/document.types';

export type PlagiarismMatchedChunk = {
  matchedChunkId: string;
  sourceChunkId: string;
  similarity: number;
}

export type PlagiarismCheck = {
  verdict: PlagiarismVerdict;
  maxSimilarityScore: number;
  chunkCount: number;
  matchesCount: number;
  averageChunksSimilarity?: number;
  matchedChunks?: PlagiarismMatchedChunk[];
  coverage?: number;
}

export const PLAGIARISM_VERDICT_LABEL_MAP: Record<PlagiarismVerdict, string> = {
  [PlagiarismVerdict.PLAGIARISM]: 'Плагиат',
  [PlagiarismVerdict.PARTIAL_PLAGIARISM]: 'Частичный плагиат',
  [PlagiarismVerdict.UNIQUE]: 'Уникальный'
}
