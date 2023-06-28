export class UpdateUserRequest {
  constructor(
    public id: number,
    public surname?: string,
    public othernames?: string,
    public email?: string,
    public avatar?: string
  ) {}
}

export class DeleteUserActivityRequest {
  constructor(public id: number) {}
}

export class UploadAvatarRequest {
  public filepath: string;
  constructor(public filename: string, userId: number) {
    this.filepath =
      process.env['NODE_ENV'] === 'production'
        ? filename
        : `/images/${filename}`;
  }
}
