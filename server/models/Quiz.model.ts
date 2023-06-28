export class CreateQuizRequest {
  constructor(
    public title: string,
    public token: string,
    public topicId: number
  ) {}
}

export class UpdateQuizRequest {
  constructor(
    public id: number,
    public title?: string,
    public token?: string,
    public active?: boolean,
    public topicId?: number
  ) {}
}

export class DeleteQuizRequest {
  constructor(public id: number) {}
}

export class ValidateQuizTokenRequest {
  constructor(public quizId: number, public token: string) {}
}
