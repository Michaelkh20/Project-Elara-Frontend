export const getError = (error) => {
  return error.response && error.response.data
    ? error.response.data
    : error.message;
};

export const addressToString = (address) => {
  return `${address.street}, ${address.house}, ${address.apartment}, ${address.entrance}, ${address.city}, ${address.zip}, ${address.country}`;
};

export function isOrderPaid(order) {
  return (
    order.status !== 'ALLOCATED' && order.status !== 'DELIVERY_METHOD_SELECTED'
  );
}

export function orderStatusToNumber(order) {
  switch (order.status) {
    case 'ALLOCATED':
      return 1;
    case 'DELIVERY_METHOD_SELECTED':
      return 2;
    case 'PAID':
      return 3;
    case 'PACKED':
      return 4;
    case 'IN_DELIVERY':
      return 5;
    case 'DELIVERED':
      return 6;
    case 'CANCELLED ':
      return 10;
    default:
      return 0;
  }
}

export const emailRegexp =
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const passwordRegexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
