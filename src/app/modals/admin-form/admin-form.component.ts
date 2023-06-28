import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import {
  CreateAdminRequest,
  UpdateAdminRequest,
} from 'server/models/Admin.model';
import { Admin } from 'src/app/models/interface/User.interface';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-admin-form',
  templateUrl: './admin-form.component.html',
  styleUrls: ['./admin-form.component.css'],
})
export class AdminFormComponent implements OnInit {
  @Input()
  admin: Admin | undefined;
  formData: FormGroup = new FormGroup({});
  processing = false;

  constructor(
    private readonly adminService: AdminService,
    private readonly activeModal: NgbActiveModal,
    private readonly toastr: ToastrService
  ) {}

  close() {
    this.activeModal.dismiss();
  }

  get fd() {
    return this.formData.controls;
  }

  create() {
    if (this.processing) return;
    this.processing = true;
    const request: CreateAdminRequest = {
      surname: this.fd['surname'].value,
      othernames: this.fd['othernames'].value,
      email: this.fd['email'].value,
      password: this.fd['password'].value,
    };

    this.adminService.create(request).subscribe((response) => {
      this.processing = false;
      if (response.success) {
        this.toastr.success('Added', '', { timeOut: 2000 });
        this.activeModal.close(response.result);
      } else {
        this.toastr.error(response.message, '', { timeOut: 2000 });
      }
    });
  }

  update() {
    const request: UpdateAdminRequest = {
      id: this.admin?.id as number,
      surname: this.fd['surname'].value,
      othernames: this.fd['othernames'].value,
      email: this.fd['email'].value,
    };

    this.toastr.info('Saving...', '', { disableTimeOut: true });

    this.adminService.findAndUpdate(request).subscribe((response) => {
      this.toastr.clear();
      if (response.success) {
        this.toastr.success('Saved!', '', { timeOut: 2000 });
        if (this.admin) {
          this.admin.user.surname = this.fd['surname'].value;
          this.admin.user.othernames = this.fd['othernames'].value;
          this.admin.user.email = this.fd['email'].value;
          this.activeModal.dismiss();
        }
      } else {
        this.toastr.error(response.message, '', { timeOut: 2000 });
      }
    });
  }

  ngOnInit(): void {
    this.formData = new FormGroup({
      surname: new FormControl(this.admin ? this.admin.user.surname : '', [
        Validators.required,
      ]),
      othernames: new FormControl(
        this.admin ? this.admin.user.othernames : '',
        [Validators.required]
      ),
      email: new FormControl(this.admin ? this.admin.user.email : '', [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl('', [Validators.required]),
    });
  }
}
