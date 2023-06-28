import { isPlatformBrowser } from '@angular/common';
import { Component, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/interface/User.interface';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  public user: User | undefined;
  @Input()
  public navTab: string | undefined = 'Dashboard';
  constructor(
    private readonly authService: AuthService,
    private readonly toastr: ToastrService
  ) {}

  onLogout() {
    this.authService.logout();
  }

  ngOnInit(): void {
    this.authService.currentUser().subscribe((response) => {
      this.user = response.result;
    });
  }

  onToggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.overlay');
    console.log(sidebar?.classList.contains('open'));
    if (sidebar?.classList.contains('open')) {
      sidebar?.classList.remove('open');
      overlay?.classList.remove('open');
    } else {
      sidebar?.classList.add('open');
      overlay?.classList.add('open');
    }
  }
}
