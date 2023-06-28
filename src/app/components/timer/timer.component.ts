import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  OnInit,
  Output,
  PLATFORM_ID,
} from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css'],
})
export class TimerComponent implements OnInit {
  @Input()
  timeout: number = 0;

  padHours = '00';
  padMinutes = '00';
  padSeconds = '00';
  hours = 0;
  minutes = 0;
  seconds = 0;
  intervalID: any;
  @Output()
  onTimerStopped = new EventEmitter<boolean>(false);

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private zone: NgZone
  ) {}

  padZero(d: number) {
    return d < 10 ? `0${d}` : `${d}`;
  }

  initTimer() {
    this.hours = Math.floor(this.timeout / 3600);
    this.minutes = Math.floor((this.timeout - this.hours * 3600) / 60);
    this.seconds = this.timeout - this.hours * 3600 - this.minutes * 60;
  }

  setTimer() {
    if (this.seconds === 0) {
      if (this.minutes > 0) {
        this.seconds = 60;
        this.minutes -= 1;
      } else {
        if (this.hours > 0) {
          this.minutes = 59;
          this.seconds = 60;
          this.hours -= 1;
        }
      }
    }

    if (this.seconds > 0) {
      --this.seconds;
    } else {
      this.onTimerStopped.emit(true);
      clearInterval(this.intervalID);
    }

    this.padHours = this.padZero(this.hours);
    this.padMinutes = this.padZero(this.minutes);
    this.padSeconds = this.padZero(this.seconds);
  }

  ngOnInit(): void {
    this.initTimer();
    this.setTimer();
    if (isPlatformBrowser(this.platformId)) {
      this.intervalID = setInterval(() => {
        this.setTimer();
      }, 1000);
    }
  }
}
