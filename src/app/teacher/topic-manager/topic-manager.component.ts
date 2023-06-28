import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Course } from '@prisma/client';
import { Router } from 'express';
import { ToastrService } from 'ngx-toastr';
import { MessageBoxComponent } from 'src/app/modals/message-box/message-box.component';
import { TopicFormComponent } from 'src/app/modals/topic-form/topic-form.component';
import { Topic } from 'src/app/models/interface/Topic.interface';
import {
  MessageBoxButton,
  MessageBoxType,
} from 'src/app/models/MessageBox.model';
import { AuthService } from 'src/app/services/auth.service';
import { CourseService } from 'src/app/services/course.service';
import { TopicService } from 'src/app/services/topic.service';

@Component({
  selector: 'app-topic-manager',
  templateUrl: './topic-manager.component.html',
  styleUrls: ['./topic-manager.component.css'],
})
export class TopicManagerComponent implements OnInit {
  public currentPage = 1;
  public hasMore = false;
  public topics: Topic[] = [];
  public search = '';
  public firstTimeLoadCompleted = false;
  public course: Course | undefined;
  public courseId: number = 0;
  public searchForm: FormGroup = new FormGroup({
    search: new FormControl('', [Validators.required]),
  });
  public loading = false;

  constructor(
    private readonly topicService: TopicService,
    private readonly courseService: CourseService,
    private readonly toastr: ToastrService,
    private readonly modal: NgbModal,
    private readonly activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.courseId = Number(this.activatedRoute.snapshot.params['cid']);
    this.courseService.findOne(this.courseId).subscribe((response) => {
      if (response.success && response.result) this.course = response.result;
      this.loadData();
    });
  }

  onSearch() {
    this.topics = [];
    this.loadData(1);
  }

  loadData(page = 1) {
    this.loading = true;
    this.topicService
      .findAll(page, this.courseId, this.searchForm.controls['search'].value)
      .subscribe((response) => {
        this.firstTimeLoadCompleted = true;
        this.loading = false;
        if (response.success) {
          if (response.results) {
            this.topics.push(...response.results);
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
    const modalInstance = this.modal.open(TopicFormComponent, {
      size: 'md',
      windowClass: 'modal-rounded',
    });
    modalInstance.componentInstance.courseId = this.courseId;
    modalInstance.result
      .then((topic?: Topic) => {
        if (topic) {
          this.topics.push(topic);
        }
      })
      .catch(() => {});
  }

  onEdit(topic: Topic) {
    const modalInstance = this.modal.open(TopicFormComponent, {
      size: 'md',
      windowClass: 'modal-rounded',
    });
    modalInstance.componentInstance.topic = topic;
  }

  onDelete(topic: Topic) {
    const modalInstance = this.modal.open(MessageBoxComponent, {
      size: 'md',
      centered: true,
      backdrop: 'static',
      windowClass: 'modal-rounded',
    });

    modalInstance.componentInstance.settings = {
      title: 'Confirm Delete',
      message: `Are you sure you want to delete this topic?`,
      type: MessageBoxType.Warning,
    };

    modalInstance.result.then((action: MessageBoxButton) => {
      if (action === MessageBoxButton.Confirm) {
        this.deleteTopic(topic);
      }
    });
  }

  deleteTopic(topic: Topic) {
    this.toastr.info('Deleting...', '', { disableTimeOut: true });
    this.topicService.findAndDelete(topic.id).subscribe((response) => {
      this.toastr.clear();
      if (response.success) {
        this.toastr.success('Deleted!', '', { timeOut: 2000 });
        const index = this.topics.findIndex((d) => d.id === topic.id);
        if (index !== -1) this.topics.splice(index, 1);
      } else {
        this.toastr.error(response.message, '', { timeOut: 2000 });
      }
    });
  }
}
