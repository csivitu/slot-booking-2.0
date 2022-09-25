export interface ResponseError {
  message?: string;
  error: unknown;
  code?: number;
}

export interface FailedType extends Required<ResponseError> {
  id: string;
}
