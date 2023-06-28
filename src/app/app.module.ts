import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { StudentDashboardComponent } from './student/student-dashboard/student-dashboard.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminAccountComponent } from './admin/admin-account/admin-account.component';
import { TeacherDashboardComponent } from './teacher/teacher-dashboard/teacher-dashboard.component';
import { TeacherAccountComponent } from './teacher/teacher-account/teacher-account.component';
import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HeaderInterceptor } from './interceptor/HeaderInterceptor.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgChartsModule } from 'ng2-charts';

import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AdminManagerComponent } from './components/admin-manager/admin-manager.component';
import { TeacherManagerComponent } from './components/teacher-manager/teacher-manager.component';
import { StudentManagerComponent } from './components/student-manager/student-manager.component';
import { DepartmentComponent } from './admin/department/department.component';
import { AdminManageAdminsComponent } from './admin/admin-manage-admins/admin-manage-admins.component';
import { AdminManageTeachersComponent } from './admin/admin-manage-teachers/admin-manage-teachers.component';
import { AdminManageStudentsComponent } from './admin/admin-manage-students/admin-manage-students.component';
import { DepartmentFormComponent } from './modals/department-form/department-form.component';
import { MessageBoxComponent } from './modals/message-box/message-box.component';
import { CookieModule } from 'ngx-cookie';
import { AdminFormComponent } from './modals/admin-form/admin-form.component';
import { ProfileCardComponent } from './modals/profile-card/profile-card.component';
import { TeacherFormComponent } from './modals/teacher-form/teacher-form.component';
import { StudentFormComponent } from './modals/student-form/student-form.component';
import { QuizManagerComponent } from './teacher/quiz-manager/quiz-manager.component';
import { CourseManagerComponent } from './teacher/course-manager/course-manager.component';
import { QuizQuestionManagerComponent } from './teacher/quiz-question-manager/quiz-question-manager.component';
import { TopicManagerComponent } from './teacher/topic-manager/topic-manager.component';
import { TeacherManageStudentsComponent } from './teacher/teacher-manage-students/teacher-manage-students.component';
import { TopicFormComponent } from './modals/topic-form/topic-form.component';
import { CourseFormComponent } from './modals/course-form/course-form.component';
import { QuizFormComponent } from './modals/quiz-form/quiz-form.component';
import { QuestionFormComponent } from './modals/question-form/question-form.component';
import { QuestionOptionsComponent } from './modals/question-options/question-options.component';
import { QuizResultsComponent } from './components/quiz-results/quiz-results.component';
import { ResultComponent } from './components/result/result.component';
import { TeacherQuizResultsComponent } from './teacher/teacher-quiz-results/teacher-quiz-results.component';
import { QuizReportComponent } from './components/quiz-report/quiz-report.component';
import { environment } from 'src/environments/environment';
import { StudentAccountComponent } from './student/student-account/student-account.component';
import { StudentResultsComponent } from './student/student-results/student-results.component';
import { QuizzesComponent } from './student/quizzes/quizzes.component';
import { QuizBoardComponent } from './student/quiz-board/quiz-board.component';
import { QuizValidatorComponent } from './modals/quiz-validator/quiz-validator.component';
import { TimerComponent } from './components/timer/timer.component';
import { StudentQuizzesResultComponent } from './components/student-quizzes-result/student-quizzes-result.component';
import { UploadQuestionComponent } from './modals/upload-question/upload-question.component';
import { UploadPhotoComponent } from './modals/upload-photo/upload-photo.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    StudentDashboardComponent,
    AdminDashboardComponent,
    AdminAccountComponent,
    TeacherDashboardComponent,
    TeacherAccountComponent,
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    ProfileComponent,
    AdminManagerComponent,
    TeacherManagerComponent,
    StudentManagerComponent,
    DepartmentComponent,
    AdminManageAdminsComponent,
    AdminManageTeachersComponent,
    AdminManageStudentsComponent,
    DepartmentFormComponent,
    MessageBoxComponent,
    AdminFormComponent,
    ProfileCardComponent,
    TeacherFormComponent,
    StudentFormComponent,
    QuizManagerComponent,
    CourseManagerComponent,
    QuizQuestionManagerComponent,
    TopicManagerComponent,
    TeacherManageStudentsComponent,
    TopicFormComponent,
    CourseFormComponent,
    QuizFormComponent,
    QuestionFormComponent,
    QuestionOptionsComponent,
    QuizResultsComponent,
    ResultComponent,
    TeacherQuizResultsComponent,
    QuizReportComponent,
    StudentAccountComponent,
    StudentResultsComponent,
    QuizzesComponent,
    QuizBoardComponent,
    QuizValidatorComponent,
    TimerComponent,
    StudentQuizzesResultComponent,
    UploadQuestionComponent,
    UploadPhotoComponent,
    ForgotPasswordComponent,
    RegisterComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastrModule.forRoot({ timeOut: 2000 }),
    CookieModule.forRoot(),
    NgChartsModule,
  ],
  entryComponents: [
    DepartmentFormComponent,
    AdminFormComponent,
    ProfileCardComponent,
    CourseFormComponent,
    TopicFormComponent,
    QuestionFormComponent,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
