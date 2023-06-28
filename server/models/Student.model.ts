export class CreateStudentRequest {
  public type?: string;
  constructor(
    public surname: string,
    public othernames: string,
    public email: string,
    public password: string,
    public regNo: string,
    public levelId: number,
    public deptId: number
  ) {}
}

export class UpdateStudentRequest {
  constructor(
    public id: number,
    public surname?: string,
    public othernames?: string,
    public email?: string,
    public password?: string,
    public regNo?: string,
    public levelId?: any,
    public deptId?: any
  ) {}
}

export class DeleteStudentRequest {
  constructor(public id: number) {}
}
