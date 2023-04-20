import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Badge from 'react-bootstrap/Badge';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import { useContext, useEffect, useState } from 'react';
import { Store } from './Store';
import CartScreen from './screens/CartScreen';
import SigninScreen from './screens/AuthScreens/SigninScreen';
import ShippingAddressScreen from './screens/OrderFlowScreens/ShippingAddressScreen';
import SignupScreen from './screens/AuthScreens/SignupScreen';
import PaymentMethodScreen from './screens/OrderFlowScreens/PaymentMethodScreen';
import OrderPaymentScreen from './screens/OrderFlowScreens/OrderPaymentScreen';
import OrderHistoryScreen from './screens/UserScreens/OrderHistoryScreen';
import ProfileScreen from './screens/UserScreens/ProfileScreen';
import Button from 'react-bootstrap/Button';
import { getError } from './utils';
import axios from 'axios';
import SearchBox from './components/SearchBox';
import SearchScreen from './screens/SearchScreen';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardScreen from './screens/AdminScreens/DashboardScreen';
import AdminRoute from './components/AdminRoute';
import ProductListScreen from './screens/AdminScreens/products/ProductListScreen';
import ProductEditScreen from './screens/AdminScreens/products/ProductEditScreen';
import OrderListScreen from './screens/AdminScreens/OrderListScreen';
import UserListScreen from './screens/AdminScreens/UserListScreen';
import UserEditScreen from './screens/AdminScreens/UserEditScreen';
import ForgetPasswordScreen from './screens/AuthScreens/ForgetPasswordScreen';
import ResetPasswordScreen from './screens/AuthScreens/ResetPasswordScreen';
import SignupConfirmationScreen from './screens/AuthScreens/SignupConfirmationScreen';
import EmailSentScreen from './screens/AuthScreens/EmailSentScreen';
import OrderScreen from './screens/OrderFlowScreens/OrderScreen';
import ShippingMethodsScreen from './screens/OrderFlowScreens/ShippingMethodsScreen';
import ProductCreateScreen from './screens/AdminScreens/products/ProductCreateScreen';
import SportListScreen from './screens/AdminScreens/sport/SportListScreen';
import SportCreateScreen from './screens/AdminScreens/sport/SportCreateScreen';
import SportEditScreen from './screens/AdminScreens/sport/SportEditScreen';
import FeatureListScreen from './screens/AdminScreens/features/FeatureListScreen';
import FeatureCreateScreen from './screens/AdminScreens/features/FeatureCreateScreen';
import FeatureEditScreen from './screens/AdminScreens/features/FeatureEditScreen';
import ColorListScreen from './screens/AdminScreens/colors/ColorListScreen';
import ColorCreateScreen from './screens/AdminScreens/colors/ColorCreateScreen';
import ColorEditScreen from './screens/AdminScreens/colors/ColorEditScreen';

function App() {
  // const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    window.location.href = '/signin';
    // navigate('/signin');
  };

  return (
    <BrowserRouter>
      <div className={'d-flex flex-column site-container'}>
        <ToastContainer position="bottom-center" limit={1} />
        <header>
          <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
              <LinkContainer to="/">
                <Navbar.Brand>Project Elara</Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <SearchBox />
                <Nav className="me-auto w-100 justify-content-end">
                  <Link to="/cart" className="nav-link">
                    Cart{' '}
                    {cart.cartItems.length > 0 && (
                      <Badge pill bg="danger">
                        {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                      </Badge>
                    )}
                  </Link>
                  {userInfo ? (
                    <NavDropdown
                      title={userInfo.firstName}
                      id="basic-nav-dropdown"
                    >
                      <LinkContainer to="/profile">
                        <NavDropdown.Item>User profile</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/orderhistory">
                        <NavDropdown.Item>Order History</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <Link
                        className="dropdown-item"
                        to="#signout"
                        onClick={signoutHandler}
                      >
                        Sign Out
                      </Link>
                    </NavDropdown>
                  ) : (
                    <Link className="nav-link" to="/signin">
                      Sign In
                    </Link>
                  )}
                  {userInfo && userInfo.role === 'ADMIN' && (
                    <NavDropdown title="Admin" id="admin-nav-dropdown">
                      <LinkContainer to="/admin/products">
                        <NavDropdown.Item>Products</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/orders">
                        <NavDropdown.Item>Orders</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/sports">
                        <NavDropdown.Item>Sports</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/features">
                        <NavDropdown.Item>Features</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/colors">
                        <NavDropdown.Item>Colors</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/product/:id" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/search" element={<SearchScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route path="/email-sent" element={<EmailSentScreen />} />
              <Route
                path="/confirm-registration/:token"
                element={<SignupConfirmationScreen />}
              />

              <Route
                path="/forget-password"
                element={<ForgetPasswordScreen />}
              />
              <Route
                path="/reset-password/:token"
                element={<ResetPasswordScreen />}
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfileScreen />
                  </ProtectedRoute>
                }
              />
              <Route path="/orderpayment" element={<OrderPaymentScreen />} />
              <Route
                path="/order/:id"
                element={
                  <ProtectedRoute>
                    <OrderScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orderhistory"
                element={
                  <ProtectedRoute>
                    <OrderHistoryScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/shippingAddress"
                element={<ShippingAddressScreen />}
              />
              <Route path="/payment" element={<PaymentMethodScreen />} />
              <Route
                path="/shippingMethods"
                element={<ShippingMethodsScreen />}
              />
              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <DashboardScreen />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <AdminRoute>
                    <OrderListScreen />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <UserListScreen />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <AdminRoute>
                    <ProductListScreen />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/product/create"
                element={
                  <AdminRoute>
                    <ProductCreateScreen />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/product/:id"
                element={
                  <AdminRoute>
                    <ProductEditScreen />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/sports"
                element={
                  <AdminRoute>
                    <SportListScreen />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/sport/create"
                element={
                  <AdminRoute>
                    <SportCreateScreen />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/sport/:id"
                element={
                  <AdminRoute>
                    <SportEditScreen />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/features"
                element={
                  <AdminRoute>
                    <FeatureListScreen />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/feature/create"
                element={
                  <AdminRoute>
                    <FeatureCreateScreen />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/feature/:id"
                element={
                  <AdminRoute>
                    <FeatureEditScreen />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/colors"
                element={
                  <AdminRoute>
                    <ColorListScreen />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/color/create"
                element={
                  <AdminRoute>
                    <ColorCreateScreen />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/color/:id"
                element={
                  <AdminRoute>
                    <ColorEditScreen />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/user/:id"
                element={
                  <AdminRoute>
                    <UserEditScreen />
                  </AdminRoute>
                }
              />
              <Route path="/" element={<HomeScreen />} />
            </Routes>
          </Container>
        </main>
        <footer>
          <div className="text-center">
            © 2023 Project Elara: e-commerce platform
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
