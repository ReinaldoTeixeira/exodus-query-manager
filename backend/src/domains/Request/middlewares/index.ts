import * as Yup from 'yup';
import { NextFunction, Request, Response } from 'express';

import { CustomError } from '../../../errors/CustomError';

export const createMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const schema = Yup.object().shape({
    userId: Yup.string().required('userId is required'),
    host: Yup.string().required('Host is required'),
    databases: Yup.array().of(Yup.object()).required('Databases are required'),
    ddl: Yup.string().required('DDL is required'),
    description: Yup.string().required('Description is required'),
    timeToRun: Yup.string().required('Time to run is required'),
    schedule: Yup.string()
      .nullable(true)
      .when('timeToRun', {
        is: 'schedule',
        then: Yup.string().required('Schedule is required'),
      }),
  });

  try {
    await schema.validate(request.body);
    return next();
  } catch (err) {
    throw new CustomError(err.message, 422);
  }
};