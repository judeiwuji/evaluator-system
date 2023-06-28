import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { MessageBoxComponent } from 'src/app/modals/message-box/message-box.component';
import { QuestionFormComponent } from 'src/app/modals/question-form/question-form.component';
import { QuestionOptionsComponent } from 'src/app/modals/question-options/question-options.component';
import { UploadQuestionComponent } from 'src/app/modals/upload-question/upload-question.component';
import { Question } from 'src/app/models/interface/Question.interface';
import { Quiz } from 'src/app/models/interface/Quiz.interface';
import {
  MessageBoxButton,
  MessageBoxType,
} from 'src/app/models/MessageBox.model';
import { QuestionService } from 'src/app/services/question.service';
import { QuizService } from 'src/app/services/quiz.service';

@Component({
  selector: 'app-quiz-question-manager',
  templateUrl: './quiz-question-manager.component.html',
  styleUrls: ['./quiz-question-manager.component.css'],
})
export class QuizQuestionManagerComponent implements OnInit {
  public currentPage = 1;
  public hasMore = false;
  public questions: Question[] = [];
  public search = '';
  public firstTimeLoadCompleted = false;
  public quiz: Quiz | undefined;
  public quizId: number = 0;
  public searchForm: FormGroup = new FormGroup({
    search: new FormControl('', [Validators.required]),
  });

  constructor(
    private readonly questionService: QuestionService,
    private readonly quizService: QuizService,
    private readonly toastr: ToastrService,
    private readonly modal: NgbModal,
    private readonly activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.quizId = Number(this.activatedRoute.snapshot.params['qid']);
    this.quizService.findOne({ id: this.quizId }).subscribe((response) => {
      if (response.success && response.result) this.quiz = response.result;
      this.loadData();
    });
  }

  onSearch() {
    this.questions = [];
    this.loadData(1);
  }

  loadData(page = 1) {
    this.questionService
      .findAll(page, this.quizId, this.searchForm.controls['search'].value)
      .subscribe((response) => {
        this.firstTimeLoadCompleted = true;
        if (response.success) {
          if (response.results) {
            this.questions.push(...response.results);
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
    const modalInstance = this.modal.open(QuestionFormComponent, {
      size: 'md',
      windowClass: 'modal-rounded',
      backdrop: 'static',
      scrollable: true,
    });
    modalInstance.componentInstance.quizId = this.quizId;
    modalInstance.result
      .then((question?: Question) => {
        if (question) {
          this.questions.push(question);
        }
      })
      .catch(() => {});
  }

  onUpload() {
    const modalInstance = this.modal.open(UploadQuestionComponent, {
      size: 'xl',
      windowClass: 'modal-rounded',
      backdrop: 'static',
      scrollable: true,
    });
    modalInstance.componentInstance.quizId = this.quizId;
    modalInstance.result
      .then((uploaded) => {
        if (uploaded) {
          this.questions = [];
          this.loadData(1);
        }
      })
      .catch(() => {});
  }

  onEdit(question: Question) {
    const modalInstance = this.modal.open(QuestionFormComponent, {
      size: 'md',
      windowClass: 'modal-rounded',
      backdrop: 'static',
    });
    modalInstance.componentInstance.question = question;
  }

  onDelete(question: Question) {
    const modalInstance = this.modal.open(MessageBoxComponent, {
      size: 'md',
      centered: true,
      backdrop: 'static',
      windowClass: 'modal-rounded',
    });

    modalInstance.componentInstance.settings = {
      title: 'Confirm Delete',
      message: `Are you sure you want to delete this question?`,
      type: MessageBoxType.Warning,
      backdrop: 'static',
    };

    modalInstance.result.then((action: MessageBoxButton) => {
      if (action === MessageBoxButton.Confirm) {
        this.deleteQuestion(question);
      }
    });
  }

  deleteQuestion(question: Question) {
    this.toastr.info('Deleting...', '', { disableTimeOut: true });
    this.questionService.findAndDelete(question.id).subscribe((response) => {
      this.toastr.clear();
      if (response.success) {
        this.toastr.success('Deleted!', '', { timeOut: 2000 });
        const index = this.questions.findIndex((d) => d.id === question.id);
        if (index !== -1) this.questions.splice(index, 1);
      } else {
        this.toastr.error(response.message, '', { timeOut: 2000 });
      }
    });
  }

  onOptions(question: Question) {
    const modalInstance = this.modal.open(QuestionOptionsComponent, {
      size: 'md',
      windowClass: 'modal-rounded',
      backdrop: 'static',
    });

    modalInstance.componentInstance.question = question;
    modalInstance.result.then(() => {});
  }
}
