export default class Pagination {
  public skip = 0;
  public take = 0;
  public totalPages = 0;
  constructor(
    public page: number,
    public pageSize: number,
    public totalItems: number
  ) {
    this.skip = (this.page - 1) * this.pageSize;
    this.take = this.pageSize;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
  }
}
