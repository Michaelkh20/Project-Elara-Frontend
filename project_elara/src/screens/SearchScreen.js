import React, { useEffect, useReducer, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getError } from '../utils';
import axios from 'axios';
import { toast } from 'react-toastify';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Rating from '../components/Rating.js';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import Product from '../components/Product.js';
import { LinkContainer } from 'react-router-bootstrap';
import Badge from 'react-bootstrap/Badge';
import Pagination from 'react-bootstrap/Pagination';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        products: action.payload.products.content,
        page: action.payload.products.pageable.pageNumber + 1,
        totalPages: action.payload.products.totalPages,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const pageSize = 10;

export default function SearchScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();

  const sp = new URLSearchParams(search);
  const query = sp.get('query');

  const [sports, setSports] = useState([]);
  const [colors, setColors] = useState([]);
  const [features, setFeatures] = useState([]);
  const [countriesOfOrigin, setCountriesOfOrigin] = useState([]);
  const [brands, setBrands] = useState([]);
  const [sizesUS, setSizesUS] = useState([]);
  const [sizesEUR, setSizesEUR] = useState([]);
  const [sizesUK, setSizesUK] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [order, setOrder] = useState('createdDate,desc');

  const [selectedSports, setSelectedSports] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedSizesUS, setSelectedSizesUS] = useState([]);
  const [selectedSizesEUR, setSelectedSizesEUR] = useState([]);
  const [selectedSizesUK, setSelectedSizesUK] = useState([]);
  const [selectedMinPrice, setSelectedMinPrice] = useState(0);
  const [selectedMaxPrice, setSelectedMaxPrice] = useState(0);

  const [{ loading, error, products, page, totalPages }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      error: '',
      page: 1,
      totalPages: 1,
    }
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });

        const { data } = await axios.get(
          `/api/v1/products?query=${query ? query : ''}${
            selectedSports.length
              ? `&sports=${selectedSports.map((s) => s.name).join(',')}`
              : ''
          }${
            selectedColors.length
              ? `&colors=${selectedColors.map((c) => c.name).join(',')}`
              : ''
          }${
            selectedFeatures.length
              ? `&features=${selectedFeatures.map((f) => f.name).join(',')}`
              : ''
          }${
            selectedCountries.length
              ? `&countries=${selectedCountries.join(',')}`
              : ''
          }${
            selectedBrands.length ? `&brands=${selectedBrands.join(',')}` : ''
          }${
            selectedSizesUS.length ? `&sizeUS=${selectedSizesUS.join(',')}` : ''
          }${
            selectedSizesEUR.length
              ? `&sizeEUR=${selectedSizesEUR.join(',')}`
              : ''
          }${
            selectedSizesUK.length ? `&sizeUK=${selectedSizesUK.join(',')}` : ''
          }${selectedMinPrice ? `&minPrice=${selectedMinPrice}` : ''}${
            selectedMaxPrice ? `&maxPrice=${selectedMaxPrice}` : ''
          }&page=${page - 1}&size=${pageSize}`
        );

        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
      }
    };

    fetchData();
  }, [
    page,
    query,
    selectedBrands,
    selectedColors,
    selectedCountries,
    selectedFeatures,
    selectedMaxPrice,
    selectedMinPrice,
    selectedSizesEUR,
    selectedSizesUK,
    selectedSizesUS,
    selectedSports,
  ]);

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
      setCountriesOfOrigin(data);
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

    const fetchMinMax = async () => {
      const { data } = await axios.get('/api/v1/products/price-range');
      setMinPrice(data.min);
      setMaxPrice(data.max);

      setSelectedMinPrice(data.min);
      setSelectedMaxPrice(data.max);
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
      fetchMinMax();
    } catch (error) {
      toast.error(getError(error));
    }
  }, []);

  const brandsSelectHandler = (e) => {
    if (e.target.value === '') return;
    const selectedBrand = brands.find((x) => x === e.target.value);
    setSelectedBrands((prevBrands) =>
      prevBrands.some((x) => x === selectedBrand)
        ? prevBrands
        : [...prevBrands, selectedBrand]
    );
  };

  const deleteBrandHandler = (brand) => {
    setSelectedBrands((prevBrands) => prevBrands.filter((x) => x !== brand));
  };

  const featuresSelectHandler = (e) => {
    if (e.target.value === '') return;

    const selectedFeature = features.find(
      (x) => x.id === Number(e.target.value)
    );
    setSelectedFeatures((prevFeatures) =>
      prevFeatures.some((x) => x.id === selectedFeature.id)
        ? prevFeatures
        : [...prevFeatures, selectedFeature]
    );
  };

  const deleteFeatureHandler = (feature) => {
    setSelectedFeatures((prevFeatures) =>
      prevFeatures.filter((x) => x.id !== feature.id)
    );
  };

  const countriesSelectHandler = (e) => {
    if (e.target.value === '') return;
    const selectedCountry = countriesOfOrigin.find((x) => x === e.target.value);
    setSelectedCountries((prevCountries) =>
      prevCountries.some((x) => x === selectedCountry)
        ? prevCountries
        : [...prevCountries, selectedCountry]
    );
  };

  const deleteCountryHandler = (country) => {
    setSelectedCountries((prevCountries) =>
      prevCountries.filter((x) => x !== country)
    );
  };

  const sizesUSSelectHandler = (e) => {
    if (e.target.value === '') return;
    const selectedSizeUS = sizesUS.find((x) => x === Number(e.target.value));
    setSelectedSizesUS((prevSizesUS) =>
      prevSizesUS.some((x) => x === selectedSizeUS)
        ? prevSizesUS
        : [...prevSizesUS, selectedSizeUS]
    );
  };

  const deleteSizeUSHandler = (sizeUS) => {
    setSelectedSizesUS((prevSizesUS) =>
      prevSizesUS.filter((x) => x !== sizeUS)
    );
  };

  const sizesEURSelectHandler = (e) => {
    if (e.target.value === '') return;
    const selectedSizeEUR = sizesEUR.find((x) => x === Number(e.target.value));
    setSelectedSizesEUR((prevSizesEUR) =>
      prevSizesEUR.some((x) => x === selectedSizeEUR)
        ? prevSizesEUR
        : [...prevSizesEUR, selectedSizeEUR]
    );
  };

  const deleteSizeEURHandler = (sizeEUR) => {
    setSelectedSizesEUR((prevSizesEUR) =>
      prevSizesEUR.filter((x) => x !== sizeEUR)
    );
  };

  const sizesUKSelectHandler = (e) => {
    if (e.target.value === '') return;
    const selectedSizeUK = sizesUK.find((x) => x === Number(e.target.value));
    setSelectedSizesUK((prevSizesUK) =>
      prevSizesUK.some((x) => x === selectedSizeUK)
        ? prevSizesUK
        : [...prevSizesUK, selectedSizeUK]
    );
  };

  const deleteSizeUKHandler = (sizeUS) => {
    setSelectedSizesUK((prevSizesUK) =>
      prevSizesUK.filter((x) => x !== sizeUS)
    );
  };

  const sportsSelectHandler = (e) => {
    if (e.target.value === '') return;
    const selectedSport = sports.find((x) => x.id === Number(e.target.value));
    setSelectedSports((prevSports) =>
      prevSports.some((x) => x.id === selectedSport.id)
        ? prevSports
        : [...prevSports, selectedSport]
    );
  };

  const deleteSportHandler = (sport) => {
    setSelectedSports((prevSports) =>
      prevSports.filter((x) => x.id !== sport.id)
    );
  };

  const colorsSelectHandler = (e) => {
    if (e.target.value === '') return;
    const selectedColor = colors.find((x) => x.id === Number(e.target.value));
    setSelectedColors((prevColors) =>
      prevColors.some((x) => x.id === selectedColor.id)
        ? prevColors
        : [...prevColors, selectedColor]
    );
  };

  const deleteColorHandler = (color) => {
    setSelectedColors((prevColors) =>
      prevColors.filter((x) => x.id !== color.id)
    );
  };

  // function getFilterUrl(filter, skipPathname) {
  //   const filterPage = filter.page || page;
  //   const filterCategory = filter.category || category;
  //   const filterQuery = filter.query || query;
  //   const filterRating = filter.rating || rating;
  //   const filterPrice = filter.price || price;
  //   const sortOrder = filter.order || order;

  //   return `${
  //     skipPathname ? '' : '/search?'
  //   }page=${filterPage}&query=${filterQuery}&category=${filterCategory}&price=${filterPrice}&rating=${filterRating}&order=${sortOrder}`;
  // }

  return (
    <div>
      <Helmet>
        <title>Search Products</title>
      </Helmet>
      <h1 className="text-center">Products</h1>
      <Row>
        <Col md={3}>
          <ListGroup>
            <ListGroup.Item key="brand">
              <h5>Brand</h5>
              <div className="badges-container mb-1">
                {selectedBrands.map((x) => (
                  <Badge bg="primary" className="me-2 mb-1">
                    {x}
                    <Button
                      className="btn-delete"
                      variant="light"
                      onClick={() => deleteBrandHandler(x)}
                    >
                      <i className="far fa-times-circle fa-sm"></i>
                    </Button>
                  </Badge>
                ))}
              </div>
              <Form.Select onChange={brandsSelectHandler}>
                <option key="" value="">
                  Select brands
                </option>
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </Form.Select>
            </ListGroup.Item>
            <ListGroup.Item key="selectedMinPrice">
              <h5>Minimum Price</h5>
              <Form.Range
                min={minPrice}
                max={maxPrice}
                value={selectedMinPrice}
                onChange={(e) => setSelectedMinPrice(e.target.value)}
              />
              <Form.Control
                value={selectedMinPrice}
                onChange={(e) => setSelectedMinPrice(e.target.value)}
              />
            </ListGroup.Item>
            <ListGroup.Item key="selectedMaxPrice">
              <h5>Maximum Price</h5>
              <Form.Range
                min={minPrice}
                max={maxPrice}
                value={selectedMaxPrice}
                onChange={(e) => setSelectedMaxPrice(e.target.value)}
              />
              <Form.Control
                value={selectedMaxPrice}
                onChange={(e) => setSelectedMaxPrice(e.target.value)}
              />
            </ListGroup.Item>
            <ListGroup.Item key="sport">
              <h5>Sport</h5>
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
                {sports.map((sports) => (
                  <option key={sports.id} value={sports.id}>
                    {sports.name}
                  </option>
                ))}
              </Form.Select>
            </ListGroup.Item>
            <ListGroup.Item key="color">
              <h5>Color</h5>
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
            </ListGroup.Item>
            <ListGroup.Item key="feature">
              <h5>Feature</h5>
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
            </ListGroup.Item>
            <ListGroup.Item key="sizeUS">
              <h5>Size US</h5>
              <div className="badges-container mb-1">
                {selectedSizesUS.map((x) => (
                  <Badge bg="primary" className="me-2 mb-1">
                    {x} {console.log(x)}
                    <Button
                      className="btn-delete"
                      variant="light"
                      onClick={() => deleteSizeUSHandler(x)}
                    >
                      <i className="far fa-times-circle fa-sm"></i>
                    </Button>
                  </Badge>
                ))}
              </div>
              <Form.Select onChange={sizesUSSelectHandler}>
                <option key="" value="">
                  Select size
                </option>
                {sizesUS.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </Form.Select>
            </ListGroup.Item>
            <ListGroup.Item key="sizeUK">
              <h5>Size UK</h5>
              <div className="badges-container mb-1">
                {selectedSizesUK.map((x) => (
                  <Badge bg="primary" className="me-2 mb-1">
                    {x}
                    <Button
                      className="btn-delete"
                      variant="light"
                      onClick={() => deleteSizeUKHandler(x)}
                    >
                      <i className="far fa-times-circle fa-sm"></i>
                    </Button>
                  </Badge>
                ))}
              </div>
              <Form.Select onChange={sizesUKSelectHandler}>
                <option key="" value="">
                  Select size
                </option>
                {sizesUK.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </Form.Select>
            </ListGroup.Item>
            <ListGroup.Item key="sizeEUR">
              <h5>Size EUR</h5>
              <div className="badges-container mb-1">
                {selectedSizesEUR.map((x) => (
                  <Badge bg="primary" className="me-2 mb-1">
                    {x}
                    <Button
                      className="btn-delete"
                      variant="light"
                      onClick={() => deleteSizeEURHandler(x)}
                    >
                      <i className="far fa-times-circle fa-sm"></i>
                    </Button>
                  </Badge>
                ))}
              </div>
              <Form.Select onChange={sizesEURSelectHandler}>
                <option key="" value="">
                  Select size
                </option>
                {sizesEUR.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </Form.Select>
            </ListGroup.Item>
            <ListGroup.Item key="country">
              <h5>Country</h5>
              <div className="badges-container mb-1">
                {selectedCountries.map((x) => (
                  <Badge bg="primary" className="me-2 mb-1">
                    {x}
                    <Button
                      className="btn-delete"
                      variant="light"
                      onClick={() => deleteCountryHandler(x)}
                    >
                      <i className="far fa-times-circle fa-sm"></i>
                    </Button>
                  </Badge>
                ))}
              </div>
              <Form.Select onChange={countriesSelectHandler}>
                <option key="" value="">
                  Select country
                </option>
                {countriesOfOrigin.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </Form.Select>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={9}>
          {loading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <>
              <Row className="justify-content-between mb-3">
                <Col md={6}>
                  <div>{products.length} Results</div>
                </Col>
                <Col className="text-end">
                  Sort by{' '}
                  <select
                    value={order}
                    onChange={(e) => {
                      setOrder(e.target.value);
                    }}
                  >
                    <option value="createdDate,desc">Newest Arrivals</option>
                    <option value="price,asc">Price: Low to High</option>
                    <option value="price,descsc">Price: High to Low</option>
                  </select>
                </Col>
              </Row>
              {products.length === 0 && (
                <MessageBox>No Product Found</MessageBox>
              )}
              <Row>
                {products.map((product) => (
                  <Col sm={6} lg={4} className="mb-3" key={product._id}>
                    <Product product={product}></Product>
                  </Col>
                ))}
              </Row>
              <div>
                <Pagination>
                  {Array(totalPages)
                    .fill(0)
                    .map((_, i) => (
                      <Pagination.Item
                        key={i + 1}
                        active={i + 1 === page}
                        onClick={() =>
                          dispatch({ type: 'PAGE_CHANGE', payload: i + 1 })
                        }
                      >
                        {i + 1}
                      </Pagination.Item>
                    ))}
                </Pagination>
              </div>
            </>
          )}
        </Col>
      </Row>
    </div>
  );
}
