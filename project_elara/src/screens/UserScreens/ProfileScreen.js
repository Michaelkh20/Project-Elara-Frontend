import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Helmet } from 'react-helmet-async';
import Button from 'react-bootstrap/Button';
import { useContext, useEffect, useReducer, useState } from 'react';
import { Store } from '../../Store';
import { toast } from 'react-toastify';
import { emailRegexp, getError, passwordRegexp } from '../../utils';
import MessageBox from '../../components/MessageBox';

//INTEGRATED

const reducer0 = (state, action) => {
  let newState;
  switch (action.type) {
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

  const isForm0Valid =
    Object.values(newState.reqFields)
      .map((field) => field.isValid)
      .reduce((acc, x) => acc && x, true) && !newState.isEmailRegistered;
  return { ...newState, isForm0Valid };
};

const reducer1 = (state, action) => {
  switch (action.type) {
    case 'OLDPASSWORD_UPDATE': {
      const oldPassword = {
        value: action.payload,
        isValid: action.payload.length >= 6,
      };
      const isForm1Valid =
        oldPassword.isValid &&
        state.newPassword.isValid &&
        state.confirmNewPassword.isValid;
      return { ...state, oldPassword, isForm1Valid };
    }
    case 'NEWPASSWORD_UPDATE': {
      const newPassword = {
        value: action.payload,
        isValid: action.payload.length >= 6,
      };
      const confirmNewPassword = {
        ...state.confirmNewPassword,
        isValid: newPassword.value === state.confirmNewPassword.value,
      };
      const isForm1Valid =
        state.oldPassword.isValid &&
        newPassword.isValid &&
        confirmNewPassword.isValid;
      return { ...state, newPassword, confirmNewPassword, isForm1Valid };
    }
    case 'CONFIRM_NEWPASSWORD_UPDATE':
      const confirmNewPassword = {
        value: action.payload,
        isValid: state.newPassword.value === action.payload,
      };
      const isForm1Valid =
        state.oldPassword.isValid &&
        state.newPassword.isValid &&
        confirmNewPassword.isValid;
      return { ...state, confirmNewPassword, isForm1Valid };
    default:
      return state;
  }
};

export default function ProfileScreen() {
  const navigate = useNavigate();

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const [widget, setWidget] = useState(null);

  const [
    {
      reqFields: { email, firstName, lastName, birthDate },
      pictureUrl,
      isEmailRegistered,
      isForm0Valid,
    },
    dispatch0,
  ] = useReducer(reducer0, {
    reqFields: {
      email: { value: userInfo.email, isValid: false },
      firstName: { value: userInfo.firstName, isValid: false },
      lastName: { value: userInfo.lastName, isValid: false },
      birthDate: { value: userInfo.birthDate, isValid: false },
    },
    pictureUrl: { value: userInfo.pictureUrl, isValid: true },
    isEmailRegistered: true,
    isForm0Valid: false,
  });

  const [
    { oldPassword, newPassword, confirmNewPassword, isForm1Valid },
    dispatch1,
  ] = useReducer(reducer1, {
    oldPassword: { value: '', isValid: false },
    newPassword: { value: '', isValid: false },
    confirmNewPassword: { value: '', isValid: false },
    isForm1Valid: false,
  });

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
          dispatch0({ type: 'PHOTO_UPDATE', payload: result.info.secure_url });
        }
      }
    );

    setWidget(widget);

    return () => {
      widget.destroy().then(() => console.log('Widget was removed'));
    };
  }, []);

  const submitHandler0 = async (e) => {
    e.preventDefault();

    if (email.value !== userInfo.email) {
      try {
        const { status } = await axios.get(
          `/api/v1/users/login-available?login=${email.value}`,
          {
            validateStatus: function (status) {
              return status === 200 || status === 409; // Resolve only if the status code is less than 500
            },
          }
        );

        if (status === 409) {
          dispatch0({ type: 'ISEMAILREGISTRED_UPDATE', payload: true });
          return;
        } else {
          dispatch0({ type: 'ISEMAILREGISTRED_UPDATE', payload: false });
        }
      } catch (error) {
        toast.error(getError(error));
        return;
      }
    }

    if (!isForm0Valid) {
      console.log('Data is invalid');
      return;
    }

    console.log('All data is valid');

    try {
      const { data } = await axios.put(
        '/api/v1/users',
        {
          userId: userInfo.id,
          email: email.value,
          firstName: firstName.value,
          lastName: lastName.value,
          pictureUrl: pictureUrl.value,
          birthDate: birthDate.value,
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );

      if (data.user.email !== userInfo.email) {
        ctxDispatch({ type: 'USER_SIGNOUT' });
        navigate(`/email-sent?email=${data.user.email}&type=chngemail`);
        return;
      }

      ctxDispatch({
        type: 'USER_SIGNIN',
        payload: { ...data.user, token: data.token },
      });

      toast.success('User updated successfully');
    } catch (error) {
      toast.error(getError(error));
    }
  };

  const submitHandler1 = async (e) => {
    e.preventDefault();

    if (!isForm1Valid) {
      console.log('Data is invalid');
      return;
    }

    console.log('All data is valid');

    try {
      await axios.put(
        '/api/v1/users/change-password',
        {
          userId: userInfo.id,
          oldPassword,
          newPassword,
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );

      toast.success('Password updated successfully');
    } catch (error) {
      toast.error(getError(error));
    }
  };

  const deleteHandler = async () => {
    if (!window.confirm('Are you sure you want to delete your account?')) {
      return;
    }

    try {
      await axios.delete(`/api/v1/users/${userInfo.id}`, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });

      ctxDispatch({ type: 'USER_SIGNOUT' });
      navigate('/signin');
    } catch (error) {
      toast.error(getError(error));
    }
  };

  return (
    <Container className="small-container">
      <Helmet>
        <title>User Profile</title>
      </Helmet>
      <Row>
        <Col>
          <h1 className="my-3">User Profile</h1>
        </Col>
        <Col className="col text-end">
          <div>
            <Button type="button" variant="danger" onClick={deleteHandler}>
              Delete account
            </Button>
          </div>
        </Col>
      </Row>
      <Form noValidate onSubmit={submitHandler0}>
        {pictureUrl.value && (
          <img className="mb-3 profile-img" src={pictureUrl.value} alt="" />
        )}
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            value={email.value}
            type="text"
            required
            isValid={email.isValid && !isEmailRegistered}
            isInvalid={!email.isValid || isEmailRegistered}
            onChange={(e) => {
              dispatch0({ type: 'EMAIL_UPDATE', payload: e.target.value });
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
            value={firstName.value}
            required
            isValid={firstName.isValid}
            isInvalid={!firstName.isValid}
            onChange={(e) =>
              dispatch0({ type: 'FIRSTNAME_UPDATE', payload: e.target.value })
            }
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="lastName">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            value={lastName.value}
            required
            isValid={lastName.isValid}
            isInvalid={!lastName.isValid}
            onChange={(e) =>
              dispatch0({ type: 'LASTNAME_UPDATE', payload: e.target.value })
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
            value={birthDate.value}
            type="date"
            required
            isValid={birthDate.isValid}
            isInvalid={!birthDate.isValid}
            onChange={(e) =>
              dispatch0({ type: 'BIRTHDATE_UPDATE', payload: e.target.value })
            }
          />
        </Form.Group>
        <div className="mb-3">
          <Button type="submit" disabled={!isForm0Valid}>
            Sign Up
          </Button>
        </div>
      </Form>
      <h3 className="my-3">Change Password</h3>
      <Form noValidate onSubmit={submitHandler1}>
        <Form.Group className="mb-3" controlId="oldPassword">
          <Form.Label>Old Password</Form.Label>
          <Form.Control
            type="password"
            value={oldPassword.value}
            required
            isValid={oldPassword.isValid}
            isInvalid={!oldPassword.isValid}
            onChange={(e) => {
              dispatch1({
                type: 'OLDPASSWORD_UPDATE',
                payload: e.target.value,
              });
            }}
          />
          <Form.Control.Feedback type="invalid">
            Password should has minimum 6 characters
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="newPassword">
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type="password"
            value={newPassword.value}
            required
            isValid={newPassword.isValid}
            isInvalid={!newPassword.isValid}
            onChange={(e) => {
              dispatch1({
                type: 'NEWPASSWORD_UPDATE',
                payload: e.target.value,
              });
            }}
          />
          <Form.Control.Feedback type="invalid">
            Password should has minimum 6 characters
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="confirmNewPassword">
          <Form.Label>Confirm New Password</Form.Label>
          <Form.Control
            type="password"
            value={confirmNewPassword.value}
            required
            isValid={newPassword.value !== '' && confirmNewPassword.isValid}
            isInvalid={!confirmNewPassword.isValid}
            onChange={(e) =>
              dispatch1({
                type: 'CONFIRM_NEWPASSWORD_UPDATE',
                payload: e.target.value,
              })
            }
          />
          <Form.Control.Feedback type="invalid">
            Passwords do not match
          </Form.Control.Feedback>
        </Form.Group>
        <div className="mb-3">
          <Button type="submit" disabled={!isForm1Valid}>
            Update
          </Button>
        </div>
      </Form>
    </Container>
  );
}
