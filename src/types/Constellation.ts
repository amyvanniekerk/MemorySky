export interface Constellation {
  id: string;
  name: string;
  color: string;
  memoryIds: string[]; // ordered — lines connect adjacent entries
}
