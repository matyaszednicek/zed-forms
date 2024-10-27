export type Fields = Record<string, unknown>;

export type ResolverError = { errors: string[] };
export type ResolverResult<TFields extends Fields> = {
  values: Fields;
  errors: FormErrors<TFields>;
};
export type FormResolver<TFields extends Fields> = (
  fields: Fields
) => ResolverResult<TFields>;

export type FormErrors<TFields extends Fields> = {
  [K in keyof TFields]: ResolverError;
};
export type FormState<TFields extends Fields> = {
  isSubmitting: boolean;
  isDirty: boolean;
  isValid: boolean;
  errors: FormErrors<TFields>;
  fields: TFields;
};

export type RegisterOptions = {
  asNumber: boolean;
};

export class Form<TFields extends Fields> {
  private defaultValues: TFields;
  private fields: TFields;
  private resolver: FormResolver<TFields>;
  private state: FormState<TFields>;

  constructor(defaultValues: TFields, resolver: FormResolver<TFields>) {
    this.resolver = resolver;
    this.defaultValues = defaultValues;
    this.fields = JSON.parse(JSON.stringify(defaultValues));
    this.state = {
      isSubmitting: false,
      isDirty: false,
      isValid: false,
      errors: {} as FormErrors<TFields>,
      fields: this.fields,
    };
  }

  get formState() {
    return this.state;
  }

  private checkDirty() {
    this.state.isDirty =
      JSON.stringify(this.fields) !== JSON.stringify(this.defaultValues);
  }

  registerField = <K extends keyof TFields & string>(
    key: K,
    options?: RegisterOptions
  ) => {
    return {
      value: this.fields[key],
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = options?.asNumber
          ? Number(e.target.value)
          : e.target.value;
        this.fields[key] = newValue as TFields[K];
        this.checkDirty();
      },
      onBlur: () => {
        const validity = this.resolver(this.fields);
        if (Object.keys(validity.errors).includes(key)) {
          this.state.errors[key] = validity.errors[key];
        } else {
          delete this.state.errors[key];
        }
        this.state.isValid = Object.keys(validity.errors).length === 0;
      },
    };
  };

  reset() {
    this.fields = this.defaultValues;
    this.state = {
      isSubmitting: false,
      isDirty: false,
      isValid: false,
      errors: {} as FormErrors<TFields>,
      fields: this.fields,
    };
  }

  handleSubmit = (
    callback: (data: TFields) => void
  ): React.FormEventHandler<HTMLFormElement> => {
    return (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      this.handleSubmission(callback);
    };
  };

  private handleSubmission(callback: (data: TFields) => void) {
    this.state.isSubmitting = true;
    const validity = this.resolver(this.fields);
    this.state.errors = validity.errors;
    this.state.isValid = Object.keys(this.state.errors).length === 0;
    this.state.isSubmitting = false;
    if (this.state.isValid) {
      callback(this.fields);
    }
  }
}
