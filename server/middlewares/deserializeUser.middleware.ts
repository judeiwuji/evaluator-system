import { NextFunction, Request, Response } from 'express';
import { decode } from 'jsonwebtoken';
import { AppRequest } from 'server/models/App.model';
import { getUser } from 'server/services/User.service';
import * as cookie from 'cookie';

export const deserializeUser = async (
  req: AppRequest,
  res: Response,
  next: NextFunction
) => {
  const cookies = cookie.parse(req.headers.cookie || '');
  const authorization = cookies['access-token'];
  if (authorization) {
    const accessToken = authorization.split(' ')[1];
    const decoded: any = decode(accessToken);
    if (decoded) {
      req.user = await getUser({ id: decoded.user });
    }
  }

  next();
};
