import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link, useLocation } from 'react-router-dom';

// INTEGRATED
function EmailSentScreen() {
  const { search } = useLocation();
  const email = new URLSearchParams(search).get('email');
  const type = new URLSearchParams(search).get('type');

  function getHeader(type) {
    switch (type) {
      case 'reg':
        return 'Подтверждение регистрации';
      case 'chngemail':
        return 'Подтверждение смены электронного адреса';
      case 'resetpswd':
        return 'Смена пароля';
      default:
        return 'Некорректный запрос';
    }
  }

  function getText1(type) {
    let text = 'Мы отправили письмо с ссылкой для ';
    switch (type) {
      case 'reg':
        text += 'подтверждения регистрации';
        break;
      case 'chngemail':
        text += 'подтверждения смены электронного адреса';
        break;
      case 'resetpswd':
        text += 'смены пароля';
        break;
      default:
        return 'Некорректный запрос';
    }
    text += ' на ваш электронный адрес:';
    return text;
  }

  function getText2(type) {
    let text =
      'Пожалуйста, проверьте вашу почту и следуйте инструкциям в письме для завершения ';
    switch (type) {
      case 'reg':
        text += 'регистрации';
        break;
      case 'chngemail':
        text += 'смены электронного адреса';
        break;
      case 'resetpswd':
        text += 'смены пароля';
        break;
      default:
        return 'Некорректный запрос';
    }
    return text;
  }

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md="auto">
          <div className="bg-light p-5 rounded-lg m-3">
            <h1 className="display-4">{getHeader(type)}</h1>
            <p className="lead">{getText1(type)}</p>
            <p>
              <strong>{email}</strong>
            </p>
            <hr className="my-4" />
            <p className="lead">{getText2(type)}</p>
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
