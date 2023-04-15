import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Store } from '../../Store';
import { toast } from 'react-toastify';
import { getError, passwordRegexp } from '../../utils';
import Container from 'react-bootstrap/Container';
import { Helmet } from 'react-helmet-async';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';

// INTEGRATED

const reducer = (state, action) => {
  switch (action.type) {
    case 'PASSWORD_UPDATE': {
      const password = {
        value: action.payload,
        isValid: passwordRegexp.test(action.payload),
      };
      const confirmPassword = {
        ...state.confirmPassword,
        isValid: password.value === state.confirmPassword.value,
      };
      const isFormValid = password.isValid && confirmPassword.isValid;
      return { ...state, password, confirmPassword, isFormValid };
    }
    case 'CONFIRM_PASSWORD_UPDATE':
      const confirmPassword = {
        value: action.payload,
        isValid: state.password.value === action.payload,
      };
      const isFormValid = state.password.isValid && confirmPassword.isValid;
      return { ...state, confirmPassword, isFormValid };
    default:
      return state;
  }
};

export default function ResetPasswordScreen() {
  const navigate = useNavigate();
  const { token } = useParams();

  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ password, confirmPassword, isFormValid }, dispatch] = useReducer(
    reducer,
    {
      password: { value: '', isValid: false },
      confirmPassword: { value: '', isValid: false },
      isFormValid: false,
    }
  );

  useEffect(() => {
    if (userInfo || !token) {
      navigate('/');
    }
  }, [navigate, token, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      return;
    }

    try {
      // await axios.post('/v1/users/reset-password', {
      //   resetPasswordToken: token,
      //   newPassword: password,
      // });

      toast.success('Password updated successfully');
      navigate('/signin');
    } catch (error) {
      toast.error(getError(error));
    }
  };

  return (
    <Container className="small-container">
      <Helmet>
        <title>Reset Password</title>
      </Helmet>
      <h1 className="my-3">Reset Password</h1>
      <Form noValidate onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type="password"
            required
            isValid={password.isValid}
            isInvalid={!password.isValid}
            onChange={(e) =>
              dispatch({ type: 'PASSWORD_UPDATE', payload: e.target.value })
            }
          />
          <Form.Control.Feedback type="invalid">
            Password should has minimum 8 characters, at least one uppercase
            letter, one lowercase letter and one number
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="confirmPassword">
          <Form.Label>Confirm New Password</Form.Label>
          <Form.Control
            type="password"
            required
            isValid={password.value !== '' && confirmPassword.isValid}
            isInvalid={!confirmPassword.isValid}
            onChange={(e) =>
              dispatch({
                type: 'CONFIRM_PASSWORD_UPDATE',
                payload: e.target.value,
              })
            }
          />
          <Form.Control.Feedback type="invalid">
            Passwords do not match
          </Form.Control.Feedback>
        </Form.Group>
        <div className="mb-3">
          <Button type="submit" disabled={!isFormValid}>
            Reset Password
          </Button>
        </div>
      </Form>
    </Container>
  );
}
