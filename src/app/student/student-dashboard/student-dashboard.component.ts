import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/interface/User.interface';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css'],
})
export class StudentDashboardComponent implements OnInit {
  public user: User | undefined;
  constructor(private readonly authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser().subscribe((response) => {
      if (response.success) {
        this.user = response.result;
      }
    });
  }
}
