import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Store } from '../Store';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };
    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true, errorUpload: '' };
    case 'UPLOAD_SUCCESS':
      return { ...state, loadingUpload: false, errorUpload: '' };
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload };
    default:
      return state;
  }
};

export default function ProductEditScreen() {
  const navigate = useNavigate();

  const params = useParams();
  const { id: productId } = params;

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');

  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: false,
      error: '',
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/products/${productId}`);

        setName(data.name);
        setSlug(data.slug);
        setPrice(data.price);
        setImage(data.image);
        setImages(data.images);
        setCategory(data.category);
        setCountInStock(data.countInStock);
        setBrand(data.brand);
        setDescription(data.description);

        dispatch({ type: 'FETCH_SUCCESS' });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
      }
    };

    fetchData();
  }, [productId]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      dispatch({ type: 'UPDATE_REQUEST' });

      await axios.put(
        `/api/products/${productId}`,
        {
          _id: productId,
          name,
          slug,
          price,
          image,
          images,
          category,
          countInStock,
          brand,
          description,
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );

      dispatch({ type: 'UPDATE_SUCCESS' });
      toast.success('Product updated successfully');
      navigate('/admin/products');
    } catch (error) {
      dispatch({ type: 'UPDATE_FAIL' });
      toast.error(getError(error));
    }
  };

  const uploadFileHandler = async (e, forImages) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    try {
      dispatch({ type: 'UPLOAD_REQUEST' });

      const { data } = await axios.post('/api/upload', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${userInfo.token}`,
        },
      });

      dispatch({ type: 'UPLOAD_SUCCESS' });
      if (forImages) {
        setImages([...images, data.secure_url]);
      } else {
        setImage(data.secure_url);
      }
      toast.success('Image uploaded successfully. Click Update to apply it');
    } catch (error) {
      dispatch({ type: 'UPLOAD_FAIL' });
      toast.error(getError(error));
    }
  };

  const deleteFileHandler = async (fileName) => {
    setImages(images.filter((x) => x !== fileName));
    toast.success('Image removed successfully. Click Update to apply it');
  };

  return (
    <Container className="small-container">
      <Helmet>
        <title>Edit Product {productId}</title>
      </Helmet>
      <h1 className="my-3">Edit Product {productId}</h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="slug">
            <Form.Label>Slug</Form.Label>
            <Form.Control
              value={slug}
              required
              onChange={(e) => setSlug(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="price">
            <Form.Label>Price</Form.Label>
            <Form.Control
              value={price}
              required
              onChange={(e) => setPrice(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="image">
            <Form.Label>Image</Form.Label>
            <Form.Control
              value={image}
              required
              onChange={(e) => setImage(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="imageFile">
            <Form.Label>Upload Image</Form.Label>
            <Form.Control type="file" onChange={uploadFileHandler} />
            {loadingUpload && <LoadingBox />}
          </Form.Group>
          <Form.Group className="mb-3" controlId="additionalImage">
            <Form.Label>Additional Image</Form.Label>
            {images.length === 0 && <MessageBox>No image</MessageBox>}
            <ListGroup variant="flush">
              {images.map((x) => (
                <ListGroup.Item key={x}>
                  {x}
                  <Button variant="light" onClick={() => deleteFileHandler(x)}>
                    <i className="fa fa-times-circle" />
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Form.Group>
          <Form.Group className="mb-3" controlId="additionalImageFile">
            <Form.Label>Upload Aditional Images</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => uploadFileHandler(e, true)}
            />
            {loadingUpload && <LoadingBox />}
          </Form.Group>
          <Form.Group className="mb-3" controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Control
              value={category}
              required
              onChange={(e) => setCategory(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="brand">
            <Form.Label>Brand</Form.Label>
            <Form.Control
              value={brand}
              required
              onChange={(e) => setBrand(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="countInStock">
            <Form.Label>Count In Stock</Form.Label>
            <Form.Control
              value={countInStock}
              required
              onChange={(e) => setCountInStock(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              value={description}
              required
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
          <div className="mb-3">
            <Button disabled={loadingUpdate} type="submit">
              Update
            </Button>
            {loadingUpdate && <LoadingBox />}
          </div>
        </Form>
      )}
    </Container>
  );
}
