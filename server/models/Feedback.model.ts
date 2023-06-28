export class Feedback {
  result?: any;
  results?: any[];
  page?: number;
  pages?: number;
  errors?: string[];
  redirect?: string;
  constructor(public success: boolean, public message: string) {}
}

export class UploadFeedback {
  fields: any;
  urls: string[] = [];
  message = '';
  constructor(public success: boolean) {}
}
