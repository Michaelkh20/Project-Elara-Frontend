import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Store } from '../../Store';
import { toast } from 'react-toastify';
import { getError } from '../../utils';
import Container from 'react-bootstrap/Container';
import { Helmet } from 'react-helmet-async';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';

export default function ResetPasswordScreen() {
  const navigate = useNavigate();
  const { token } = useParams();

  const { state } = useContext(Store);
  const { userInfo } = state;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (userInfo || !token) {
      navigate('/');
    }
  }, [navigate, token, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const { data } = await axios.post('/api/users/reset-password', {
        password,
        token,
      });

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
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="confirmPassword">
          <Form.Label>Confirm New Password</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>
        <div className="mb-3">
          <Button type="submit">Reset Password</Button>
        </div>
      </Form>
    </Container>
  );
}
