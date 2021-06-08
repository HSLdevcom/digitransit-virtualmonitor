import * as React from 'react';
import StopCardListContainer from './StopCardListContainer';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IProps {
}


const CreateViewPage:React.FC<IProps> = () =>  {
  return (
    <>
      <StopCardListContainer />
    </>
  )
}
export default CreateViewPage;
