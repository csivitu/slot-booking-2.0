export interface ResponseError {
    message?: string;
    errorDetails: unknown;
    code?: number;
  }
  
  export interface FailedType extends Required<ResponseError> {
    id: string;
  }
  