export class CreateTeacherRequest {
  public type?: string;
  constructor(
    public surname: string,
    public othernames: string,
    public email: string,
    public password: string,
    public deptId: number
  ) {}
}

export class UpdateTeacherRequest {
  constructor(
    public id: number,
    public surname?: string,
    public othernames?: string,
    public email?: string,
    public levelId?: any,
    public deptId?: any,
    public password?: string
  ) {}
}

export class DeleteTeacherRequest {
  constructor(public id: number) {}
}
