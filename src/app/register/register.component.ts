import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Department } from '../models/interface/Department.interface';
import { CreateStudentRequest } from '../models/interface/Student.interface';
import { Level } from '../models/interface/User.interface';
import { AppService } from '../services/app.service';
import { DepartmentService } from '../services/department.service';
import { StudentService } from '../services/student.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  formData: FormGroup = new FormGroup({});
  departments: Department[] = [];
  levels: Level[] = [];
  processing = false;

  constructor(
    private readonly studentService: StudentService,
    private readonly departmentService: DepartmentService,
    private readonly appService: AppService,
    private readonly toastr: ToastrService,
    private readonly router: Router
  ) {}

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
      if (response.success) {
        this.toastr.success('Success', '', { timeOut: 2000 });
        this.router.navigate(['/login']);
      } else {
        this.toastr.error(response.message, '', { timeOut: 2000 });
      }
    });
  }

  ngOnInit(): void {
    this.formData = new FormGroup({
      surname: new FormControl('', [Validators.required]),
      othernames: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      deptId: new FormControl(null, [Validators.required]),
      levelId: new FormControl(null, [Validators.required]),
      regNo: new FormControl('', [Validators.required]),
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
