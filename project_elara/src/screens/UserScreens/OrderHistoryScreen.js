import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../../components/LoadingBox';
import MessageBox from '../../components/MessageBox';
import { Store } from '../../Store';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getError } from '../../utils';
import Button from 'react-bootstrap/Button';
import Pagination from 'react-bootstrap/Pagination';

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
        orders: action.payload.content,
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

export default function OrderHistoryScreen() {
  const navigate = useNavigate();

  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, orders, page, totalPages }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      error: '',
      ordres: [],
      page: 1,
      totalPages: 1,
    }
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });

        const { data } = await axios.get(
          `/api/v1/orders/${userInfo.id}?pageNumber=${
            page - 1
          }&pageSize=${pageSize}`,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );

        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
      }
    };

    fetchData();
  }, [page, userInfo]);

  return (
    <div>
      <Helmet>
        <title>Order History</title>
      </Helmet>

      <h1>Order History</h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>TOTAL</th>
                <th>TOTAL WITH DISCOUNT</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>${order.totalWithoutDiscount.toFixed(2)}</td>
                  <td>${order.totalWithDiscount.toFixed(2)}</td>
                  <td>{order.status}</td>
                  <td>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => navigate(`/order/${order.id}`)}
                    >
                      Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
    </div>
  );
}
