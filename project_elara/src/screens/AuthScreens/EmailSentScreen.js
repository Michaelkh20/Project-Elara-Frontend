import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link, useLocation } from 'react-router-dom';

// INTEGRATED
function EmailSentScreen() {
  const { search } = useLocation();
  const email = new URLSearchParams(search).get('email');

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md="auto">
          <div class="bg-light p-5 rounded-lg m-3">
            <h1 className="display-4">Подтверждение регистрации</h1>
            <p className="lead">
              Мы отправили письмо с ссылкой для подтверждения регистрации на ваш
              электронный адрес:
            </p>
            <p>
              <strong>{email}</strong>
            </p>
            <hr class="my-4" />
            <p className="lead">
              Пожалуйста, проверьте вашу почту и следуйте инструкциям в письме
              для завершения регистрации.
            </p>
            <Link className="btn btn-primary btn-lg" to="/">
              На главную
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default EmailSentScreen;
