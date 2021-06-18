import * as React from 'react';
import StopCardListContainer from './StopCardListContainer';
import ContentContainer from './ContentContainer';

interface IProps {
  config: any;
}

const CreateViewPage: React.FC<IProps> = props => {
  return (
    <ContentContainer>
      <StopCardListContainer feedIds={props.config.feedIds} />
    </ContentContainer>
  );
};
export default CreateViewPage;
