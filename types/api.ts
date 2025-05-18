import { Path } from 'react-hook-form';

type ErrorResponse = {
  status_code: number;
  success: boolean;
  error: {
    code: string;
    error_code: string;
    errors: { error_code: string; field: Path<unknown>; message: string }[];
    message: string;
  };
};

type MetaResponse = {
  currentPage: number | null
  itemCount: number | null
  itemsPerPage: number | null
  totalItems: number | null
  totalPages: number | null
}

type MessageResponse = {
  message: string;
};

type StatusResponse = {
  status: string;
};

export type { ErrorResponse, MessageResponse, StatusResponse, MetaResponse };
