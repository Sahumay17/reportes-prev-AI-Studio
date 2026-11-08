export type ReportType = 'c' | 'p' | 'g' | 'e' | 'f' | 'a' | 'h' | 'i';

export interface PhotoItem {
  id: string;
  c: string; // caption
  w: number;
  h: number;
  dataURL?: string;
  blob?: Blob;
  url?: string;
}

export interface ReportTab {
  id: ReportType;
  tab: string;
  title: string;
  sub: string;
}

export interface StorageEstimate {
  usage: number;
  quota: number;
  ratio: number;
}

export interface StatusCounts {
  good: number;
  warn: number;
  bad: number;
  pending: number;
}
