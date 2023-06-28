export interface CreateDepartmentRequest {
  name: string;
}

export interface UpdateDepartmentRequest {
  id: number;
  name: string;
}

export interface Department {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}
