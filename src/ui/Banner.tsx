import * as React from 'react';
import './Banner.scss';
import Logo from './logo/Logo';
interface Props {
  config?: any;
}
const Banner: React.FC<Props> = (props: Props) => {
  return (
    <div className="banner">
      <Logo monitorConfig={props.config} />
    </div>
  );
};
export default Banner;
