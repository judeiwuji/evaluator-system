import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CourseFormComponent } from 'src/app/modals/course-form/course-form.component';
import { MessageBoxComponent } from 'src/app/modals/message-box/message-box.component';
import { Course } from 'src/app/models/interface/Course.interface';
import { User } from 'src/app/models/interface/User.interface';
import {
  MessageBoxButton,
  MessageBoxType,
} from 'src/app/models/MessageBox.model';
import { AuthService } from 'src/app/services/auth.service';
import { CourseService } from 'src/app/services/course.service';

@Component({
  selector: 'app-course-manager',
  templateUrl: './course-manager.component.html',
  styleUrls: ['./course-manager.component.css'],
})
export class CourseManagerComponent implements OnInit {
  public currentPage = 1;
  public hasMore = false;
  public courses: Course[] = [];
  public search = '';
  public firstTimeLoadCompleted = false;
  public currentUser: User | undefined;
  public searchForm: FormGroup = new FormGroup({
    search: new FormControl('', [Validators.required]),
  });
  public loading = false;

  constructor(
    private readonly courseService: CourseService,
    private readonly toastr: ToastrService,
    private readonly modal: NgbModal,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser().subscribe((response) => {
      if (response.success && response.result) {
        this.currentUser = response.result;
        this.loadData();
      }
    });
  }

  onSearch() {
    this.courses = [];
    this.loadData(1);
  }

  loadData(page = 1) {
    this.loading = true;
    this.courseService
      .findAll(
        page,
        this.currentUser?.teacher?.id as number,
        this.searchForm.controls['search'].value
      )
      .subscribe((response) => {
        this.firstTimeLoadCompleted = true;
        this.loading = false;
        if (response.success) {
          if (response.results) {
            this.courses.push(...response.results);
            if (response.page && response.pages) {
              this.hasMore = response.page < response.pages;
            }
          }
        } else {
          this.toastr.error(response.message, '', { timeOut: 2000 });
        }
      });
  }

  onCreateNew() {
    const modalInstance = this.modal.open(CourseFormComponent, {
      size: 'md',
      windowClass: 'modal-rounded',
    });
    modalInstance.componentInstance.teacherId = this.currentUser?.teacher?.id;
    modalInstance.result
      .then((course?: Course) => {
        if (course) {
          this.courses.push(course);
        }
      })
      .catch(() => {});
  }

  onEdit(course: Course) {
    const modalInstance = this.modal.open(CourseFormComponent, {
      size: 'md',
      windowClass: 'modal-rounded',
    });
    modalInstance.componentInstance.course = course;
  }

  onDelete(course: Course) {
    const modalInstance = this.modal.open(MessageBoxComponent, {
      size: 'md',
      centered: true,
      backdrop: 'static',
      windowClass: 'modal-rounded',
    });

    modalInstance.componentInstance.settings = {
      title: 'Confirm Delete',
      message: `Are you sure you want to delete this course?`,
      type: MessageBoxType.Warning,
    };

    modalInstance.result.then((action: MessageBoxButton) => {
      if (action === MessageBoxButton.Confirm) {
        this.deleteCourse(course);
      }
    });
  }

  deleteCourse(course: Course) {
    this.toastr.info('Deleting...', '', { disableTimeOut: true });
    this.courseService.findAndDelete(course.id).subscribe((response) => {
      this.toastr.clear();
      if (response.success) {
        this.toastr.success('Deleted!', '', { timeOut: 2000 });
        const index = this.courses.findIndex((d) => d.id === course.id);
        if (index !== -1) this.courses.splice(index, 1);
      } else {
        this.toastr.error(response.message, '', { timeOut: 2000 });
      }
    });
  }
}
