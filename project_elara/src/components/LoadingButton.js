import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

export default function LoadingButton(props) {
  const [isLoading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await props.onClick();
    setLoading(false);
  };

  return (
    <Button
      variant={props.variant}
      size={props.size}
      disabled={isLoading}
      onClick={isLoading ? null : handleClick}
    >
      {isLoading && (
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
        />
      )}
      {isLoading ? ' Loading…' : props.children}
    </Button>
  );
}
