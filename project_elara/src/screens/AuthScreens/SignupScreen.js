import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { Helmet } from 'react-helmet-async';
import Button from 'react-bootstrap/Button';
import { useContext, useEffect, useReducer, useState } from 'react';
import { Store } from '../../Store';
import { toast } from 'react-toastify';
import { getError } from '../../utils';
import MessageBox from '../../components/MessageBox';

// INTEGRATED
export default function SignupScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirect = new URLSearchParams(search).get('redirect') || '/';

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const [widget, setWidget] = useState(null);
  const [isEmailRegistered, setIsEmailRegistered] = useState(false);

  const [email, setEmail] = useState({ value: '', isValid: false });
  const [password, setPassword] = useState({ value: '', isValid: false });
  const [confirmPassword, setConfirmPassword] = useState({
    value: '',
    isValid: false,
  });
  const [firstName, setFirstName] = useState({ value: '', isValid: false });
  const [lastName, setLastName] = useState({ value: '', isValid: false });
  const [pictureUrl, setPictureUrl] = useState({ value: '', isValid: false });
  const [birthDate, setBirthDate] = useState({ value: '', isValid: false });

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
          console.log(result.info.secure_url);
          setPictureUrl({
            value: result.info.secure_url,
            isValid: !!result.info.secure_url,
          });
        }
      }
    );
    console.log(widget);

    setWidget(widget);

    return () => {
      widget.destroy().then(() => console.log('Widget was removed'));
    };
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();

    // try {
    //   const { status } = await axios.get(
    //     `/v1/users/login-available?login=${email.value}`,
    //     {
    //       validateStatus: function (status) {
    //         return status === 200 || status === 409; // Resolve only if the status code is less than 500
    //       },
    //     }
    //   );

    //   if (status === 409) {
    //     setIsEmailRegistered(true);
    //     return;
    //   } else {
    //     setIsEmailRegistered(false);
    //   }
    // } catch (error) {
    //   toast.error(getError(error));
    //   return;
    // }

    const isDataValid = [
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      birthDate,
    ]
      .map((x) => x.isValid)
      .reduce((acc, x) => acc && x, true);

    if (!isDataValid) {
      // console.log('Data is invalid');
      return;
    }

    // console.log('All data is valid');

    // try {
    //   await axios.post('/v1/users', {
    //     login: email,
    //     password,
    //     firstName,
    //     lastName,
    //     pictureUrl,
    //     birthDate,
    //   });

    //   toast.success('You have successfully registered');
    //   navigate(`/email-sent?email=${email}`);
    // } catch (error) {
    //   toast.error(getError(error));
    // }

    navigate(`/email-sent?email=${email.value}`);

    // setIsEmailRegistered(true);
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
            required
            isValid={email.isValid && !isEmailRegistered}
            isInvalid={!email.isValid || isEmailRegistered}
            onChange={(e) => {
              setEmail({
                value: e.target.value,
                isValid: e.target.value.match(
                  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                ),
              });
              setIsEmailRegistered(false);
            }}
          />
          {/* MOCK */}
          {!isEmailRegistered && (
            <Button onClick={() => setIsEmailRegistered(true)}>
              Email invalid
            </Button>
          )}
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
            isValid={firstName.isValid}
            isInvalid={!firstName.isValid}
            onChange={(e) =>
              setFirstName({ value: e.target.value, isValid: !!e.target.value })
            }
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="lastName">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            required
            isValid={lastName.isValid}
            isInvalid={!lastName.isValid}
            onChange={(e) =>
              setLastName({ value: e.target.value, isValid: !!e.target.value })
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
            isValid={birthDate.isValid}
            isInvalid={!birthDate.isValid}
            onChange={(e) =>
              setBirthDate({ value: e.target.value, isValid: !!e.target.value })
            }
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            required
            isValid={password.isValid}
            isInvalid={!password.isValid}
            onChange={(e) => {
              setPassword({
                value: e.target.value,
                isValid: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(
                  e.target.value
                ),
              });
              setConfirmPassword({
                ...confirmPassword,
                isValid: password.value === confirmPassword.value,
              });
            }}
          />
          <Form.Control.Feedback type="invalid">
            Password should has minimum 8 characters, at least one uppercase
            letter, one lowercase letter and one number
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            required
            isValid={
              password.value !== '' && password.value === confirmPassword.value
            }
            isInvalid={password.value !== confirmPassword.value}
            onChange={(e) =>
              setConfirmPassword({
                value: e.target.value,
                isValid: password.value === e.target.value,
              })
            }
          />
          <Form.Control.Feedback type="invalid">
            Passwords do not match
          </Form.Control.Feedback>
        </Form.Group>
        <div className="mb-3">
          <Button type="submit">Sign Up</Button>
        </div>
        <div className="mb-3">
          Already have an account?{' '}
          <Link to={`/signin?redirect=${redirect}`}>Sign-In</Link>
        </div>
      </Form>
    </Container>
  );
}
