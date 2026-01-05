/* eslint-disable no-unused-vars */

export type InputProps = {
  id?: string;
  type?: string;
  name: string;
  placeholder?: string;
  className?: string;
  defaultValue?: string;
  required?: boolean;
  value?: string;
  onChange?: any;
  readonly?: boolean;
  enableDarkMode?: boolean;
  checked?: boolean;
  disabled?: boolean;
};

export type SelectProps = {
  name: string;
  defaultValue?: string;
  className?: string;
  data: string[] | any[];
  required?: boolean;
  value?: string | string[];
  onChange?: any;
  multiple?: boolean;
};

export interface DoughnutChartProps {
  title: string;
  data: {
    type: string;
    count: number;
    color: string;
  }[];
}

export interface signInProps {
  email: string;
  password: string;
  environment: string;
  timezone: string;
}

export interface GenericResponse {
  statusCode: number;
  message: string;
}

export interface GenericResponseAlt<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface PaginationProps {
  page?: number;
  limit?: number;
  q?: string;
  startDate?: string;
  endDate?: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}

// Export order types
export * from './order';
