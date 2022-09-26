export type ErrorType = '' | 'info' | 'success' | 'warning' | 'error';

export interface AlertStore {
  message: string;
  type: ErrorType;
}
