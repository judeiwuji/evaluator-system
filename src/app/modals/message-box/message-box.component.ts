import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  MessageBoxButton,
  MessageBoxSetting,
  MessageBoxType,
} from 'src/app/models/MessageBox.model';

@Component({
  selector: 'app-message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.css'],
})
export class MessageBoxComponent implements OnInit {
  @Input()
  settings: MessageBoxSetting = new MessageBoxSetting(
    'Info',
    'Hello',
    MessageBoxType.Info
  );
  public MessageBoxType = MessageBoxType;
  public MessageBoxButton = MessageBoxButton;
  constructor(private readonly activeModal: NgbActiveModal) {}

  close(action: MessageBoxButton) {
    this.activeModal.close(action);
  }

  ngOnInit(): void {}
}
