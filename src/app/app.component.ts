import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { filter, map, Observable, of } from 'rxjs';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SeoService } from './services/seo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
  constructor(
    private readonly seo: SeoService,
    private router: Router,
    @Inject(PLATFORM_ID) private readonly platformId: Object
  ) {
    this.seo.setDefaults();
  }

  ngAfterViewInit(): void {
    this.router.events.subscribe(() => {
      if (isPlatformBrowser(this.platformId)) {
        const overlay = document.querySelector('.overlay');
        overlay?.classList.remove('open');
      }
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
