import { useState, ChangeEvent } from 'react';

type FormValues = {
  [key: string]: string;
};

export function useForm(initialValues: FormValues = {}) {
  const [values, setValues] = useState<FormValues>(initialValues);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  return { values, handleChange, setValues };
}
