import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ChangePasswordRequest } from 'src/app/models/interface/App.interface';
import {
  UpdateUserRequest,
  User,
} from 'src/app/models/interface/User.interface';
import { AppValidators } from 'src/app/models/validator/App.validator';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user: User | undefined;
  profileForm: FormGroup = new FormGroup({
    surname: new FormControl(''),
    othernames: new FormControl(''),
    email: new FormControl(''),
  });
  passwordForm: FormGroup;

  processing = false;

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly appService: AppService,
    private readonly toastr: ToastrService,
    private readonly fb: FormBuilder
  ) {
    this.passwordForm = this.fb.group(
      {
        oldPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required]],
        confirmPassword: [''],
      },
      {
        validators: [AppValidators.mustMatch('newPassword', 'confirmPassword')],
      }
    );
  }

  ngOnInit(): void {
    this.authService.currentUser().subscribe((response) => {
      if (response.success) {
        this.user = response.result;
        this.profileForm = new FormGroup({
          surname: new FormControl(this.user?.surname),
          othernames: new FormControl(this.user?.othernames),
          email: new FormControl(this.user?.email),
        });
      }
    });
  }

  get pf() {
    return this.passwordForm.controls;
  }

  onSaveChanges() {
    if (this.processing) return;
    this.processing = true;
    this.toastr.info('Saving...', '', { disableTimeOut: true });
    let request: UpdateUserRequest = {
      surname: this.profileForm.get('surname')?.value,
      othernames: this.profileForm.get('othernames')?.value,
      email: this.profileForm.get('email')?.value,
    };

    this.userService.findAndUpdate(request).subscribe((response) => {
      this.toastr.clear();
      this.processing = false;
      if (response.success) {
        this.toastr.success('Saved!');
      } else {
        this.toastr.error(response.message);
      }
    });
  }

  onChangePassword() {
    if (this.processing) return;
    this.processing = true;
    this.toastr.info('Saving...', '', { disableTimeOut: true });
    const request: ChangePasswordRequest = {
      newPassword: this.passwordForm.get('newPassword')?.value,
      oldPassword: this.passwordForm.get('oldPassword')?.value,
    };

    this.appService.changePassword(request).subscribe((response) => {
      this.toastr.clear();
      this.processing = false;
      if (response.success) {
        this.toastr.success('Changed!');
        this.passwordForm.reset();
      } else {
        this.toastr.error(response.message);
      }
    });
  }

  uploadAvatar(event: any) {
    const file = event?.target.files[0];
    const formdata = new FormData();
    formdata.append('avatar', file);
    this.toastr.info('Please wait...', '', { disableTimeOut: true });
    this.userService.uploadAvatar(formdata).subscribe((response) => {
      this.toastr.clear();
      if (response.success) {
        this.toastr.success('Uploaded!');
        if (this.user) this.user.avatar = `${response.result}`;
      } else {
        this.toastr.error(response.message);
      }
    });
  }
}
