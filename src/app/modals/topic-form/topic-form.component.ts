import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import {
  CreateTopicRequest,
  Topic,
  UpdateTopicRequest,
} from 'src/app/models/interface/Topic.interface';
import { TopicService } from 'src/app/services/topic.service';

@Component({
  selector: 'app-topic-form',
  templateUrl: './topic-form.component.html',
  styleUrls: ['./topic-form.component.css'],
})
export class TopicFormComponent implements OnInit {
  @Input()
  topic: Topic | undefined;
  @Input()
  courseId: number = 0;
  formData: FormGroup = new FormGroup({});

  constructor(
    private readonly topicService: TopicService,
    private readonly activeModal: NgbActiveModal,
    private readonly toastr: ToastrService
  ) {}

  close() {
    this.activeModal.dismiss();
  }

  get fd() {
    return this.formData.controls;
  }

  create() {
    const request: CreateTopicRequest = {
      title: this.fd['title'].value,
      description: this.fd['description'].value,
      courseId: this.courseId,
    };
    this.toastr.info('Adding...', '', { disableTimeOut: true });
    this.topicService.create(request).subscribe((response) => {
      this.toastr.clear();
      if (response.success) {
        this.toastr.success('Added', '', { timeOut: 2000 });
        this.activeModal.close(response.result);
      } else {
        this.toastr.error(response.message, '', { timeOut: 2000 });
      }
    });
  }

  update() {
    const request: UpdateTopicRequest = {
      id: this.topic?.id as number,
      title: this.fd['title'].value,
      description: this.fd['description'].value,
    };

    this.toastr.info('Saving...', '', { disableTimeOut: true });

    this.topicService.findAndUpdate(request).subscribe((response) => {
      this.toastr.clear();
      if (response.success) {
        this.toastr.success('Saved!', '', { timeOut: 2000 });
        if (this.topic) {
          this.topic.title = this.fd['title'].value;
          this.topic.description = this.fd['description'].value;
          this.activeModal.dismiss();
        }
      } else {
        this.toastr.error(response.message, '', { timeOut: 2000 });
      }
    });
  }

  ngOnInit(): void {
    this.formData = new FormGroup({
      description: new FormControl(this.topic ? this.topic.description : '', [
        Validators.required,
      ]),
      title: new FormControl(this.topic ? this.topic.title : '', [
        Validators.required,
      ]),
    });
  }
}
