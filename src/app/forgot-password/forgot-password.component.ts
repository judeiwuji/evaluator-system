import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { MessageBoxComponent } from '../modals/message-box/message-box.component';
import { ResetPasswordRequest } from '../models/interface/App.interface';
import { MessageBoxSetting, MessageBoxType } from '../models/MessageBox.model';
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit {
  public formGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });
  processing = false;

  constructor(
    private readonly appService: AppService,
    private readonly toastr: ToastrService,
    private readonly modal: NgbModal
  ) {}

  resetPassword() {
    if (this.processing) return;
    this.processing = true;
    this.toastr.info('Resetting...', '', { disableTimeOut: true });
    const request: ResetPasswordRequest = {
      email: this.formGroup.get('email')?.value,
    };
    this.appService.resetPassword(request).subscribe((response) => {
      this.toastr.clear();
      this.processing = false;
      if (response.success) {
        this.toastr.success('Done!', '', { timeOut: 3000 });
        this.showPassword(response.result);
        this.processing = false;
        this.formGroup.reset();
      } else {
        this.toastr.error(response.message);
      }
    });
  }

  showPassword(password: string) {
    const modalInstance = this.modal.open(MessageBoxComponent, {
      size: 'sm',
      backdrop: 'static',
      windowClass: 'modal-rounded',
    });

    modalInstance.componentInstance.settings = new MessageBoxSetting(
      '',
      password,
      MessageBoxType.Success
    );
  }

  ngOnInit(): void {}
}
