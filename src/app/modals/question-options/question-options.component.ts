import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import {
  Question,
  Option,
  UpdateOptionRequest,
  CreateOptionRequest,
} from 'src/app/models/interface/Question.interface';
import { QuestionService } from 'src/app/services/question.service';

@Component({
  selector: 'app-question-options',
  templateUrl: './question-options.component.html',
  styleUrls: ['./question-options.component.css'],
})
export class QuestionOptionsComponent implements OnInit {
  @Input()
  question: Question | undefined;

  formData = new FormGroup({
    option: new FormControl('', [Validators.required]),
  });

  constructor(
    private readonly questionService: QuestionService,
    private readonly toastr: ToastrService,
    private activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {}

  close() {
    this.activeModal.close();
  }

  addOption() {
    const request: CreateOptionRequest = {
      option: this.formData.get('option')?.value,
      questionId: this.question?.id as number,
    };

    this.toastr.info('Adding...', '', { disableTimeOut: true });
    this.questionService.createOption(request).subscribe((response) => {
      this.toastr.clear();
      if (response.success && response.result) {
        this.question?.options.push(response.result);
        this.formData.reset();
      } else {
        this.toastr.error(response.message, '');
      }
    });
  }

  update(option: Option, newOption: string) {
    if (!newOption) return;
    const request: UpdateOptionRequest = {
      id: option.id,
      option: newOption,
    };

    this.toastr.info('Saving...', '', { disableTimeOut: true });
    this.questionService.findAndUpdateOption(request).subscribe((response) => {
      this.toastr.clear();
      if (response.success) {
        option.option = newOption;
        this.switchToEditMode(option);
      } else {
        this.toastr.error(response.message);
      }
    });
  }

  deleteOption(option: Option) {
    this.toastr.info('Deleting...', '', { disableTimeOut: true });
    this.questionService
      .findAndDeleteOption(option.id)
      .subscribe((response) => {
        this.toastr.clear();
        if (response.success) {
          const index = this.question?.options.findIndex(
            (d) => d.id === option.id
          );
          if (index && index !== -1) this.question?.options.splice(index, 1);
          this.toastr.success('Deleted!');
        } else {
          this.toastr.error(response.message);
        }
      });
  }

  optionLabel(index: number) {
    return String.fromCharCode(97 + index);
  }

  temp: any = {};

  switchToEditMode(option: Option, cancel = false) {
    this.temp[option.id] = option.option;
    if (cancel) {
      option.isEditMode = false;
      option.option = this.temp[option.id];
      return;
    }

    option.isEditMode = !option.isEditMode;
  }
}
