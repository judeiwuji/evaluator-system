import { Component, OnInit } from '@angular/core';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-student-results',
  templateUrl: './student-results.component.html',
  styleUrls: ['./student-results.component.css'],
})
export class StudentResultsComponent implements OnInit {
  constructor(private readonly studentService: StudentService) {}

  ngOnInit(): void {}

  loadData() {}
}
