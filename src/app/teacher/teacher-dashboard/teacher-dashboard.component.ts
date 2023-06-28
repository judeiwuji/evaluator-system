import { Component, OnInit } from '@angular/core';
import { response } from 'express';
import { ToastrService } from 'ngx-toastr';
import { months } from 'src/app/config/App.config';
import { TeacherDashboardStats } from 'src/app/models/interface/Teacher.interface';
import { Activity } from 'src/app/models/interface/User.interface';
import { TeacherService } from 'src/app/services/teacher.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-teacher-dashboard',
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.css'],
})
export class TeacherDashboardComponent implements OnInit {
  months = months;
  currentMonth = new Date().getMonth();
  selectedMonth: { id: number; name: string } = {
    id: this.currentMonth,
    name: months[this.currentMonth],
  };

  dashboardStats: TeacherDashboardStats = {
    students: 0,
    courses: 0,
  };
  activities: Activity[] = [];
  firstTimeLoadComplete = false;

  constructor(
    private readonly teacherService: TeacherService,
    private readonly userService: UserService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.teacherService.getTeacherDashboardStats().subscribe((response) => {
      if (response.success) {
        if (response.result) this.dashboardStats = response.result;
      }
    });
    this.loadActivities();
  }

  loadActivities() {
    this.userService
      .findAllActivities(this.selectedMonth.id)
      .subscribe((response) => {
        this.firstTimeLoadComplete = true;
        if (response.success) {
          this.activities = response.results as [];
        }
      });
  }

  onFilterRecentActivities(id: number, name: string) {
    this.selectedMonth = { id, name };
    this.loadActivities();
  }

  onDeleteActivity(activity: Activity) {
    this.toastr.info('Deleting...', '', { disableTimeOut: true });
    this.userService
      .findAndDeleteActivity(activity.id)
      .subscribe((response) => {
        this.toastr.clear();
        if (response.success) {
          const index = this.activities.findIndex((d) => d.id === activity.id);
          if (index !== -1) {
            this.activities.splice(index, 1);
          }
        } else {
          this.toastr.error(response.message);
        }
      });
  }
}
