import axios from 'axios';
import { useEffect, useReducer } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Product from '../components/Product';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Pagination from 'react-bootstrap/Pagination';
import { getError } from '../utils';

// INTEGRATED

const pageSize = 10;

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        products: action.payload.content.map((product) => {
          return { ...product, countInStock: product.quantity, quantity: 0 };
        }),
        page: action.payload.pageable.pageNumber + 1,
        totalPages: action.payload.totalPages,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'PAGE_CHANGE':
      return { ...state, page: action.payload };
    default:
      return state;
  }
};

function HomeScreen() {
  const [{ loading, error, products, page, totalPages }, dispatch] = useReducer(
    reducer,
    {
      products: [],
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
          `/api/v1/products/recent?page=${page - 1}&size=${pageSize}`
        );

        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
      }
    };

    fetchData();
  }, [page]);

  return (
    <div>
      <Helmet>
        <title>Project Elara</title>
      </Helmet>
      <h1>Featured Products</h1>
      <div className="products">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <>
            <Row>
              {products.map((product) => (
                <Col key={product.id} sm={6} md={4} lg={3} className="mb-3">
                  <Product product={product}></Product>
                </Col>
              ))}
            </Row>
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
          </>
        )}
      </div>
    </div>
  );
}

export default HomeScreen;
