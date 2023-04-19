import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { Helmet } from 'react-helmet-async';
import Button from 'react-bootstrap/Button';
import { useContext, useEffect, useReducer, useState } from 'react';
import { Store } from '../../Store';
import { toast } from 'react-toastify';
import { emailRegexp, getError, passwordRegexp } from '../../utils';
import MessageBox from '../../components/MessageBox';

//INTEGRATED

const reducer = (state, action) => {
  let newState;
  switch (action.type) {
    case 'PASSWORD_UPDATE':
      {
        const password = {
          value: action.payload,
          isValid: action.payload.length >= 6,
        };
        const confirmPassword = {
          ...state.reqFields.confirmPassword,
          isValid: password.value === state.reqFields.confirmPassword.value,
        };

        newState = {
          ...state,
          reqFields: { ...state.reqFields, password, confirmPassword },
        };
      }
      break;
    case 'CONFIRM_PASSWORD_UPDATE':
      {
        const confirmPassword = {
          value: action.payload,
          isValid: state.reqFields.password.value === action.payload,
        };

        newState = {
          ...state,
          reqFields: { ...state.reqFields, confirmPassword },
        };
      }
      break;
    case 'EMAIL_UPDATE':
      newState = {
        ...state,
        reqFields: {
          ...state.reqFields,
          email: {
            value: action.payload,
            isValid: emailRegexp.test(action.payload),
          },
        },
        isEmailRegistered: false,
      };
      break;
    case 'FIRSTNAME_UPDATE':
      newState = {
        ...state,
        reqFields: {
          ...state.reqFields,
          firstName: { value: action.payload, isValid: !!action.payload },
        },
      };
      break;
    case 'LASTNAME_UPDATE':
      newState = {
        ...state,
        reqFields: {
          ...state.reqFields,
          lastName: { value: action.payload, isValid: !!action.payload },
        },
      };
      break;
    case 'BIRTHDATE_UPDATE':
      newState = {
        ...state,
        reqFields: {
          ...state.reqFields,
          birthDate: { value: action.payload, isValid: !!action.payload },
        },
      };
      break;
    case 'PHOTO_UPDATE':
      newState = {
        ...state,
        pictureUrl: { value: action.payload, isValid: !!action.payload },
      };
      break;
    case 'ISEMAILREGISTRED_UPDATE':
      newState = { ...state, isEmailRegistered: action.payload };
      break;
    default:
      newState = state;
  }

  const isFormValid =
    Object.values(newState.reqFields)
      .map((field) => field.isValid)
      .reduce((acc, x) => acc && x, true) && !newState.isEmailRegistered;
  return { ...newState, isFormValid };
};

