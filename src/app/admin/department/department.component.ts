import { isPlatformBrowser } from '@angular/common';
import { Component, OnInit, PLATFORM_ID } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DepartmentFormComponent } from 'src/app/modals/department-form/department-form.component';
import { MessageBoxComponent } from 'src/app/modals/message-box/message-box.component';
import { Department } from 'src/app/models/interface/Department.interface';
import {
  MessageBoxButton,
  MessageBoxType,
} from 'src/app/models/MessageBox.model';
import { DepartmentService } from 'src/app/services/department.service';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css'],
})
export class DepartmentComponent implements OnInit {
  public currentPage = 1;
  public hasMore = false;
  public departments: Department[] = [];
  public search = '';
  public firstTimeLoadCompleted = false;
  public searchForm: FormGroup = new FormGroup({
    search: new FormControl('', [Validators.required]),
  });
  public loading = false;

  constructor(
    private readonly departmentService: DepartmentService,
    private readonly toastr: ToastrService,
    private readonly modal: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  onSearch() {
    this.departments = [];
    this.loadData(1);
  }

  loadData(page = 1) {
    this.loading = true;
    this.departmentService
      .findAll(page, this.searchForm.controls['search'].value)
      .subscribe((response) => {
        this.firstTimeLoadCompleted = true;
        this.loading = false;
        if (response.success) {
          if (response.results) {
            this.departments.push(...response.results);
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
    const modalInstance = this.modal.open(DepartmentFormComponent, {
      size: 'sm',
      windowClass: 'modal-rounded',
    });
    modalInstance.result
      .then((department?: Department) => {
        if (department) {
          this.departments.push(department);
        }
      })
      .catch(() => {});
  }

  onEdit(department: Department) {
    const modalInstance = this.modal.open(DepartmentFormComponent, {
      size: 'sm',
      windowClass: 'modal-rounded',
    });
    modalInstance.componentInstance.department = department;
  }

  onDelete(department: Department) {
    const modalInstance = this.modal.open(MessageBoxComponent, {
      size: 'md',
      centered: true,
      backdrop: 'static',
      windowClass: 'modal-rounded',
    });

    modalInstance.componentInstance.settings = {
      title: 'Confirm Delete',
      message: `Are you sure you want to delete ${department.name}?`,
      type: MessageBoxType.Warning,
    };

    modalInstance.result.then((action: MessageBoxButton) => {
      if (action === MessageBoxButton.Confirm) {
        this.deleteDepartment(department);
      }
    });
  }

  deleteDepartment(department: Department) {
    this.toastr.info('Deleting...', '', { disableTimeOut: true });
    this.departmentService
      .findAndDelete(department.id)
      .subscribe((response) => {
        this.toastr.clear();
        if (response.success) {
          this.toastr.success('Deleted!', '', { timeOut: 2000 });
          const index = this.departments.findIndex(
            (d) => d.id === department.id
          );
          if (index !== -1) this.departments.splice(index, 1);
        } else {
          this.toastr.error(response.message, '', { timeOut: 2000 });
        }
      });
  }
}
