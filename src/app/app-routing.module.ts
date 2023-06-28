import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAccountComponent } from './admin/admin-account/admin-account.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminManageAdminsComponent } from './admin/admin-manage-admins/admin-manage-admins.component';
import { AdminManageStudentsComponent } from './admin/admin-manage-students/admin-manage-students.component';
import { AdminManageTeachersComponent } from './admin/admin-manage-teachers/admin-manage-teachers.component';
import { DepartmentComponent } from './admin/department/department.component';
import { AdminManagerComponent } from './components/admin-manager/admin-manager.component';
import { StudentManagerComponent } from './components/student-manager/student-manager.component';
import { TeacherManagerComponent } from './components/teacher-manager/teacher-manager.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { QuizBoardComponent } from './student/quiz-board/quiz-board.component';
import { QuizzesComponent } from './student/quizzes/quizzes.component';
import { StudentAccountComponent } from './student/student-account/student-account.component';
import { StudentDashboardComponent } from './student/student-dashboard/student-dashboard.component';
import { StudentResultsComponent } from './student/student-results/student-results.component';
import { CourseManagerComponent } from './teacher/course-manager/course-manager.component';
import { QuizManagerComponent } from './teacher/quiz-manager/quiz-manager.component';
import { QuizQuestionManagerComponent } from './teacher/quiz-question-manager/quiz-question-manager.component';
import { TeacherAccountComponent } from './teacher/teacher-account/teacher-account.component';
import { TeacherDashboardComponent } from './teacher/teacher-dashboard/teacher-dashboard.component';
import { TeacherManageStudentsComponent } from './teacher/teacher-manage-students/teacher-manage-students.component';
import { TeacherQuizResultsComponent } from './teacher/teacher-quiz-results/teacher-quiz-results.component';
import { TopicManagerComponent } from './teacher/topic-manager/topic-manager.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgot/password', component: ForgotPasswordComponent },
  { path: 'register', component: RegisterComponent },

  /** Admin Route */
  {
    path: 'admin',
    component: AdminDashboardComponent,
  },
  { path: 'admin/dashboard', component: AdminDashboardComponent },
  { path: 'admin/account', component: AdminAccountComponent },
  { path: 'admin/department', component: DepartmentComponent },
  { path: 'admin/manage/admins', component: AdminManageAdminsComponent },
  { path: 'admin/manage/teachers', component: AdminManageTeachersComponent },
  { path: 'admin/manage/students', component: AdminManageStudentsComponent },
  /** Admin Route */

  /** Teacher Route */
  { path: 'teacher/dashboard', component: TeacherDashboardComponent },
  { path: 'teacher/account', component: TeacherAccountComponent },
  {
    path: 'teacher/manage/students',
    component: TeacherManageStudentsComponent,
  },
  { path: 'teacher/manage/courses', component: CourseManagerComponent },
  {
    path: 'teacher/manage/course/topics/:cid',
    component: TopicManagerComponent,
  },
  {
    path: 'teacher/manage/course/topic/quiz/:tid',
    component: QuizManagerComponent,
  },
  {
    path: 'teacher/manage/course/topic/quiz/questions/:qid',
    component: QuizQuestionManagerComponent,
  },
  {
    path: 'teacher/manage/course/topic/quiz/results/:qid',
    component: TeacherQuizResultsComponent,
  },
  /** Teacher Route */

  /** Student Route */
  { path: 'student/dashboard', component: StudentDashboardComponent },
  { path: 'student/account', component: StudentAccountComponent },
  { path: 'student/quizzes', component: QuizzesComponent },
  { path: 'student/quiz/:token', component: QuizBoardComponent },
  { path: 'student/results', component: StudentResultsComponent },
  /** Student Route */
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
