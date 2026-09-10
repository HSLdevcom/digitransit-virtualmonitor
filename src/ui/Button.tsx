import React, { FC } from 'react';

interface IProps {
  text: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button: FC<IProps> = ({ text, onClick }) => {
  return (
    <button onClick={onClick} className={'btn'}>
      {text}
    </button>
  );
};

export default Button;
