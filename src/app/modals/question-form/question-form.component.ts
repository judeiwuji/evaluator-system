import { Component, Input, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import {
  CreateQuestionRequest,
  Option,
  Question,
  UpdateQuestionRequest,
} from 'src/app/models/interface/Question.interface';
import { QuestionService } from 'src/app/services/question.service';

@Component({
  selector: 'app-question-form',
  templateUrl: './question-form.component.html',
  styleUrls: ['./question-form.component.css'],
})
export class QuestionFormComponent implements OnInit {
  @Input()
  question: Question | undefined;
  @Input()
  quizId: number = 0;
  formData: FormGroup = new FormGroup({});
  options: string[] = [];
  processing = false;

  constructor(
    private readonly questionService: QuestionService,
    private readonly activeModal: NgbActiveModal,
    private readonly toastr: ToastrService,
    private readonly formBuilder: FormBuilder
  ) {}

  close() {
    this.activeModal.dismiss();
  }

  get fd() {
    return this.formData.controls;
  }

  answerExists() {
    const answer = this.fd['answer'].value;
    const options = this.fd['options'].value;
    return options.includes(answer);
  }

  create() {
    if (this.processing) return;
    this.processing = true;
    if (!this.answerExists()) {
      this.toastr.warning('Include the answer in the options.', '', {
        timeOut: 2000,
      });
      return;
    }
    const request: CreateQuestionRequest = {
      question: this.fd['question'].value,
      answer: this.fd['answer'].value,
      score: this.fd['score'].value,
      timeout: this.fd['timeout'].value,
      options: this.fd['options'].value,
      quizId: this.quizId,
    };
    this.toastr.info('Adding...', '', { disableTimeOut: true });
    this.questionService.create(request).subscribe((response) => {
      this.toastr.clear();
      this.processing = false;
      if (response.success) {
        this.toastr.success('Added', '', { timeOut: 2000 });
        this.activeModal.close(response.result);
      } else {
        this.toastr.error(response.message, '', { timeOut: 2000 });
      }
    });
  }

  update() {
    const request: UpdateQuestionRequest = {
      id: this.question?.id as number,
      question: this.fd['question'].value,
      answer: this.fd['answer'].value,
      score: this.fd['score'].value,
      timeout: this.fd['timeout'].value,
    };

    this.toastr.info('Saving...', '', { disableTimeOut: true });

    this.questionService.findAndUpdate(request).subscribe((response) => {
      this.toastr.clear();
      if (response.success) {
        this.toastr.success('Saved!', '', { timeOut: 2000 });
        if (this.question) {
          this.question.answer = this.fd['answer'].value;
          this.question.question = this.fd['question'].value;
          this.question.score = this.fd['score'].value;
          this.question.timeout = this.fd['timeout'].value;
          this.activeModal.dismiss();
        }
      } else {
        this.toastr.error(response.message, '', { timeOut: 2000 });
      }
    });
  }

  addOption(option: string) {
    if (!option) return;
    const options = this.formData.get('options');
    if (!options?.value.includes(option)) {
      options?.value.push(option);
    }
  }

  removeOption(option: string) {
    const options = this.formData.get('options');
    const index = options?.value.findIndex((d: string) => d === option);
    if (index !== -1) options?.value.splice(index, 1);
  }

  ngOnInit(): void {
    this.formData = this.formBuilder.group({
      question: new FormControl(this.question ? this.question.question : '', [
        Validators.required,
      ]),
      answer: new FormControl(this.question ? this.question.answer : '', [
        Validators.required,
      ]),
      score: new FormControl(this.question ? this.question.score : 2, [
        Validators.required,
      ]),
      timeout: new FormControl(this.question ? this.question.timeout : 30, [
        Validators.required,
      ]),
      options: this.formBuilder.array([]),
    });
  }
}
