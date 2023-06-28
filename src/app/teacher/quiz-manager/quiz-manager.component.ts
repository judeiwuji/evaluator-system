import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { MessageBoxComponent } from 'src/app/modals/message-box/message-box.component';
import { QuizFormComponent } from 'src/app/modals/quiz-form/quiz-form.component';
import { Quiz } from 'src/app/models/interface/Quiz.interface';
import { Topic } from 'src/app/models/interface/Topic.interface';
import {
  MessageBoxButton,
  MessageBoxType,
} from 'src/app/models/MessageBox.model';
import { QuizService } from 'src/app/services/quiz.service';
import { TopicService } from 'src/app/services/topic.service';

@Component({
  selector: 'app-quiz-manager',
  templateUrl: './quiz-manager.component.html',
  styleUrls: ['./quiz-manager.component.css'],
})
export class QuizManagerComponent implements OnInit {
  public currentPage = 1;
  public hasMore = false;
  public quizzes: Quiz[] = [];
  public search = '';
  public firstTimeLoadCompleted = false;
  public topic: Topic | undefined;
  public topicId: number = 0;
  public searchForm: FormGroup = new FormGroup({
    search: new FormControl('', [Validators.required]),
  });
  public loading = false;

  constructor(
    private readonly quizService: QuizService,
    private readonly topicService: TopicService,
    private readonly toastr: ToastrService,
    private readonly modal: NgbModal,
    private readonly activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.topicId = Number(this.activatedRoute.snapshot.params['tid']);
    this.topicService.findOne(this.topicId).subscribe((response) => {
      if (response.success && response.result) this.topic = response.result;
      this.loadData();
    });
  }

  onSearch() {
    this.quizzes = [];
    this.loadData(1);
  }

  loadData(page = 1) {
    this.loading = true;
    this.quizService
      .findAll(page, this.topicId, this.searchForm.controls['search'].value)
      .subscribe((response) => {
        this.firstTimeLoadCompleted = true;
        this.loading = false;
        if (response.success) {
          if (response.results) {
            this.quizzes.push(...response.results);
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
    const modalInstance = this.modal.open(QuizFormComponent, {
      size: 'md',
      windowClass: 'modal-rounded',
    });
    modalInstance.componentInstance.topicId = this.topicId;
    modalInstance.result
      .then((quiz?: Quiz) => {
        if (quiz) {
          this.quizzes.push(quiz);
        }
      })
      .catch(() => {});
  }

  onEdit(quiz: Quiz) {
    const modalInstance = this.modal.open(QuizFormComponent, {
      size: 'md',
      windowClass: 'modal-rounded',
    });
    modalInstance.componentInstance.quiz = quiz;
  }

  onDelete(quiz: Quiz) {
    const modalInstance = this.modal.open(MessageBoxComponent, {
      size: 'md',
      centered: true,
      backdrop: 'static',
      windowClass: 'modal-rounded',
    });

    modalInstance.componentInstance.settings = {
      title: 'Confirm Delete',
      message: `Are you sure you want to delete this quiz?`,
      type: MessageBoxType.Warning,
    };

    modalInstance.result.then((action: MessageBoxButton) => {
      if (action === MessageBoxButton.Confirm) {
        this.deleteQuiz(quiz);
      }
    });
  }

  deleteQuiz(quiz: Quiz) {
    this.toastr.info('Deleting...', '', { disableTimeOut: true });
    this.quizService.findAndDelete(quiz.id).subscribe((response) => {
      this.toastr.clear();
      if (response.success) {
        this.toastr.success('Deleted!', '', { timeOut: 2000 });
        const index = this.quizzes.findIndex((d) => d.id === quiz.id);
        if (index !== -1) this.quizzes.splice(index, 1);
      } else {
        this.toastr.error(response.message, '', { timeOut: 2000 });
      }
    });
  }

  onToggleActive(quiz: Quiz) {
    this.toastr.info('Please wait...', '', { disableTimeOut: true });
    this.quizService
      .findAndUpdate({ id: quiz.id, active: !quiz.active })
      .subscribe((response) => {
        this.toastr.clear();
        if (response.success) {
          quiz.active = !quiz.active;
          quiz.active
            ? this.toastr.success('Started!')
            : this.toastr.info('Stoped!');
        }
      });
  }
}
