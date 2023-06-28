import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { MessageBoxComponent } from 'src/app/modals/message-box/message-box.component';
import { ProfileCardComponent } from 'src/app/modals/profile-card/profile-card.component';
import { TeacherFormComponent } from 'src/app/modals/teacher-form/teacher-form.component';
import { Teacher } from 'src/app/models/interface/User.interface';
import {
  MessageBoxButton,
  MessageBoxType,
} from 'src/app/models/MessageBox.model';
import { TeacherService } from 'src/app/services/teacher.service';

@Component({
  selector: 'app-teacher-manager',
  templateUrl: './teacher-manager.component.html',
  styleUrls: ['./teacher-manager.component.css'],
})
export class TeacherManagerComponent implements OnInit {
  public currentPage = 1;
  public hasMore = false;
  public teachers: Teacher[] = [];
  public search = '';
  public firstTimeLoadCompleted = false;
  public searchForm: FormGroup = new FormGroup({
    search: new FormControl('', [Validators.required]),
  });
  public loading = false;

  constructor(
    private readonly teacherService: TeacherService,
    private readonly toastr: ToastrService,
    private readonly modal: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  onSearch() {
    this.teachers = [];
    this.loadData(1);
  }

  loadData(page = 1) {
    this.loading = true;
    this.teacherService
      .findAll(page, this.searchForm.controls['search'].value)
      .subscribe((response) => {
        this.firstTimeLoadCompleted = true;
        this.loading = false;
        if (response.success) {
          if (response.results) {
            this.teachers.push(...response.results);
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
    const modalInstance = this.modal.open(TeacherFormComponent, {
      size: 'md',
      windowClass: 'modal-rounded',
    });
    modalInstance.result
      .then((teacher?: Teacher) => {
        if (teacher) {
          this.teachers.push(teacher);
        }
      })
      .catch(() => {});
  }

  onEdit(teacher: Teacher) {
    const modalInstance = this.modal.open(TeacherFormComponent, {
      size: 'md',
      windowClass: 'modal-rounded',
    });
    modalInstance.componentInstance.teacher = teacher;
  }

  onDelete(teacher: Teacher) {
    const modalInstance = this.modal.open(MessageBoxComponent, {
      size: 'md',
      centered: true,
      backdrop: 'static',
      windowClass: 'modal-rounded',
    });

    modalInstance.componentInstance.settings = {
      title: 'Confirm Delete',
      message: `Are you sure you want to delete this account?`,
      type: MessageBoxType.Warning,
    };

    modalInstance.result.then((action: MessageBoxButton) => {
      if (action === MessageBoxButton.Confirm) {
        this.deleteTeacher(teacher);
      }
    });
  }

  deleteTeacher(teacher: Teacher) {
    this.toastr.info('Deleting...', '', { disableTimeOut: true });
    this.teacherService.findAndDelete(teacher.id).subscribe((response) => {
      this.toastr.clear();
      if (response.success) {
        this.toastr.success('Deleted!', '', { timeOut: 2000 });
        const index = this.teachers.findIndex((d) => d.id === teacher.id);
        if (index !== -1) this.teachers.splice(index, 1);
      } else {
        this.toastr.error(response.message, '', { timeOut: 2000 });
      }
    });
  }

  onProfile(teacher: Teacher) {
    const modalInstance = this.modal.open(ProfileCardComponent, {
      size: 'md',
      backdrop: 'static',
      windowClass: 'modal-rounded',
    });
    modalInstance.componentInstance.user = { ...teacher.user, teacher };
    modalInstance.result.then(() => {});
  }
}
