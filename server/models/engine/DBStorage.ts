import { Sequelize } from 'sequelize-typescript';
import * as mysql2 from 'mysql2';
import * as dotenv from 'dotenv';
import User from '../User.model';
import Student from '../Student.model';
import Teacher from '../Teacher.model';
import Admin from '../Admin.model';
import Level from '../Level.model';
import Department from '../Department.model';
import Course from '../Course.model';
import Topic from '../Topic.model';
import Quiz from '../Quiz.model';
import Question from '../Question.model';
import Option from '../Option';
import Answer from '../Answer.model';
import RefreshToken from '../RefreshToken';
import Activity from '../Activity.model';
dotenv.config();

const DB = new Sequelize({
  database: process.env['DB_NAME'],
  host: process.env['DB_HOST'],
  password: process.env['DB_PASS'],
  username: process.env['DB_USER'],
  dialect: 'mysql',
  dialectModule: mysql2,
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
    paranoid: true,
    timestamps: true,
  },
  // logging: true,
  timezone: '+01:00',
  models: [
    Department,
    Level,
    User,
    RefreshToken,
    Admin,
    Teacher,
    Student,
    Course,
    Topic,
    Quiz,
    Question,
    Option,
    Answer,
    Activity,
  ],
});

// User.hasOne(Admin, { as: 'admin', foreignKey: 'userId' });
// User.hasOne(Student, { as: 'student', foreignKey: 'userId' });
// User.hasOne(Teacher, { as: 'teacher', foreignKey: 'userId' });
export default DB;
