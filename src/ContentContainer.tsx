import React from 'react';
import './ContentContainer.scss';
interface Props {
  children: any;
}
class ContentContainer extends React.Component<Props, any> {
  render() {
    return <div className={'content-wrapper'}> {this.props.children} </div>;
  }
}
export default ContentContainer;
