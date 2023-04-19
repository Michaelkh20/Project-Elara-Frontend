import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import CheckoutSteps from '../../components/CheckoutSteps';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Store } from '../../Store';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getError } from '../../utils';
import { toast } from 'react-toastify';

export default function ShippingMethodsScreen() {
  const navigate = useNavigate();

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    userInfo,
    cart: { shippingAddress },
    order,
  } = state;

  const [shipmentMethods, setShipmentMethods] = useState([]);
  const [selectedTariffCode, setSelectedTariffCode] = useState('');

  // useEffect(() => {
  //   if (!userInfo || !order || !shippingAddress) {
  //     navigate('/signin');
  //   }
  // }, [userInfo, navigate, order, shippingAddress]);

  useEffect(() => {
    const fetchShipmentMethods = async () => {
      // try {
      //   let requestBody = {
      //     orderId: order.id,
      //     toAddress: {
      //       id: shippingAddress.id,
      //       postalCode: shippingAddress.zip,
      //       city: shippingAddress.city,
      //       country: shippingAddress.country,
      //       street: shippingAddress.street,
      //       buildingNumber: shippingAddress.house,
      //       apartmentNumber: shippingAddress.apartment,
      //       entranceNumber: shippingAddress.entrance,
      //     },
      //   };

      //   const { data } = await axios.post('/v1/delivery/get', requestBody, {
      //     headers: { Authorization: `Bearer ${userInfo.token}` },
      //   });

      //   setShipmentMethods(data.shipmentMethods);
      // } catch (error) {
      //   toast.error(getError(error));
      // }

      // MOCK
      setShipmentMethods([
        {
          tariffCode: '1',
          tariffName: 'test',
          tariffDescription:
            'tesddddd w3e 3we we we fwggerg3 rg we wgt3 3 g4g g33r g3',
          deliveryMode: 1,
          deliverySum: 100,
          periodMin: 1,
          periodMax: 2,
        },
        {
          tariffCode: '2',
          tariffName: 'test',
          tariffDescription: 'test',
          deliveryMode: 1,
          deliverySum: 100,
          periodMin: 1,
          periodMax: 2,
        },
      ]);
    };

    fetchShipmentMethods();
  }, [order, userInfo, shippingAddress]);

  const submitShipmentHandler = async (e) => {
    e.preventDefault();

    const selectedShipmentMethod = shipmentMethods.find(
      (method) => method.tariffCode === selectedTariffCode
    );

    try {
      await axios.put(
        '/v1/delivery/select',
        {
          orderId: order.id,
          shipmentMethod: selectedShipmentMethod,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
    } catch (error) {
      toast.error(getError(error));
    }

    navigate('/payment');
  };

  return (
    <div>
      <Helmet>
        <title>Shipping Address</title>
      </Helmet>
      <CheckoutSteps step1 step2 />
      <div className="container small-container">
        <h1 className="my-3">Shipment Methods</h1>
        <Form onSubmit={submitShipmentHandler}>
          <ListGroup className="mb-3">
            {shipmentMethods.map((method) => (
              <ListGroup.Item
                key={method.tariffCode}
                className="shipment-method"
              >
                <Row className="align-items-center">
                  <Col md={1}>
                    <Form.Check
                      type="radio"
                      required
                      name="shipmentMethods"
                      value={method.tariffCode}
                      onChange={(e) => {
                        console.log(e.target.value);
                        setSelectedTariffCode(e.target.value);
                      }}
                    />
                  </Col>
                  <Col md={2} className="tariff-name">
                    <strong>{method.tariffName}</strong>
                  </Col>
                  <Col md={4} className="tariff-description">
                    {method.tariffDescription}
                  </Col>
                  <Col md={2} className="delivery-sum">
                    <strong>${method.deliverySum}</strong>
                  </Col>
                  <Col md={'auto'} className="delivery-time">
                    <em>
                      from {method.periodMin} to {method.periodMax} days
                    </em>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <div className="mb-3">
            <Button variant="primary" type="submit" className="continue-btn">
              Continue
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
