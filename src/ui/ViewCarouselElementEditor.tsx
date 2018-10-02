import React = require('react');

import { IViewCarouselElement, IStopTimesView } from 'src/ui/ConfigurationList';
import StopTimesViewEditor from 'src/ui/StopTimesViewEditor';

export interface ViewCarouselElementEditorProps {
  viewCarouselElement: IViewCarouselElement,
};

const ViewCarouselElementEditor: React.SFC<ViewCarouselElementEditorProps> = ({ viewCarouselElement }: ViewCarouselElementEditorProps) => (
  <React.Fragment>
    <div>Näytetty aika: {viewCarouselElement.displayTime} sekuntia</div>
    <StopTimesViewEditor view={viewCarouselElement.view as IStopTimesView} />
  </React.Fragment>
);

export default ViewCarouselElementEditor;
