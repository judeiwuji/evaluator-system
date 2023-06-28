import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import {
  CreateDepartmentRequest,
  Department,
  UpdateDepartmentRequest,
} from 'src/app/models/interface/Department.interface';
import { DepartmentService } from 'src/app/services/department.service';

@Component({
  selector: 'app-department-form',
  templateUrl: './department-form.component.html',
  styleUrls: ['./department-form.component.css'],
})
export class DepartmentFormComponent implements OnInit {
  @Input()
  department: Department | undefined;
  formData: FormGroup = new FormGroup({});
  processing = false;

  constructor(
    private readonly departmentService: DepartmentService,
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
    const request: CreateDepartmentRequest = {
      name: this.fd['name'].value,
    };
    this.processing = true;
    this.departmentService.create(request).subscribe((response) => {
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
    const request: UpdateDepartmentRequest = {
      id: this.department?.id as number,
      name: this.fd['name'].value,
    };

    this.toastr.info('Saving...', '', { disableTimeOut: true });

    this.departmentService.findAnduUpdate(request).subscribe((response) => {
      this.toastr.clear();
      if (response.success) {
        this.toastr.success('Saved!', '', { timeOut: 2000 });
        if (this.department) {
          this.department.name = this.fd['name'].value;
          this.activeModal.dismiss();
        }
      } else {
        this.toastr.error(response.message, '', { timeOut: 2000 });
      }
    });
  }

  ngOnInit(): void {
    this.formData = new FormGroup({
      name: new FormControl(this.department ? this.department.name : '', [
        Validators.required,
      ]),
    });
  }
}
