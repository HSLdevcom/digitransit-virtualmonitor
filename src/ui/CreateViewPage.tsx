import * as React from 'react';
import { IMonitorConfig } from '../App';
import StopCardListContainer from './StopCardListContainer';
import ContentContainer from './ContentContainer';

interface IConfigWithFeedIs extends IMonitorConfig {
  feedIds?: Array<string>;
}
interface IProps {
  config: IConfigWithFeedIs;
}

const CreateViewPage: React.FC<IProps> = props => {
  return (
    <ContentContainer>
      <StopCardListContainer feedIds={props.config.feedIds} />
    </ContentContainer>
  );
};
export default CreateViewPage;
