import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Department } from 'src/app/models/interface/Department.interface';
import {
  CreateTeacherRequest,
  UpdateTeacherRequest,
} from 'src/app/models/interface/Teacher.interface';
import { Teacher } from 'src/app/models/interface/User.interface';
import { DepartmentService } from 'src/app/services/department.service';
import { TeacherService } from 'src/app/services/teacher.service';

@Component({
  selector: 'app-teacher-form',
  templateUrl: './teacher-form.component.html',
  styleUrls: ['./teacher-form.component.css'],
})
export class TeacherFormComponent implements OnInit {
  @Input()
  teacher: Teacher | undefined;
  formData: FormGroup = new FormGroup({});
  departments: Department[] = [];
  processing = false;

  constructor(
    private readonly teacherService: TeacherService,
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
    const request: CreateTeacherRequest = {
      surname: this.fd['surname'].value,
      othernames: this.fd['othernames'].value,
      email: this.fd['email'].value,
      password: this.fd['password'].value,
      deptId: this.fd['deptId'].value,
    };
    this.processing = true;
    this.teacherService.create(request).subscribe((response) => {
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
    const request: UpdateTeacherRequest = {
      id: this.teacher?.id as number,
      surname: this.fd['surname'].value,
      othernames: this.fd['othernames'].value,
      email: this.fd['email'].value,
      password: this.fd['password'].value,
      deptId: this.fd['deptId'].value,
    };

    this.toastr.info('Saving...', '', { disableTimeOut: true });

    this.teacherService.findAndUpdate(request).subscribe((response) => {
      this.toastr.clear();
      if (response.success) {
        this.toastr.success('Saved!', '', { timeOut: 2000 });
        if (this.teacher) {
          this.teacher.user.surname = this.fd['surname'].value;
          this.teacher.user.othernames = this.fd['othernames'].value;
          this.teacher.user.email = this.fd['email'].value;
          this.teacher.department = this.departments.find(
            (d) => d.id === Number(this.fd['deptId'].value)
          );
          this.teacher.deptId = Number(this.fd['deptId'].value);
          this.activeModal.dismiss();
        }
      } else {
        this.toastr.error(response.message, '', { timeOut: 2000 });
      }
    });
  }

  ngOnInit(): void {
    this.formData = new FormGroup({
      surname: new FormControl(this.teacher ? this.teacher.user.surname : '', [
        Validators.required,
      ]),
      othernames: new FormControl(
        this.teacher ? this.teacher.user.othernames : '',
        [Validators.required]
      ),
      email: new FormControl(this.teacher ? this.teacher.user.email : '', [
        Validators.required,
        Validators.email,
      ]),
      deptId: new FormControl(this.teacher ? this.teacher.deptId : null, [
        Validators.required,
      ]),
      password: new FormControl('', [Validators.required]),
    });

    this.departmentService.findAll(1, '', false).subscribe((response) => {
      if (response.success && response.results) {
        this.departments = response.results;
      }
    });
  }
}
