import React, { FC } from 'react';

interface IProps {
  text: string;
  onClick: any;
}

const Button: FC<IProps> = ({ text, onClick }) => {
  return (
    <button onClick={onClick} className={'btn'}>
      {' '}
      {text}{' '}
    </button>
  );
};

export default Button;
