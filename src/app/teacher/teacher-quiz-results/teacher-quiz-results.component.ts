import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeacherQuizResultView } from 'src/app/models/AppEnums';
import { Quiz } from 'src/app/models/interface/Quiz.interface';
import { QuizService } from 'src/app/services/quiz.service';

@Component({
  selector: 'app-teacher-quiz-results',
  templateUrl: './teacher-quiz-results.component.html',
  styleUrls: ['./teacher-quiz-results.component.css'],
})
export class TeacherQuizResultsComponent implements OnInit {
  quizId: number = 0;
  quiz: Quiz | undefined;
  isResultView = false;
  isReportView = false;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly quizService: QuizService
  ) {
    this.setView(TeacherQuizResultView.Result);
  }

  setView(mode: TeacherQuizResultView) {
    this.isResultView = mode === TeacherQuizResultView.Result;
    this.isReportView = mode === TeacherQuizResultView.Report;
  }

  onGenerateReport() {
    this.setView(TeacherQuizResultView.Report);
  }

  onBack() {
    this.setView(TeacherQuizResultView.Result);
  }

  ngOnInit(): void {
    this.quizId = Number(this.activatedRoute.snapshot.params['qid']);
    this.quizService.findOne({ id: this.quizId }).subscribe((response) => {
      if (response.success && response.result) this.quiz = response.result;
    });
  }
}
