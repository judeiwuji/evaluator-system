import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/interface/User.interface';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-admin-account',
  templateUrl: './admin-account.component.html',
  styleUrls: ['./admin-account.component.css'],
})
export class AdminAccountComponent implements OnInit {
  user: User | undefined;
  constructor(
    private readonly authService: AuthService,
    private readonly adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser().subscribe((response) => {
      if (response.success) {
        this.user = response.result;
      }
    });
  }
}
