import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { QuestionUploadTemplate } from 'src/app/models/interface/Question.interface';
import {
  MessageBoxSetting,
  MessageBoxType,
} from 'src/app/models/MessageBox.model';
import { QuestionUploadView } from 'src/app/models/Question.model';
import { QuestionService } from 'src/app/services/question.service';
import * as XLSX from 'xlsx';
import { MessageBoxComponent } from '../message-box/message-box.component';

@Component({
  selector: 'app-upload-question',
  templateUrl: './upload-question.component.html',
  styleUrls: ['./upload-question.component.css'],
})
export class UploadQuestionComponent implements OnInit {
  @Input()
  quizId: number | undefined;

  file: any;
  arrayBuffer: ArrayBuffer | undefined;
  fileList: any;
  arrayList: QuestionUploadTemplate[] = [];
  isMainView = false;
  isPreview = false;
  isProcessing = false;
  constructor(
    private readonly activeModal: NgbActiveModal,
    private readonly questionService: QuestionService,
    private readonly toastr: ToastrService,
    private modal: NgbModal
  ) {
    this.setView(QuestionUploadView.Main);
  }

  close() {
    this.activeModal.dismiss();
  }

  setView(mode: QuestionUploadView) {
    this.isMainView = mode === QuestionUploadView.Main;
    this.isPreview = mode === QuestionUploadView.Preview;
    this.isProcessing = mode === QuestionUploadView.Processing;
  }

  onBackToMain() {
    this.setView(QuestionUploadView.Main);
  }

  addFile(event: any) {
    this.file = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.file);
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result as ArrayBuffer;
      const data = new Uint8Array(this.arrayBuffer);
      const arr = new Array();

      for (var i = 0; i != data.length; ++i) {
        arr[i] = String.fromCharCode(data[i]);
      }
      var bstr = arr.join('');
      var workbook = XLSX.read(bstr, { type: 'binary' });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      console.log(XLSX.utils.sheet_to_json(worksheet, { raw: true }));
      this.arrayList = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      this.setView(QuestionUploadView.Preview);
      // this.fileList = [];
      // console.log(this.fileList);
    };
  }

  onUploadQuestions() {
    this.setView(QuestionUploadView.Processing);
    const formdata = new FormData();
    formdata.append('upload', this.file);
    formdata.append('quizId', `${this.quizId ? this.quizId : 0}`);
    this.toastr.info('Uploading...', '', { disableTimeOut: true });
    this.questionService.uploadQuestions(formdata).subscribe((response) => {
      this.toastr.clear();

      if (response.success) {
        this.activeModal.close(true);
      } else {
        this.setView(QuestionUploadView.Preview);
        this.toastr.warning(response.message, '', { timeOut: 3000 });
        this.showMessageBox(response.errors?.join('<br><hr>') as string);
      }
    });
  }

  showMessageBox(message: string) {
    const modalInstance = this.modal.open(MessageBoxComponent, {
      size: 'lg',
      backdrop: 'static',
      windowClass: 'modal-rounded',
    });

    modalInstance.componentInstance.settings = new MessageBoxSetting(
      'Operation Failed',
      message,
      MessageBoxType.Html
    );
  }

  ngOnInit(): void {}
}
