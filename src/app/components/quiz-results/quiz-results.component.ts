import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Quiz, QuizResult } from 'src/app/models/interface/Quiz.interface';
import { QuizService } from 'src/app/services/quiz.service';

@Component({
  selector: 'app-quiz-results',
  templateUrl: './quiz-results.component.html',
  styleUrls: ['./quiz-results.component.css'],
})
export class QuizResultsComponent implements OnInit {
  @Input()
  quizId: number | undefined;
  quiz: Quiz | undefined;
  quizResults: QuizResult[] = [];
  firstTimeLoadComplete = false;
  loading = false;
  intervalID: any;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private readonly quizService: QuizService,
    private readonly toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.quizService.findOne({ id: this.quizId }).subscribe((response) => {
      if (response.success && response.result) {
        this.quiz = response.result;
        if (this.quiz?.active) {
          this.initQuizResultPoll();
        }
      }
    });

    this.loadQuizResults();
  }

  loadQuizResults() {
    this.loading = true;
    this.quizService
      .findQuizResults(this.quizId as number)
      .subscribe((response) => {
        this.firstTimeLoadComplete = true;
        this.loading = false;
        if (response.success) {
          if (response.results) this.quizResults = response.results;
        } else {
          this.toastr.error(response.message, '');
        }
      });
  }

  initQuizResultPoll() {
    if (isPlatformBrowser(this.platformId)) {
      this.intervalID = setInterval(() => {
        this.firstTimeLoadComplete = false;
        this.loadQuizResults();
      }, 30000);
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalID);
  }
}
