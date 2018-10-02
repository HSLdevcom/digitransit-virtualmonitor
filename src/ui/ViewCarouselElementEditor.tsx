import React = require('react');

import { IViewCarouselElement, IStopTimesView } from 'src/ui/ConfigurationList';
import ViewEditor from 'src/ui/ViewEditor';

export interface ViewCarouselElementEditorProps {
  viewCarouselElement: IViewCarouselElement,
};

const ViewCarouselElementEditor: React.SFC<ViewCarouselElementEditorProps> = ({ viewCarouselElement }: ViewCarouselElementEditorProps) => (
  <React.Fragment>
    <div>Näytetty aika: {viewCarouselElement.displayTime} sekuntia</div>
    <ViewEditor view={viewCarouselElement.view} />
  </React.Fragment>
);

export default ViewCarouselElementEditor;
