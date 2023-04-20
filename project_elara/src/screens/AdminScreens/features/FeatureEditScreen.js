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

export default function FeatureEditScreen() {
  const navigate = useNavigate();
  const params = useParams();
  const { id: featureId } = params;

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/v1/features/${featureId}`);

        setName(data.name);
        setDescription(data.description);
      } catch (error) {
        toast.error(getError(error));
      }
    };

    fetchProduct();
  }, [featureId]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `/api/v1/admin-console/feature`,
        {
          id: featureId,
          name,
          description,
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );

      toast.success('Feature updated successfully');

      navigate('/admin/features');
    } catch (error) {
      toast.error(getError(error));
    }
  };

  return (
    <Container className="small-container">
      <Helmet>
        <title>Edit Feature</title>
      </Helmet>
      <h1 className="my-3">Edit Feature</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            value={description}
            required
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>
        <div className="mb-3">
          <Button type="submit">Update</Button>
        </div>
      </Form>
    </Container>
  );
}
