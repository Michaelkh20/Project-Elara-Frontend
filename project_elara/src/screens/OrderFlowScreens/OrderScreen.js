import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import { Link, useParams } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import { Store } from '../../Store';
import { getError, isOrderPaid } from '../../utils';
import axios from 'axios';
import LoadingBox from '../../components/LoadingBox';
import MessageBox from '../../components/MessageBox';
import { toast } from 'react-toastify';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';

// INTEGRATED

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'CHANGE_STATUS_SUCCESS':
      return { ...state, order: action.payload };
    default:
      return state;
  }
};

export default function OrderScreen() {
  const params = useParams();
  const { id: orderId } = params;

  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, order }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
  });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });

        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });

        data.positions = data.positions.map(async (position) => {
          try {
            const { data: product } = await axios.get(
              `/api/v1/products/${position.productId}`
            );

            return { ...position, product };
          } catch (error) {
            dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
          }
        });

        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
      }
    };

    fetchOrder();
  }, [orderId, userInfo]);

  async function changeStatusHandler() {
    let nextStatus;
    switch (order.status) {
      case 'PAID':
        nextStatus = 'PACKED';
        break;
      case 'PACKED':
        nextStatus = 'IN_DELIVERY';
        break;
      case 'IN_DELIVERY':
        nextStatus = 'DELIVERED';
        break;
      default:
        return;
    }

    try {
      const { data } = await axios.put(
        `/v1/orders/change-status?orderId=${order.id}&status=${nextStatus}`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );

      dispatch({ type: 'CHANGE_STATUS_SUCCESS', payload: data });
      toast.success('Status changed');
    } catch (error) {
      toast.error(getError(error));
    }
  }

  function orderAddressToString({ shipmentDetails: { toAddress } }) {
    return `${toAddress.entranceNumber}, ${toAddress.buildingNumber}, ${toAddress.apartmentNumber}, ${toAddress.entrance}, ${toAddress.city}, ${toAddress.postalCode}, ${toAddress.country}`;
  }

  function getAdminButtonText(status) {
    switch (status) {
      case 'PAID':
        return 'Pack order';
      case 'PACKED':
        return 'Transfer to delivery';
      case 'IN_DELIVERY':
        return 'Deliver order';
      default:
        return false;
    }
  }

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Helmet>
        <title>Order {order.id}</title>
      </Helmet>
      <h1 className="my-3">Order {order.id}</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Shipping</Card.Title>
              <Card.Text>
                <strong>Address: </strong> {orderAddressToString(order)}
                <strong>Shipping method: </strong>{' '}
                {order.shipmentDetails.shipmentMethod.tariffName}
              </Card.Text>
              <MessageBox
                variant={order.status === 'DELIVERED' ? 'success' : 'info'}
              >
                Status: {order.status}
              </MessageBox>
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <Card.Text>
                <strong>Method:</strong> PayPal
              </Card.Text>
              {isOrderPaid(order) ? (
                <MessageBox variant="success">
                  Paid at {order.paymentDetails.updateTime}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Not Paid</MessageBox>
              )}
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <ListGroup variant="flush">
                {order.positions.map((item) => (
                  <ListGroup.Item key={item.id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={item.product.pictures[0]}
                          alt={item.product.name}
                          className="img-fluid rounded img-thumbnail"
                        ></img>{' '}
                        <Link to={`/product/${item.product.id}`}>
                          {item.product.name}
                        </Link>
                      </Col>
                      <Col md={2}>
                        <span>{item.quantity}</span>
                      </Col>
                      <Col md={2}>${item.price}</Col>
                      <Col md={2}>
                        <Badge bg="danger">-{item.discount}%</Badge>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Order summary</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>${order.itemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>${order.shippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>${order.taxPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong>Order Total</strong>
                    </Col>
                    <Col>
                      <strong>${order.totalPrice.toFixed(2)}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                {userInfo.role === 'ADMIN' &&
                  getAdminButtonText(order.status) && (
                    <ListGroup.Item>
                      <div className="d-grid">
                        <Button type="button" onClick={changeStatusHandler}>
                          {getAdminButtonText(order.status)}
                        </Button>
                      </div>
                    </ListGroup.Item>
                  )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
