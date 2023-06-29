import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Department } from 'src/app/models/interface/Department.interface';
import {
  CreateStudentRequest,
  UpdateStudentRequest,
} from 'src/app/models/interface/Student.interface';
import { Level, Student } from 'src/app/models/interface/User.interface';
import { AppService } from 'src/app/services/app.service';
import { DepartmentService } from 'src/app/services/department.service';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css'],
})
export class StudentFormComponent implements OnInit {
  @Input()
  student: Student | undefined;
  formData: FormGroup = new FormGroup({});
  departments: Department[] = [];
  levels: Level[] = [];
  processing = false;

  constructor(
    private readonly studentService: StudentService,
    private readonly departmentService: DepartmentService,
    private readonly appService: AppService,
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
    const request: CreateStudentRequest = {
      surname: this.fd['surname'].value,
      othernames: this.fd['othernames'].value,
      email: this.fd['email'].value,
      password: this.fd['password'].value,
      regNo: this.fd['regNo'].value,
      deptId: this.fd['deptId'].value,
      levelId: this.fd['levelId'].value,
    };
    this.studentService.create(request).subscribe((response) => {
      this.toastr.clear();
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
    const request: UpdateStudentRequest = {
      id: this.student?.id as number,
      surname: this.fd['surname'].value,
      othernames: this.fd['othernames'].value,
      regNo: this.fd['regNo'].value,
      email: this.fd['email'].value,
      password: this.fd['password'].value,
      deptId: this.fd['deptId'].value,
      levelId: this.fd['levelId'].value,
    };

    this.toastr.info('Saving...', '', { disableTimeOut: true });

    this.studentService.findAndUpdate(request).subscribe((response) => {
      this.toastr.clear();
      if (response.success) {
        this.toastr.success('Saved!', '', { timeOut: 2000 });
        if (this.student) {
          this.student.user.surname = this.fd['surname'].value;
          this.student.user.othernames = this.fd['othernames'].value;
          this.student.user.email = this.fd['email'].value;
          this.student.regNo = this.fd['regNo'].value;
          this.student.level = this.levels.find(
            (d) => d.id === Number(this.fd['levelId'].value)
          );
          this.student.department = this.departments.find(
            (d) => d.id === Number(this.fd['deptId'].value)
          );
          this.student.deptId = Number(this.fd['deptId'].value);
          this.student.levelId = Number(this.fd['levelId'].value);
          this.activeModal.dismiss();
        }
      } else {
        this.toastr.error(response.message, '', { timeOut: 2000 });
      }
    });
  }

  ngOnInit(): void {
    this.formData = new FormGroup({
      surname: new FormControl(this.student ? this.student.user.surname : '', [
        Validators.required,
      ]),
      othernames: new FormControl(
        this.student ? this.student.user.othernames : '',
        [Validators.required]
      ),
      email: new FormControl(this.student ? this.student.user.email : '', [
        Validators.required,
        Validators.email,
      ]),
      deptId: new FormControl(this.student ? this.student.deptId : null, [
        Validators.required,
      ]),
      levelId: new FormControl(this.student ? this.student.levelId : null, [
        Validators.required,
      ]),
      regNo: new FormControl(this.student ? this.student.regNo : '', [
        Validators.required,
      ]),
      password: new FormControl('', [Validators.required]),
    });

    this.departmentService.findAll(1, '', false).subscribe((response) => {
      if (response.success && response.results) {
        this.departments = response.results;
      }
    });
    this.appService.getLevels().subscribe((response) => {
      if (response.success && response.results) {
        this.levels = response.results;
      }
    });
  }
}
