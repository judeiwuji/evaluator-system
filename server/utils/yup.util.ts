import { AnySchema } from 'yup';

export const validator = async (schema: AnySchema, data: any) => {
  let response: { isValid: boolean; errors: Array<string> } = {
    isValid: false,
    errors: [],
  };
  try {
    await schema.validate(data);
    response.isValid = true;
  } catch (reason: any) {
    response.errors = reason.errors;
  }
  return response;
};
