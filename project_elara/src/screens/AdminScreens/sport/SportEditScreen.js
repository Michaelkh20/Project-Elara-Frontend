import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Store } from '../../../Store';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import { getError } from '../../../utils';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import LoadingBox from '../../../components/LoadingBox';
import MessageBox from '../../../components/MessageBox';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';

export default function SportEditScreen() {
  const navigate = useNavigate();
  const params = useParams();
  const { id: sportId } = params;

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const [name, setName] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/v1/sports/${sportId}`);
        setName(data.name);
      } catch (error) {
        toast.error(getError(error));
      }
    };

    fetchProduct();
  }, [sportId]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `/api/v1/admin-console/sport`,
        {
          id: sportId,
          name,
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );

      toast.success('Sport updated successfully');

      navigate('/admin/sports');
    } catch (error) {
      toast.error(getError(error));
    }
  };

  return (
    <Container className="small-container">
      <Helmet>
        <title>Edit Sport</title>
      </Helmet>
      <h1 className="my-3">Edit Sport</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>
        <div className="mb-3">
          <Button type="submit">Update</Button>
        </div>
      </Form>
    </Container>
  );
}
