export class CreateAnswerRequest {
  constructor(
    public studentId: number,
    public questionId: number,
    public quizId: number,
    public answer: string
  ) {}
}

export class StudentViewQuizResultRequest {
  constructor(public studentId: number, public quizId: number) {}
}

export class StudentViewQuizzesResultRequest {
  constructor(public studentId: number) {}
}

export class QuizViewResultsRequest {
  constructor(public quizId: number) {}
}

export class QuizGenerateReportRequest {
  constructor(public quizId: number) {}
}
