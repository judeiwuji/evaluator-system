import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { MessageBoxComponent } from 'src/app/modals/message-box/message-box.component';
import { ProfileCardComponent } from 'src/app/modals/profile-card/profile-card.component';
import { StudentFormComponent } from 'src/app/modals/student-form/student-form.component';
import { Student } from 'src/app/models/interface/User.interface';
import {
  MessageBoxButton,
  MessageBoxType,
} from 'src/app/models/MessageBox.model';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-student-manager',
  templateUrl: './student-manager.component.html',
  styleUrls: ['./student-manager.component.css'],
})
export class StudentManagerComponent implements OnInit {
  public currentPage = 1;
  public hasMore = false;
  public students: Student[] = [];
  public search = '';
  public firstTimeLoadCompleted = false;
  public searchForm: FormGroup = new FormGroup({
    search: new FormControl('', [Validators.required]),
  });
  public loading = false;

  constructor(
    private readonly studentService: StudentService,
    private readonly toastr: ToastrService,
    private readonly modal: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  onSearch() {
    this.students = [];
    this.loadData(1);
  }

  loadData(page = 1) {
    this.loading = true;
    this.studentService
      .findAll(page, this.searchForm.controls['search'].value)
      .subscribe((response) => {
        this.firstTimeLoadCompleted = true;
        this.loading = false;
        if (response.success) {
          if (response.results) {
            this.students.push(...response.results);
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
    const modalInstance = this.modal.open(StudentFormComponent, {
      size: 'md',
      windowClass: 'modal-rounded',
    });
    modalInstance.result
      .then((student?: Student) => {
        if (student) {
          this.students.push(student);
        }
      })
      .catch(() => {});
  }

  onEdit(student: Student) {
    const modalInstance = this.modal.open(StudentFormComponent, {
      size: 'md',
      windowClass: 'modal-rounded',
    });
    modalInstance.componentInstance.student = student;
  }

  onDelete(student: Student) {
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
        this.deleteTeacher(student);
      }
    });
  }

  deleteTeacher(student: Student) {
    this.toastr.info('Deleting...', '', { disableTimeOut: true });
    this.studentService.findAndDelete(student.id).subscribe((response) => {
      this.toastr.clear();
      if (response.success) {
        this.toastr.success('Deleted!', '', { timeOut: 2000 });
        const index = this.students.findIndex((d) => d.id === student.id);
        if (index !== -1) this.students.splice(index, 1);
      } else {
        this.toastr.error(response.message, '', { timeOut: 2000 });
      }
    });
  }

  onProfile(student: Student) {
    const modalInstance = this.modal.open(ProfileCardComponent, {
      size: 'md',
      backdrop: 'static',
      windowClass: 'modal-rounded',
    });
    modalInstance.componentInstance.user = {
      ...student.user,
      student,
    };
    modalInstance.result.then(() => {});
  }
}
