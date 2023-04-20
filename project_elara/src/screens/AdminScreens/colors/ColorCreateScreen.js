import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Store } from '../../../Store';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import { getError } from '../../../utils';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';

export default function ColorCreateScreen() {
  const navigate = useNavigate();

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const [name, setName] = useState('');
  const [hex, setHex] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `/api/v1/admin-console/color`,
        {
          id: null,
          name,
          hex,
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );

      toast.success('Color created successfully');

      navigate('/admin/colors');
    } catch (error) {
      toast.error(getError(error));
    }
  };

  return (
    <Container className="small-container">
      <Helmet>
        <title>Create Color</title>
      </Helmet>
      <h1 className="my-3">Create Color</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Color</Form.Label>
          <Form.Control
            type="color"
            value={hex}
            required
            onChange={(e) => setHex(e.target.value)}
          />
        </Form.Group>
        <div className="mb-3">
          <Button type="submit">Create</Button>
        </div>
      </Form>
    </Container>
  );
}
