import React from 'react';

interface Props {
  text: string;
}

const TextBox = ({ text }: Props) => {
  return (
    <div>
      <div>{text}</div>
    </div>
  );
};

export default TextBox;
