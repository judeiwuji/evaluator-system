import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AdminFormComponent } from 'src/app/modals/admin-form/admin-form.component';
import { MessageBoxComponent } from 'src/app/modals/message-box/message-box.component';
import { ProfileCardComponent } from 'src/app/modals/profile-card/profile-card.component';
import { Admin } from 'src/app/models/interface/User.interface';
import {
  MessageBoxButton,
  MessageBoxType,
} from 'src/app/models/MessageBox.model';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-admin-manager',
  templateUrl: './admin-manager.component.html',
  styleUrls: ['./admin-manager.component.css'],
})
export class AdminManagerComponent implements OnInit {
  public currentPage = 1;
  public hasMore = false;
  public admins: Admin[] = [];
  public search = '';
  public firstTimeLoadCompleted = false;
  public searchForm: FormGroup = new FormGroup({
    search: new FormControl('', [Validators.required]),
  });
  public loading = false;

  constructor(
    private readonly adminService: AdminService,
    private readonly toastr: ToastrService,
    private readonly modal: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  onSearch() {
    this.admins = [];
    this.loadData(1);
  }

  loadData(page = 1) {
    this.loading = true;
    this.adminService
      .findAll(page, this.searchForm.controls['search'].value)
      .subscribe((response) => {
        this.firstTimeLoadCompleted = true;
        this.loading = false;
        if (response.success) {
          if (response.results) {
            this.admins.push(...response.results);
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
    const modalInstance = this.modal.open(AdminFormComponent, {
      size: 'md',
      windowClass: 'modal-rounded',
    });
    modalInstance.result
      .then((admin?: Admin) => {
        if (admin) {
          this.admins.push(admin);
        }
      })
      .catch(() => {});
  }

  onEdit(admin: Admin) {
    const modalInstance = this.modal.open(AdminFormComponent, {
      size: 'md',
      windowClass: 'modal-rounded',
    });
    modalInstance.componentInstance.admin = admin;
  }

  onDelete(admin: Admin) {
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
        this.deleteAdmin(admin);
      }
    });
  }

  deleteAdmin(admin: Admin) {
    this.toastr.info('Deleting...', '', { disableTimeOut: true });
    this.adminService.findAndDelete(admin.id).subscribe((response) => {
      this.toastr.clear();
      if (response.success) {
        this.toastr.success('Deleted!', '', { timeOut: 2000 });
        const index = this.admins.findIndex((d) => d.id === admin.id);
        if (index !== -1) this.admins.splice(index, 1);
      } else {
        this.toastr.error(response.message, '', { timeOut: 2000 });
      }
    });
  }

  onProfile(admin: Admin) {
    const modalInstance = this.modal.open(ProfileCardComponent, {
      size: 'md',
      backdrop: 'static',
      windowClass: 'modal-rounded',
    });
    modalInstance.componentInstance.user = { ...admin.user, admin: admin };
    modalInstance.result.then(() => {});
  }
}
