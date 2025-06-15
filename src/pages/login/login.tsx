import { FC, SyntheticEvent } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { getIsAuthSelector, loginUser } from '../../services/userSlice';
import { Navigate } from 'react-router-dom';
import { useForm } from '../../hooks/useForm';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(getIsAuthSelector);

  const { values, handleChange } = useForm({ email: '', password: '' });

  if (isAuthenticated) {
    return <Navigate to='/' />;
  }

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const { email, password } = values;
    if (!email || !password) {
      return;
    }
    dispatch(loginUser({ email, password }));
  };

  return (
    <LoginUI
      errorText=''
      email={values.email}
      password={values.password}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};
