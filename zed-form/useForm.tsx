import React from 'react';
import { Form } from './Form';
import type { Fields, FormResolver, FormState, RegisterOptions } from './Form';

export type UseFormProps<TFields extends Fields> = {
  defaultValues: TFields;
  resolver: FormResolver<TFields>;
};

export function useForm<TFields extends Fields>({
  defaultValues,
  resolver,
}: UseFormProps<TFields>) {
  const [form] = React.useState(
    () => new Form<TFields>(defaultValues, resolver)
  );
  const [formState, setFormState] = React.useState<FormState<TFields>>(
    form.formState
  );

  const updateFormState = React.useCallback(() => {
    setFormState({ ...form.formState });
  }, [form]);

  const registerField = React.useCallback(
    <K extends keyof TFields & string>(key: K, options?: RegisterOptions) => {
      const field = form.registerField(key, options);

      return {
        value: field.value,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          field.onChange(e);
          updateFormState();
        },
        onBlur: () => {
          field.onBlur();
          updateFormState();
        },
      };
    },
    [form, updateFormState]
  );

  const handleSubmit = React.useCallback(
    (callback: (data: TFields) => void) => {
      return form.handleSubmit((data) => {
        callback(data);
        updateFormState();
      });
    },
    [form, updateFormState]
  );

  const reset = React.useCallback(() => {
    form.reset();
    updateFormState();
  }, [form, updateFormState]);

  return {
    registerField,
    handleSubmit,
    reset,
    formState,
  };
}
