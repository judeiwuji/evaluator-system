import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Quiz } from '@prisma/client';
import { ToastrService } from 'ngx-toastr';
import {
  CreateQuizRequest,
  UpdateQuizRequest,
} from 'src/app/models/interface/Quiz.interface';
import { QuizService } from 'src/app/services/quiz.service';

@Component({
  selector: 'app-quiz-form',
  templateUrl: './quiz-form.component.html',
  styleUrls: ['./quiz-form.component.css'],
})
export class QuizFormComponent implements OnInit {
  @Input()
  quiz: Quiz | undefined;
  @Input()
  topicId: number = 0;
  formData: FormGroup = new FormGroup({});

  constructor(
    private readonly quizService: QuizService,
    private readonly activeModal: NgbActiveModal,
    private readonly toastr: ToastrService
  ) {}

  close() {
    this.activeModal.dismiss();
  }

  get fd() {
    return this.formData.controls;
  }

  create() {
    const request: CreateQuizRequest = {
      title: this.fd['title'].value,
      topicId: this.topicId,
      active: false,
    };
    this.toastr.info('Adding...', '', { disableTimeOut: true });
    this.quizService.create(request).subscribe((response) => {
      this.toastr.clear();
      if (response.success) {
        this.toastr.success('Added', '', { timeOut: 2000 });
        this.activeModal.close(response.result);
      } else {
        this.toastr.error(response.message, '', { timeOut: 2000 });
      }
    });
  }

  update() {
    const request: UpdateQuizRequest = {
      id: this.quiz?.id as number,
      title: this.fd['title'].value,
      token: this.fd['token'].value,
    };

    this.toastr.info('Saving...', '', { disableTimeOut: true });

    this.quizService.findAndUpdate(request).subscribe((response) => {
      this.toastr.clear();
      if (response.success) {
        this.toastr.success('Saved!', '', { timeOut: 2000 });
        if (this.quiz) {
          this.quiz.title = this.fd['title'].value;
          this.quiz.token = this.fd['token'].value;
          this.activeModal.dismiss();
        }
      } else {
        this.toastr.error(response.message, '', { timeOut: 2000 });
      }
    });
  }

  ngOnInit(): void {
    this.formData = new FormGroup({
      token: new FormControl(this.quiz ? this.quiz.token : ''),
      title: new FormControl(this.quiz ? this.quiz.title : '', [
        Validators.required,
      ]),
    });
  }
}
