import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store } from '../../Store';
import { toast } from 'react-toastify';
import { emailRegexp, getError } from '../../utils';
import Container from 'react-bootstrap/Container';
import { Helmet } from 'react-helmet-async';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';

//INTEGRATED

export default function ForgetPasswordScreen() {
  const navigate = useNavigate();

  const { state } = useContext(Store);
  const { userInfo } = state;

  const [email, setEmail] = useState({ value: '', isValid: false });

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!email.isValid) {
      return;
    }

    try {
      // await axios.post(`/v1/users/forgot-password?login=${email.value}`, {});

      navigate(`/email-sent?email=${email.value}&type=reset`);
    } catch (error) {
      toast.error(getError(error));
    }
  };

  return (
    <Container className="small-container">
      <Helmet>
        <title>Forget Password</title>
      </Helmet>
      <h1 className="my-3">Forget Password</h1>
      <Form noValidate onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="text"
            required
            isValid={email.isValid}
            isInvalid={!email.isValid}
            onChange={(e) => {
              setEmail({
                value: e.target.value,
                isValid: emailRegexp.test(e.target.value),
              });
            }}
          />
        </Form.Group>
        <div className="mb-3">
          <Button type="submit" disabled={!email.isValid}>
            Submit
          </Button>
        </div>
      </Form>
    </Container>
  );
}
