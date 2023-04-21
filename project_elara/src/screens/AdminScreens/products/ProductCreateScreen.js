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

export default function ProductCreateScreen() {
  const navigate = useNavigate();

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const [widget, setWidget] = useState(null);

  const [sports, setSports] = useState([]);
  const [features, setFeatures] = useState([]);
  const [colors, setColors] = useState([]);
  const [brands, setBrands] = useState([]);
  const [countries, setCountries] = useState([]);
  const [sizesUS, setSizesUS] = useState([]);
  const [sizesEUR, setSizesEUR] = useState([]);
  const [sizesUK, setSizesUK] = useState([]);

  const [upc, setUpc] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [brand, setBrand] = useState('');
  const [countryOfOrigin, setCountryOfOrigin] = useState('');
  const [sizeUS, setSizeUS] = useState('');
  const [sizeUK, setSizeUK] = useState('');
  const [sizeEUR, setSizeEUR] = useState('');
  const [selectedSports, setSelectedSports] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [pictures, setPictures] = useState([]);
  const [height, setHeight] = useState('');
  const [width, setWidth] = useState('');
  const [length, setLength] = useState('');
  const [weight, setWeight] = useState('');

  function sportsSelectHandler(e) {
    const selectedSport = sports.find((x) => x.id === Number(e.target.value));
    setSelectedSports((prevSports) =>
      prevSports.some((sport) => sport.id === selectedSport.id)
        ? prevSports
        : [...prevSports, selectedSport]
    );
  }

  function deleteSportHandler(sport) {
    setSelectedSports((prevSports) =>
      prevSports.filter((x) => x.id !== sport.id)
    );
  }

  function featuresSelectHandler(e) {
    const selectedFeature = features.find(
      (x) => x.id === Number(e.target.value)
    );
    setSelectedFeatures((prevFeatures) =>
      prevFeatures.some((feature) => feature.id === selectedFeature.id)
        ? prevFeatures
        : [...prevFeatures, selectedFeature]
    );
  }

  function deleteFeatureHandler(feature) {
    setSelectedFeatures((prevFeatures) =>
      prevFeatures.filter((x) => x.id !== feature.id)
    );
  }

  function colorsSelectHandler(e) {
    const selectedColor = colors.find((x) => x.id === Number(e.target.value));
    setSelectedColors((prevColors) =>
      prevColors.some((color) => color.id === selectedColor.id)
        ? prevColors
        : [...prevColors, selectedColor]
    );
  }

  function deleteColorHandler(color) {
    setSelectedColors((prevColors) =>
      prevColors.filter((x) => x.id !== color.id)
    );
  }

  const deletePictureHandler = (picture) => {
    setPictures((prevPictures) => prevPictures.filter((x) => x !== picture));
  };

  useEffect(() => {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'dzsufehpt',
        uploadPreset: 'upload_profile_photo',
        sources: ['local', 'url', 'camera'],
        multiple: false,
        clientAllowedFormats: 'image',
        cropping: true,
        croppingAspectRatio: 4 / 3,
        showSkipCropButton: false,
      },
      (error, result) => {
        console.log(result);
        if (error) {
          toast.error('Error occured during uploading photo');
          return;
        }
        if (result.event === 'success') {
          setPictures((prevPictures) => [
            ...prevPictures,
            result.info.secure_url,
          ]);
        }
      }
    );

    setWidget(widget);

    return () => {
      widget.destroy().then(() => console.log('Widget was removed'));
    };
  }, []);

  useEffect(() => {
    const fetchSports = async () => {
      const { data } = await axios.get('/api/v1/sports');
      setSports(data);
    };

    const fetchFeatures = async () => {
      const { data } = await axios.get('/api/v1/features');
      setFeatures(data);
    };

    const fetchColors = async () => {
      const { data } = await axios.get('/api/v1/colors');
      setColors(data);
    };

    const fetchBrands = async () => {
      const { data } = await axios.get('/api/v1/products/brands');
      setBrands(data);
    };

    const fetchCountries = async () => {
      const { data } = await axios.get('/api/v1/products/countries');
      setCountries(data);
    };

    const fetchSizesUS = async () => {
      const { data } = await axios.get('/api/v1/products/sizes/us');
      setSizesUS(data);
    };

    const fetchSizesEUR = async () => {
      const { data } = await axios.get('/api/v1/products/sizes/eur');
      setSizesEUR(data);
    };

    const fetchSizesUK = async () => {
      const { data } = await axios.get('/api/v1/products/sizes/uk');
      setSizesUK(data);
    };

    try {
      fetchSports();
      fetchFeatures();
      fetchColors();
      fetchBrands();
      fetchCountries();
      fetchSizesUS();
      fetchSizesEUR();
      fetchSizesUK();
    } catch (error) {
      toast.error(getError(error));
    }
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `/api/v1/admin-console/product`,
        {
          id: null,
          upc,
          name,
          price,
          discount,
          quantity,
          description,
          brand,
          countryOfOrigin,
          sizeUS,
          sizeEUR,
          sizeUK,
          sports: selectedSports,
          colors: selectedColors,
          features: selectedFeatures,
          pictures,
          height,
          width,
          length,
          weight,
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );

      toast.success('Product created successfully');

      navigate('/admin/products');
    } catch (error) {
      toast.error(getError(error));
    }
  };

  return (
    <Container className="small-container">
      <Helmet>
        <title>Create Product</title>
      </Helmet>
      <h1 className="my-3">Create Product</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="upc">
          <Form.Label>UPC</Form.Label>
          <Form.Control
            value={upc}
            required
            onChange={(e) => setUpc(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
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
        <Form.Group className="mb-3" controlId="discount">
          <Form.Label>Discount</Form.Label>
          <Form.Control
            value={discount}
            required
            onChange={(e) => setDiscount(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="quantity">
          <Form.Label>Quantity in stock</Form.Label>
          <Form.Control
            value={quantity}
            required
            onChange={(e) => setQuantity(e.target.value)}
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
        <Form.Group className="mb-3" controlId="brand">
          <Form.Label>Brand</Form.Label>
          <Form.Select
            onChange={(e) => e.target.value && setBrand(e.target.value)}
            required
            value={brand}
          >
            <option key="" value="">
              Select brand
            </option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3" controlId="countryOfOrigin">
          <Form.Label>Country of origin</Form.Label>
          <Form.Select
            onChange={(e) =>
              e.target.value && setCountryOfOrigin(e.target.value)
            }
            required
            value={countryOfOrigin}
          >
            <option key="" value="">
              Country
            </option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Row>
          <Form.Group as={Col} className="mb-3" controlId="sizeUS">
            <Form.Label>Size US</Form.Label>
            <Form.Select
              onChange={(e) => e.target.value && setSizeUS(e.target.value)}
              required
              value={sizeUS}
            >
              <option key="" value="">
                Select US size
              </option>
              {sizesUS.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group as={Col} className="mb-3" controlId="sizeEUR">
            <Form.Label>Size EUR</Form.Label>
            <Form.Select
              onChange={(e) => e.target.value && setSizeEUR(e.target.value)}
              required
              value={sizeEUR}
            >
              <option key="" value="">
                Select EUR size
              </option>
              {sizesEUR.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group as={Col} className="mb-3" controlId="sizeUK">
            <Form.Label>Size UK</Form.Label>
            <Form.Select
              onChange={(e) => e.target.value && setSizeUK(e.target.value)}
              required
              value={sizeUK}
            >
              <option key="" value="">
                Select UK size
              </option>
              {sizesUK.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Row>
        <Form.Group className="mb-3" controlId="sports">
          <Form.Label>Sports</Form.Label>
          {selectedSports.length === 0 && <MessageBox>No sports</MessageBox>}
          <div className="badges-container mb-1">
            {selectedSports.map((x) => (
              <Badge bg="primary" className="me-2 mb-1">
                {x.name}
                <Button
                  className="btn-delete"
                  variant="light"
                  onClick={() => deleteSportHandler(x)}
                >
                  <i className="far fa-times-circle fa-sm"></i>
                </Button>
              </Badge>
            ))}
          </div>
          <Form.Select onChange={sportsSelectHandler}>
            <option key="" value="">
              Select sports
            </option>
            {sports.map((sport) => (
              <option key={sport.id} value={sport.id}>
                {sport.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3" controlId="colors">
          <Form.Label>Colors</Form.Label>
          {selectedColors.length === 0 && <MessageBox>No colors</MessageBox>}
          <div className="badges-container mb-1">
            {selectedColors.map((x, index) => {
              const customBadgeClass = `custom-badge-${index}`;
              return (
                <>
                  <style type="text/css">
                    {`
                .${customBadgeClass} {
                  background-color: ${x.hex} !important;
                }
              `}
                  </style>
                  <Badge
                    className={`me-2 mb-1 ${customBadgeClass}`}
                    style={{ backgroundColor: `${x.hex} !important` }}
                  >
                    {x.name}
                    <Button
                      className="btn-delete"
                      variant="light"
                      onClick={() => deleteColorHandler(x)}
                    >
                      <i className="far fa-times-circle fa-sm"></i>
                    </Button>
                  </Badge>
                </>
              );
            })}
          </div>
          <Form.Select onChange={colorsSelectHandler}>
            <option key="" value="">
              Select colors
            </option>
            {colors.map((color) => (
              <option key={color.id} value={color.id}>
                {color.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3" controlId="features">
          <Form.Label>Features</Form.Label>
          {selectedFeatures.length === 0 && <MessageBox>No feature</MessageBox>}
          <div className="badges-container mb-1">
            {selectedFeatures.map((x) => (
              <Badge bg="primary" className="me-2 mb-1">
                {x.name}
                <Button
                  className="btn-delete"
                  variant="light"
                  onClick={() => deleteFeatureHandler(x)}
                >
                  <i className="far fa-times-circle fa-sm"></i>
                </Button>
              </Badge>
            ))}
          </div>
          <Form.Select onChange={featuresSelectHandler}>
            <option key="" value="">
              Select features
            </option>
            {features.map((feature) => (
              <option key={feature.id} value={feature.id}>
                {feature.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3" controlId="pictures">
          <Form.Label>Pictures</Form.Label>
          {pictures.length === 0 && <MessageBox>No picture</MessageBox>}
          <div className="badges-container mb-1">
            {pictures.map((img) => (
              <Badge bg="secondary" className="me-2 mb-1">
                <img className="form-product-image" src={img} alt="product" />

                <Button
                  className="btn-delete"
                  variant="light"
                  onClick={() => deletePictureHandler(img)}
                >
                  <i className="far fa-times-circle fa-sm"></i>
                </Button>
              </Badge>
            ))}
          </div>
          <Form.Control
            type="button"
            className="btn btn-outline-info"
            value="Upload Photo"
            onClick={() => widget.open()}
          />
        </Form.Group>
        <Row>
          <Form.Group as={Col} className="mb-3" controlId="height">
            <Form.Label>Height</Form.Label>
            <Form.Control
              value={height}
              required
              onChange={(e) => setHeight(e.target.value)}
            />
          </Form.Group>
          <Form.Group as={Col} className="mb-3" controlId="width">
            <Form.Label>Width</Form.Label>
            <Form.Control
              value={width}
              required
              onChange={(e) => setWidth(e.target.value)}
            />
          </Form.Group>
        </Row>
        <Row>
          <Form.Group as={Col} className="mb-3" controlId="length">
            <Form.Label>Length</Form.Label>
            <Form.Control
              value={length}
              required
              onChange={(e) => setLength(e.target.value)}
            />
          </Form.Group>
          <Form.Group as={Col} className="mb-3" controlId="weight">
            <Form.Label>Weight</Form.Label>
            <Form.Control
              value={weight}
              required
              onChange={(e) => setWeight(e.target.value)}
            />
          </Form.Group>
        </Row>
        <div className="mb-3">
          <Button type="submit">Create</Button>
        </div>
      </Form>
    </Container>
  );
}
