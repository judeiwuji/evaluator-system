export class CreateQuestionRequest {
  constructor(
    public question: string,
    public answer: string,
    public timeout: number,
    public score: number,
    public quizId: number,
    public options: string[]
  ) {}
}

export class UpdateQuestionRequest {
  constructor(
    public id: number,
    public question?: string,
    public answer?: string,
    public timeout?: number,
    public score?: number,
    public quizId?: number
  ) {}
}

export class DeleteQuestionRequest {
  constructor(public id: number) {}
}

export class CreateQuestionOptionRequest {
  constructor(public option: string, public questionId: number) {}
}

export class UpdateQuestionOptionRequest {
  constructor(public id: number, public option?: string) {}
}

export class DeleteQuestionOptionRequest {
  constructor(public id: number) {}
}

export class ProcessQuestionUploadRequest {
  constructor(public quizId: number, public filename: string) {}
}

export class UploadQuestionRequest {
  constructor(
    public Score: number,
    public Timeout: number,
    public Question: string,
    public Answer: string,
    public OptionA?: string,
    public OptionB?: string,
    public OptionC?: string,
    public OptionD?: string
  ) {}
}
