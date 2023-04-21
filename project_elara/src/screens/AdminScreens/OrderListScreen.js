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
import { toast } from 'react-toastify';

// INTEGRATED

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
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return { ...state, loadingDelete: false, successDelete: true };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false, successDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    case 'PAGE_CHANGE':
      return { ...state, page: action.payload };
    default:
      return state;
  }
};

const pageSize = 10;

export default function OrderListScreen() {
  const navigate = useNavigate();

  const { state } = useContext(Store);
  const { userInfo } = state;

  const [
    { loading, error, orders, page, totalPages, loadingDelete, successDelete },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
    page: 1,
    totalPages: 1,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });

        const { data } = await axios.get(
          `/api/v1/orders/?pageNumber=${page - 1}&size=${pageSize}`,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );

        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
      }
    };

    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [userInfo, successDelete, page]);

  const deleteHandler = async (order) => {
    if (!window.confirm('Are you sure to delete?')) {
      return;
    }

    try {
      dispatch({ type: 'DELETE_REQUEST' });

      await axios.put(
        `/api/v1/orders/change-status?orderId=${order.id}&status=CANCELLED`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );

      dispatch({ type: 'DELETE_SUCCESS' });
      toast.success('Order deleted successfully');
    } catch (error) {
      dispatch({ type: 'DELETE_FAIL' });
      toast.error(getError(error));
    }
  };

  return (
    <div>
      <Helmet>
        <title>Orders</title>
      </Helmet>
      <h1>Orders</h1>
      {loadingDelete && <LoadingBox />}
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
                <th>USER</th>
                <th>TOTAL WITHOUT DISCOUNT</th>
                <th>TOTAL WITH DISCOUNT</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.userId}</td>
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
                    &nbsp;
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => deleteHandler(order)}
                    >
                      Delete
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
