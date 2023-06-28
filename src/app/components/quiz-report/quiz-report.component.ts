import { Component, Input, OnInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { ToastrService } from 'ngx-toastr';
import {
  QuizReport,
  QuizResult,
  ReportDataset,
} from 'src/app/models/interface/Quiz.interface';
import { QuizService } from 'src/app/services/quiz.service';

@Component({
  selector: 'app-quiz-report',
  templateUrl: './quiz-report.component.html',
  styleUrls: ['./quiz-report.component.css'],
})
export class QuizReportComponent implements OnInit {
  @Input()
  quizId: number | undefined;
  quizResults: QuizResult[] = [];

  public chart_Options: ChartOptions = {
    responsive: true,
    color: '#FF7360',
    borderColor: '#FF7360',
  };
  public chart_Labels: string[] = [];
  public chart_Type: ChartType = 'bar';
  public chart_Legend = true;
  public chart_Plugins = [];
  public chart_Data: ReportDataset[] = [];
  public chart_Colors: any[] = [
    {
      backgroundColor: '#FF7360',
    },
  ];
  public generatingReport = false;
  public loadingResults = false;

  constructor(
    private readonly quizService: QuizService,
    private readonly toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.generatingReport = true;
    this.loadingResults = true;
    this.quizService
      .generateQuizReport(this.quizId as number)
      .subscribe((response) => {
        this.generatingReport = false;
        if (response.success) {
          if (response.result) {
            const report: QuizReport = response.result;
            this.chart_Labels = report.labels;
            this.chart_Data = report.dataset;
          }
        } else {
          this.toastr.error(response.message);
        }
      });

    this.quizService
      .findQuizResults(this.quizId as number)
      .subscribe((response) => {
        this.loadingResults = false;
        if (response.success) {
          if (response.results) this.quizResults = response.results;
        } else {
          this.toastr.error(response.message);
        }
      });
  }
}
