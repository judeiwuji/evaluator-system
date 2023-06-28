import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import {
  Course,
  CreateCourseRequest,
  UpdateCourseRequest,
} from 'src/app/models/interface/Course.interface';
import { CourseService } from 'src/app/services/course.service';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.css'],
})
export class CourseFormComponent implements OnInit {
  @Input()
  course: Course | undefined;
  @Input()
  teacherId: number = 0;
  formData: FormGroup = new FormGroup({});
  processing = false;

  constructor(
    private readonly courseService: CourseService,
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
    const request: CreateCourseRequest = {
      title: this.fd['title'].value,
      code: this.fd['code'].value,
      teacherId: this.teacherId,
    };
    this.courseService.create(request).subscribe((response) => {
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
    if (this.processing) return;
    this.processing = true;
    const request: UpdateCourseRequest = {
      id: this.course?.id as number,
      title: this.fd['title'].value,
      code: this.fd['code'].value,
    };

    this.toastr.info('Saving...', '', { disableTimeOut: true });

    this.courseService.findAndUpdate(request).subscribe((response) => {
      this.toastr.clear();
      this.processing = true;
      if (response.success) {
        this.toastr.success('Saved!', '', { timeOut: 2000 });
        if (this.course) {
          this.course.title = this.fd['title'].value;
          this.course.code = this.fd['code'].value;
          this.activeModal.dismiss();
        }
      } else {
        this.toastr.error(response.message, '', { timeOut: 2000 });
      }
    });
  }

  ngOnInit(): void {
    this.formData = new FormGroup({
      code: new FormControl(this.course ? this.course.code : '', [
        Validators.required,
      ]),
      title: new FormControl(this.course ? this.course.title : '', [
        Validators.required,
      ]),
    });
  }
}
