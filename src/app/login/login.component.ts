import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginRequest } from '../models/Auth.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  formData: FormGroup;
  isProcessing = false;
  passwordType = 'password';
  isLoggedIn = false;

  constructor(
    private readonly authService: AuthService,
    private readonly toastr: ToastrService,
    private readonly router: Router
  ) {
    this.formData = new FormGroup({
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
    this.isLoggedIn = authService.isLoggedIn;
  }

  ngOnInit(): void {}

  get fd() {
    return this.formData.controls;
  }

  login() {
    if (this.isProcessing) return;
    this.isProcessing = true;
    this.toggleInputs();
    const request = new LoginRequest(
      this.fd['email'].value,
      this.fd['password'].value
    );

    this.authService.login(request).subscribe((response) => {
      this.isProcessing = false;
      this.toggleInputs();
      console.log(response);
      if (response.success) {
        this.router.navigate([response.redirect]);
      } else {
        this.toastr.error(response.message, '', { timeOut: 2000 });
      }
    });
  }

  toggleInputs() {
    if (this.isProcessing) {
      this.fd['email'].disable();
      this.fd['password'].disable();
    } else {
      this.fd['email'].enable();
      this.fd['password'].enable();
    }
  }

  togglePassword() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
  }

  reset() {
    this.formData.reset();
  }
}
