import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import {
  Quiz,
  ValidateQuizTokenRequest,
} from 'src/app/models/interface/Quiz.interface';
import { QuizService } from 'src/app/services/quiz.service';

@Component({
  selector: 'app-quiz-validator',
  templateUrl: './quiz-validator.component.html',
  styleUrls: ['./quiz-validator.component.css'],
})
export class QuizValidatorComponent implements OnInit {
  @Input()
  quiz: Quiz | undefined;
  formData = new FormGroup({
    token: new FormControl('', [Validators.required]),
  });
  isProcessing = false;

  constructor(
    private readonly activeModal: NgbActiveModal,
    private readonly toastr: ToastrService,
    private readonly quizService: QuizService,
    private readonly router: Router
  ) {}

  close() {
    this.activeModal.dismiss();
  }

  validateQuizToken() {
    if (this.isProcessing) return;
    this.isProcessing = true;
    const request: ValidateQuizTokenRequest = {
      quizId: this.quiz?.id as number,
      token: this.formData.get('token')?.value,
    };
    this.toastr.info('Validating...', '', { disableTimeOut: true });
    this.quizService.validateQuizToken(request).subscribe((response) => {
      this.isProcessing = false;
      this.toastr.clear();
      if (response.success) {
        this.close();
        this.router.navigate([`/student/quiz/${response.result}`]);
      } else {
        this.toastr.error(response.message);
      }
    });
  }

  ngOnInit(): void {}
}
