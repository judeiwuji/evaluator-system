export interface ChangePasswordRequest {
  newPassword: string;
  oldPassword: string;
}

export interface ResetPasswordRequest {
  email: string;
}
