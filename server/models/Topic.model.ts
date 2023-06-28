export class CreateTopicRequest {
  constructor(
    public title: string,
    public description: string,
    public courseId: number
  ) {}
}

export class UpdateTopicRequest {
  constructor(
    public id: number,
    public courseId?: number,
    public title?: string,
    public description?: string
  ) {}
}

export class DeleteTopicRequest {
  constructor(public id: number) {}
}
