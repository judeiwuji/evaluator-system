import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { QuizValidatorComponent } from 'src/app/modals/quiz-validator/quiz-validator.component';
import { Quiz } from 'src/app/models/interface/Quiz.interface';
import { QuizService } from 'src/app/services/quiz.service';

@Component({
  selector: 'app-quizzes',
  templateUrl: './quizzes.component.html',
  styleUrls: ['./quizzes.component.css'],
})
export class QuizzesComponent implements OnInit {
  public currentPage = 1;
  public hasMore = false;
  public quizzes: Quiz[] = [];
  public search = '';
  public firstTimeLoadCompleted = false;
  public topicId: number = 0;
  public searchForm: FormGroup = new FormGroup({
    search: new FormControl('', [Validators.required]),
  });
  public loading = false;

  constructor(
    private readonly quizService: QuizService,
    private readonly toastr: ToastrService,
    private readonly modal: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  onSearch() {
    this.quizzes = [];
    this.loadData(1);
  }

  loadData(page = 1) {
    this.loading = true;
    this.quizService
      .findAll(
        page,
        this.topicId,
        this.searchForm.controls['search'].value,
        true
      )
      .subscribe((response) => {
        this.loading = false;
        if (!this.firstTimeLoadCompleted) this.firstTimeLoadCompleted = true;
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

  onStartQuiz(quiz: Quiz) {
    const modalInstance = this.modal.open(QuizValidatorComponent, {
      size: 'sm',
      backdrop: 'static',
      windowClass: 'modal-rounded',
    });
    modalInstance.componentInstance.quiz = quiz;
  }
}
