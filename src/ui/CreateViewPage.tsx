import * as React from 'react';
import StopCardListContainer from './StopCardListContainer';
import ContentContainer from './ContentContainer';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IProps {}

const CreateViewPage: React.FC<IProps> = () => {
  return (
    <ContentContainer>
      <StopCardListContainer />
    </ContentContainer>
  );
};
export default CreateViewPage;
