import React from 'react';
import './ContentContainer.scss';

interface Props {
  children: React.ReactNode;
}

function ContentContainer(props: Props) {
  return <div className={'content-wrapper'}> {props.children} </div>;
}

export default ContentContainer;
