import { Application } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import AdminRoute from './Admin.route';
import AnswerRoute from './Answer.route';
import AppRoute from './App.route';
import CourseRoute from './Course.route';
import DepartmentRoute from './Department.route';
import QuestionRoute from './Question.route';
import QuizRoute from './Quiz.route';
import StudentRoute from './Student.route';
import TeacherRoute from './Teacher.route';
import TopicRoute from './Topic.route';
import UserRoute from './User.route';

export default class RouteManager {
  constructor(private app: Application) {
    this.routes();
  }
  routes() {
    //   register routes here
    new AppRoute(this.app);
    new DepartmentRoute(this.app);
    new AdminRoute(this.app);
    new StudentRoute(this.app);
    new TeacherRoute(this.app);
    new CourseRoute(this.app);
    new TopicRoute(this.app);
    new QuizRoute(this.app);
    new QuestionRoute(this.app);
    new AnswerRoute(this.app);
    new UserRoute(this.app);
  }
}
