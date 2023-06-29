import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import {
  ChangePasswordRequest,
  CreateAccesTokenRequest,
  RefreshAccessTokenRequest,
  ResetPasswordRequest,
} from 'server/models/App.model';
import { Feedback } from 'server/models/Feedback.model';
import { signToken } from 'server/utils/jwt.util';
import * as crypto from 'crypto';
import RefreshToken from 'server/models/RefreshToken';
import User from 'server/models/User.model';
import Activity from 'server/models/Activity.model';
import Level from 'server/models/Level.model';
import DB from 'server/models/engine/DBStorage';
import Admin from 'server/models/Admin.model';

const ACCESS_TOKEN_TIMEOUT = process.env['ACCESS_TOKEN_TIMEOUT'] as string;
const REFRESH_TOKEN_TIMEOUT = process.env['REFRESH_TOKEN_TIMEOUT'] as string;
const SALT_ROUND = Number(process.env['SALT_ROUND']);

export const createAccessToken = async (request: CreateAccesTokenRequest) => {
  const token = signToken({ user: request.userId }, REFRESH_TOKEN_TIMEOUT);
  const refreshToken = await RefreshToken.create({
    token,
    userId: request.userId,
    userAgent: request.userAgent,
  });

  const accessToken = `Bearer ${signToken(
    {
      token: refreshToken.id,
      user: refreshToken.userId,
      type: request.userType,
    },
    ACCESS_TOKEN_TIMEOUT
  )}`;
  return accessToken;
};

export const refreshAccessToken = async (
  request: RefreshAccessTokenRequest
) => {
  let accessToken: string;
  try {
    const token = signToken({ userId: request.userId }, REFRESH_TOKEN_TIMEOUT);
    await RefreshToken.update(
      {
        token,
      },
      { where: { id: request.id } }
    );
    accessToken = `Bearer ${signToken(
      { token: request.id, user: request.userId, type: request.userType },
      ACCESS_TOKEN_TIMEOUT
    )}`;
  } catch (error) {
    console.log(error);
    accessToken = '';
  }

  return accessToken;
};

export const logout = async (id: string) => {
  let feedback: Feedback;
  try {
    await RefreshToken.destroy({
      where: { id },
    });
    feedback = new Feedback(true, 'success');
  } catch (error) {
    console.log(error);
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};

export const getRefreshToken = async (filter: any) => {
  return await RefreshToken.findOne({ where: filter });
};

export const changePassword = async (
  request: ChangePasswordRequest,
  userId: number
) => {
  let feedback: Feedback;
  try {
    const user = await User.findOne({ where: { id: userId } });
    const isMatch = compareSync(request.oldPassword, user?.password as string);
    if (isMatch) {
      const salt = genSaltSync(SALT_ROUND);
      const hash = hashSync(request.newPassword, salt);
      await User.update(
        {
          password: hash,
        },
        { where: { id: userId } }
      );
      feedback = new Feedback(true, 'success');
      // Track Activity
      await Activity.create({
        userId: userId,
        content: `changed password`,
      });
    } else {
      feedback = new Feedback(false, 'Incorrect old password.');
    }
  } catch (error) {
    console.log(error);
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};

export const resetPassword = async (request: ResetPasswordRequest) => {
  let feedback: Feedback;
  try {
    const user = await User.findOne({
      where: { email: request.email },
    });
    if (user) {
      const password = crypto.randomBytes(6).toString('hex').substring(0, 5);
      const salt = genSaltSync(SALT_ROUND);
      const hash = hashSync(password, salt);
      await User.update(
        {
          password: hash,
        },
        { where: { id: user.id } }
      );
      feedback = new Feedback(true, 'success');
      feedback.result = password;
    } else {
      feedback = new Feedback(false, 'User record not found');
    }
  } catch (error) {
    console.log(error);
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};

export const getLevels = async () => {
  let feedback: Feedback;
  try {
    feedback = new Feedback(true, 'success');
    feedback.results = await Level.findAll();
  } catch (error) {
    feedback = new Feedback(false, 'Operation failed');
    console.log(error);
  }
  return feedback;
};

export const installApp = async () => {
  const salt = genSaltSync(SALT_ROUND);
  const hash = hashSync('admin', salt);
  const transaction = await DB.transaction();
  let feedback: Feedback;

  try {
    const adminExists = await Admin.findOne({});

    if (adminExists) {
      throw new Error('App already installed');
    }
    const user = await User.create(
      {
        surname: 'admin',
        othernames: 'admin',
        password: hash,
        email: 'admin@app.com',
        type: 'admin',
      },
      { transaction }
    );

    await Admin.create({ userId: user.id }, { transaction });
    await Level.bulkCreate(
      [{ name: 'ND1' }, { name: 'ND2' }, { name: 'HND1' }, { name: 'HND2' }],
      { transaction }
    );

    await transaction.commit();
    feedback = new Feedback(true, 'installed');
  } catch (error: any) {
    await transaction.commit();
    feedback = new Feedback(false, error.message);
  }
  return feedback;
};