export default function SignupScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirect = new URLSearchParams(search).get('redirect') || '/';

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const [widget, setWidget] = useState(null);

  const [
    {
      reqFields: {
        email,
        firstName,
        lastName,
        birthDate,
        password,
        confirmPassword,
      },
      pictureUrl,
      isEmailRegistered,
      isFormValid,
    },
    dispatch,
  ] = useReducer(reducer, {
    reqFields: {
      email: { value: '', isValid: false },
      firstName: { value: '', isValid: false },
      lastName: { value: '', isValid: false },
      birthDate: { value: '', isValid: false },
      password: { value: '', isValid: false },
      confirmPassword: { value: '', isValid: false },
    },
    pictureUrl: { value: '', isValid: false },
    isEmailRegistered: false,
    isFormValid: false,
  });

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  useEffect(() => {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'dzsufehpt',
        uploadPreset: 'upload_profile_photo',
        sources: ['local', 'url', 'camera'],
        multiple: false,
        clientAllowedFormats: 'image',
        cropping: true,
        croppingAspectRatio: 1,
        showSkipCropButton: false,
      },
      (error, result) => {
        console.log(result);
        if (error) {
          toast.error('Error occured during uploading photo');
          return;
        }
        if (result.event === 'success') {
          dispatch({ type: 'PHOTO_UPDATE', payload: result.info.secure_url });
        }
      }
    );

    setWidget(widget);

    return () => {
      widget.destroy().then(() => console.log('Widget was removed'));
    };
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const { status } = await axios.get(
        `/api/v1/users/login-available?login=${email.value}`,
        {
          validateStatus: function (status) {
            return status === 200 || status === 409;
          },
        }
      );

      if (status === 409) {
        dispatch({ type: 'ISEMAILREGISTRED_UPDATE', payload: true });
        return;
      } else {
        dispatch({ type: 'ISEMAILREGISTRED_UPDATE', payload: false });
      }
    } catch (error) {
      toast.error(getError(error));
      return;
    }

    if (!isFormValid) {
      console.log('Data is invalid');
      return;
    }

    console.log('All data is valid');

    try {
      await axios.post('/api/v1/users', {
        login: email.value,
        password: password.value,
        firstName: firstName.value,
        lastName: lastName.value,
        pictureUrl: pictureUrl.value,
        birthDate: birthDate.value,
      });

      navigate(`/email-sent?email=${email.value}&type=reg`);
    } catch (error) {
      toast.error(getError(error));
    }
  };

  return (
    <Container className="small-container">
      <Helmet>
        <title>Sign Up</title>
      </Helmet>
      <h1 className="my-3">Sign Up</h1>
      <Form noValidate onSubmit={submitHandler}>
        {pictureUrl.value && (
          <img className="mb-3 profile-img" src={pictureUrl.value} alt="" />
        )}
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="text"
            value={email.value}
            required
            isValid={email.isValid && !isEmailRegistered}
            isInvalid={!email.isValid || isEmailRegistered}
            onChange={(e) => {
              dispatch({ type: 'EMAIL_UPDATE', payload: e.target.value });
            }}
          />
          {isEmailRegistered && (
            <Form.Control.Feedback type="invalid">
              This email is already registered
            </Form.Control.Feedback>
          )}
          {!email.isValid && (
            <Form.Control.Feedback type="invalid">
              This is not email
            </Form.Control.Feedback>
          )}
        </Form.Group>
        <Form.Group className="mb-3" controlId="firstName">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            required
            value={firstName.value}
            isValid={firstName.isValid}
            isInvalid={!firstName.isValid}
            onChange={(e) =>
              dispatch({ type: 'FIRSTNAME_UPDATE', payload: e.target.value })
            }
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="lastName">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            required
            value={lastName.value}
            isValid={lastName.isValid}
            isInvalid={!lastName.isValid}
            onChange={(e) =>
              dispatch({ type: 'LASTNAME_UPDATE', payload: e.target.value })
            }
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="imageFile">
          <Form.Label>Your photo</Form.Label>
          <Form.Control
            type="button"
            className="btn btn-outline-info"
            value="Upload Photo"
            isValid={pictureUrl.isValid}
            onClick={() => widget.open()}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="bithDate">
          <Form.Label>Birth Date</Form.Label>
          <Form.Control
            type="date"
            required
            value={birthDate.value}
            isValid={birthDate.isValid}
            isInvalid={!birthDate.isValid}
            onChange={(e) =>
              dispatch({ type: 'BIRTHDATE_UPDATE', payload: e.target.value })
            }
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            required
            value={password.value}
            isValid={password.isValid}
            isInvalid={!password.isValid}
            onChange={(e) => {
              dispatch({ type: 'PASSWORD_UPDATE', payload: e.target.value });
            }}
          />
          <Form.Control.Feedback type="invalid">
            Password should has minimum 6 characters
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            required
            value={confirmPassword.value}
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
            Sign Up
          </Button>
        </div>
        <div className="mb-3">
          Already have an account?{' '}
          <Link to={`/signin?redirect=${redirect}`}>Sign-In</Link>
        </div>
      </Form>
    </Container>
  );
}
