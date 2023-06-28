export class CreateAdminRequest {
  public type?: string;
  constructor(
    public surname: string,
    public othernames: string,
    public email: string,
    public password: string
  ) {}
}

export class UpdateAdminRequest {
  constructor(
    public id: number,
    public surname?: string,
    public othernames?: string,
    public email?: string,
    public password?: string
  ) {}
}

export class DeleteAdminRequest {
  constructor(public id: number) {}
}
