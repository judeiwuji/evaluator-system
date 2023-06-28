export class CreateDepartmentRequest {
  constructor(public name: string) {}
}

export class UpdateDepartmentRequest {
  constructor(public id: number, public name: string) {}
}

export class DeleteDepartmentRequest {
  constructor(public id: number) {}
}
