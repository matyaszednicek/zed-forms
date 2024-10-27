import { ZodError, ZodObject, ZodRawShape } from 'zod';
import { Fields, FormErrors, FormResolver, ResolverResult } from '../Form';

export const zodResolver = <TFields extends Fields>(schema: ZodObject<ZodRawShape>): FormResolver<TFields> => {
  return (fields: Fields) => {
    const result: ResolverResult<TFields> = {
      values: {} as TFields,
      errors: {} as FormErrors<TFields>,
    };

    for (const key of Object.keys(fields)) {
      const field = fields[key];
      try {
        schema.shape[key].parse(field);
        result.values[key] = field;
      } catch (error) {
        if (error instanceof ZodError) {
          result.errors = {
            ...result.errors,
            [key]: { errors: error.format()._errors },
          };
        } else {
          result.errors = {
            ...result.errors,
            [key]: {
              errors: ['Forbidden value'],
            },
          };
        }
      }
    }

    return result;
  };
};
