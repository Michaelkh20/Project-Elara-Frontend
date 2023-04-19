import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Store } from '../../Store';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from '../../components/CheckoutSteps';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import { getError } from '../../utils';
import { toast } from 'react-toastify';

export default function ShippingAddressScreen() {
  const navigate = useNavigate();

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    userInfo,
    cart: { shippingAddress },
    order,
  } = state;

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [isSavedAddressSelected, setIsSavedAddressSelected] = useState(
    shippingAddress.id ? true : false
  );
  const [selectedAddressId, setSelectedAddressId] = useState(
    shippingAddress.id ? shippingAddress.id : ''
  );

  const [zip, setZip] = useState(
    shippingAddress.zip ? shippingAddress.zip : ''
  );
  const [city, setCity] = useState(
    shippingAddress.city ? shippingAddress.city : ''
  );
  const [country, setCountry] = useState(
    shippingAddress.country ? shippingAddress.country : ''
  );
  const [street, setStreet] = useState(
    shippingAddress.street ? shippingAddress.street : ''
  );
  const [house, setHouse] = useState(
    shippingAddress.house ? shippingAddress.house : ''
  );
  const [apartment, setApartment] = useState(
    shippingAddress.apartment ? shippingAddress.apartment : ''
  );
  const [entrance, setEntrance] = useState(
    shippingAddress.entrance ? shippingAddress.entrance : ''
  );

  // useEffect(() => {
  //   if (!userInfo || !order) {
  //     navigate('/signin');
  //   }
  // }, [userInfo, navigate, order]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `/api/v1/delivery/saved-addresses?userId=${userInfo.id}`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        // FIXME: Change to match new API
        setSavedAddresses(
          data.map((address) => ({
            id: address.id,
            zip: address.postalCode,
            city: address.city,
            country: address.country,
            street: address.street,
            house: address.buildingNumber,
            apartment: address.apartmentNumber,
            entrance: address.entranceNumber,
          }))
        );
      } catch (error) {
        toast.error(getError(error));
      }
    };

    fetchData();
  }, [userInfo]);

  const submitAddressHandler = async (e) => {
    e.preventDefault();

    if (isSavedAddressSelected) {
      const selectedAddress = savedAddresses.find(
        (address) => address.id === selectedAddressId
      );

      if (selectedAddress) {
        ctxDispatch({
          type: 'SAVE_SHIPPING_ADDRESS',
          payload: selectedAddress,
        });
      } else {
        toast.error('Please select saved address');
        return;
      }
    } else {
      ctxDispatch({
        type: 'SAVE_SHIPPING_ADDRESS',
        payload: {
          id: null,
          zip,
          city,
          country,
          street,
          house,
          apartment,
          entrance,
        },
      });
    }

    navigate('/shippingMethods');
  };

  const addressSelectHandler = (e) => {
    setSelectedAddressId(e.target.value);

    if (e.target.value === '') {
      setIsSavedAddressSelected(false);
      return;
    }

    const selectedAddress = savedAddresses.find(
      (address) => address.id === e.target.value
    );

    if (selectedAddress) {
      setIsSavedAddressSelected(true);
    } else {
      setIsSavedAddressSelected(false);
    }

    if (selectedAddress) {
      setZip(selectedAddress.zip);
      setCity(selectedAddress.city);
      setCountry(selectedAddress.country);
      setStreet(selectedAddress.street);
      setHouse(selectedAddress.house);
      setApartment(selectedAddress.apartment);
      setEntrance(selectedAddress.entrance);
    }
  };

  const addressToString = (address) => {
    return `${address.street}, ${address.house}, ${address.apartment}, ${address.entrance}, ${address.city}, ${address.zip}, ${address.country}`;
  };

  return (
    <div>
      <Helmet>
        <title> Shipping Address</title>
      </Helmet>
      <CheckoutSteps step1 step2 />
      <div className="container small-container">
        <h1 className="my-3">Shipping Address</h1>
        <Form onSubmit={submitAddressHandler}>
          <Form.Group className="mb-3" controlId="address">
            <Form.Label>Saved addresses</Form.Label>
            <Form.Select
              onChange={addressSelectHandler}
              value={selectedAddressId}
            >
              <option value="">New address</option>
              {savedAddresses.map((address) => (
                <option value={address.id}>{addressToString(address)}</option>
              ))}
            </Form.Select>
            <Form.Text className="text-muted">
              Choose address or create new one
            </Form.Text>
          </Form.Group>
          <Row>
            <Form.Group as={Col} className="mb-3" controlId="country">
              <Form.Label>Country</Form.Label>
              <Form.Control
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                disabled={isSavedAddressSelected}
                required
              ></Form.Control>
            </Form.Group>
            <Form.Group as={Col} className="mb-3" controlId="city">
              <Form.Label>City</Form.Label>
              <Form.Control
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={isSavedAddressSelected}
                required
              ></Form.Control>
            </Form.Group>
          </Row>
          <Form.Group className="mb-3" controlId="street">
            <Form.Label>Street</Form.Label>
            <Form.Control
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              disabled={isSavedAddressSelected}
              required
            ></Form.Control>
          </Form.Group>
          <Row>
            <Form.Group as={Col} className="mb-3" controlId="house">
              <Form.Label>House</Form.Label>
              <Form.Control
                value={house}
                onChange={(e) => setHouse(e.target.value)}
                disabled={isSavedAddressSelected}
                required
              ></Form.Control>
            </Form.Group>
            <Form.Group as={Col} className="mb-3" controlId="apartment">
              <Form.Label>Apartment</Form.Label>
              <Form.Control
                value={apartment}
                onChange={(e) => setApartment(e.target.value)}
                disabled={isSavedAddressSelected}
                required
              ></Form.Control>
            </Form.Group>
          </Row>
          <Row>
            <Form.Group as={Col} className="mb-3" controlId="entrance">
              <Form.Label>Entrance</Form.Label>
              <Form.Control
                value={entrance}
                onChange={(e) => setEntrance(e.target.value)}
                disabled={isSavedAddressSelected}
                required
              ></Form.Control>
            </Form.Group>
            <Form.Group as={Col} className="mb-3" controlId="zip">
              <Form.Label>Zip</Form.Label>
              <Form.Control
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                disabled={isSavedAddressSelected}
                required
              ></Form.Control>
            </Form.Group>
          </Row>
          <div className="mb-3">
            <Button variant="primary" type="submit">
              Continue
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
