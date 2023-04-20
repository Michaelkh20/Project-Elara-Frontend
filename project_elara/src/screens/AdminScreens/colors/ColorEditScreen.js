import React, { useContext, useEffect, useState } from 'react';
import { Store } from '../../../Store';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import { getError } from '../../../utils';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';

export default function ColorEditScreen() {
  const navigate = useNavigate();
  const params = useParams();
  const { id: colorId } = params;

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const [name, setName] = useState('');
  const [hex, setHex] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/v1/colors/${colorId}`);

        setName(data.name);
        setHex(data.hex);
      } catch (error) {
        toast.error(getError(error));
      }
    };

    fetchProduct();
  }, [colorId]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `/api/v1/admin-console/color`,
        {
          id: colorId,
          name,
          hex,
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );

      toast.success('Color updated successfully');

      navigate('/admin/colors');
    } catch (error) {
      toast.error(getError(error));
    }
  };

  return (
    <Container className="small-container">
      <Helmet>
        <title>Edit Color</title>
      </Helmet>
      <h1 className="my-3">Edit Color</h1>
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
          <Button type="submit">Update</Button>
        </div>
      </Form>
    </Container>
  );
}
