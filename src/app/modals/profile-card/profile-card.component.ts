import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  Admin,
  Student,
  Teacher,
  User,
} from 'src/app/models/interface/User.interface';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.css'],
})
export class ProfileCardComponent implements OnInit {
  @Input()
  user: User | undefined;
  constructor(private readonly activeModal: NgbActiveModal) {}

  close() {
    this.activeModal.close();
  }

  ngOnInit(): void {}
}
