export class CreateCourseRequest {
  constructor(
    public code: string,
    public title: string,
    public teacherId: number
  ) {}
}

export class UpdateCourseRequest {
  constructor(
    public id: number,
    public teacherId: number,
    public code?: string,
    public title?: string
  ) {}
}

export class DeleteCourseRequest {
  constructor(public id: number) {}
}
