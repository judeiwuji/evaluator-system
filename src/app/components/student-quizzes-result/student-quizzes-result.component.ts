import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { StudentQuizResult } from 'src/app/models/interface/Student.interface';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-student-quizzes-result',
  templateUrl: './student-quizzes-result.component.html',
  styleUrls: ['./student-quizzes-result.component.css'],
})
export class StudentQuizzesResultComponent implements OnInit {
  @Input()
  studentId: number | undefined;
  results: StudentQuizResult[] = [];
  constructor(
    private readonly studentService: StudentService,
    private readonly toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.studentService
      .getStudentQuizzesResults(this.studentId)
      .subscribe((response) => {
        console.log(response);
        if (response.success) {
          if (response.results) this.results = response.results;
        } else {
          this.toastrService.error(response.message);
        }
      });
  }
}
