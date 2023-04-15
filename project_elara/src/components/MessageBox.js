import Alert from 'react-bootstrap/Alert';

function MessageBox(props) {
  return (
    <Alert className={props.className || ''} variant={props.variant || 'info'}>
      {props.children}
    </Alert>
  );
}

export default MessageBox;
