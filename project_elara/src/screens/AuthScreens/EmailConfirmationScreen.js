import React, { useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getError } from '../../utils';
import LoadingButton from '../../components/LoadingButton';

// INTEGRATED
function EmailConfirmationScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const token = new URLSearchParams(search).get('token');

  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  });

  const handleConfirmEmail = async () => {
    // try {
    //   await axios.get(`/v1/users/verify-email?token=${token}`);

    //   toast.success('You have successfully confirmed your email');
    // } catch (error) {
    //   toast.error(getError(error));
    //   return;
    // }

    // MOCK
    await new Promise((resolve) => setTimeout(resolve, 2000));
    toast.success('You have successfully confirmed your email');

    navigate('/signin');
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md="auto">
          <div class="bg-light p-5 rounded-lg m-3">
            <h1 className="display-4">Подтверждение Email</h1>
            <p className="lead">Спасибо за регистрацию!</p>
            <hr class="my-4" />
            <p className="lead">
              Для завершения процесса регистрации и подтверждения вашего адреса
              электронной почты, пожалуйста, нажмите на кнопку ниже.
            </p>
            <LoadingButton
              variant="success"
              size="lg"
              onClick={handleConfirmEmail}
            >
              Подтвердить Email
            </LoadingButton>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default EmailConfirmationScreen;
