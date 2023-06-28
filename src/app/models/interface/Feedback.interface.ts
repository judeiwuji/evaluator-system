export default interface Feedback {
  message?: string;
  success?: boolean;
  result?: any;
  results?: any[];
  page?: number;
  pages?: number;
  redirect?: string;
  errors?: string[];
}
