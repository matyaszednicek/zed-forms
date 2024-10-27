## Zed Forms - React form manipulation library

I create the Zed libraries to deepen my understanding of the inner workings of libraries such as _react-query_ or _react-hook-form_.

---

Simple typescript library for handling react forms.

### Install

```sh
npm install zed-forms
```

### Usage

```js
import { useForm, zodResolver } from 'zed-forms';
import { z } from 'zod';

const formSchema = z.object({
  name: z.string().min(3).max(32),
  age: z.number().min(18).max(100),
});
type FormFields = z.infer<typeof formSchema>;

function App() {
  const { registerField, handleSubmit, formState, reset } = useForm<FormFields>(
    {
      defaultValues: {
        name: '',
        age: NaN,
      },
      resolver: zodResolver(formSchema),
    }
  );

  const onSubmit = (data: FormFields) => {
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">Zed Form</h1>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Name (3-32 characters)</label>
          <input
            type="text"
            {...registerField('name')}
            placeholder="Name"
            className="p-2 border border-gray-300 rounded"
          />
          {formState.errors.name && (
            <p className="mt-1 text-sm text-red-500">
              {formState.errors.name.errors[0]}
            </p>
          )}
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Age (18-100)</label>
          <input
            type="number"
            {...registerField('age', { asNumber: true })}
            placeholder="Age"
            className="p-2 border border-gray-300 rounded"
          />
          {formState.errors.age && (
            <p className="mt-1 text-sm text-red-500">
              {formState.errors.age.errors[0]}
            </p>
          )}
        </div>
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => {
              reset();
            }}
            className="px-4 py-2 text-white bg-gray-500 rounded"
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-500 rounded disabled:opacity-50"
            disabled={!formState.isValid}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;

```
