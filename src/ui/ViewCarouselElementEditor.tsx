import React = require('react');

import { IViewCarouselElement, IStopTimesView } from 'src/ui/ConfigurationList';
import ViewEditor from 'src/ui/ViewEditor';

export interface ViewCarouselElementEditorProps {
  readonly viewCarouselElement: IViewCarouselElement,
};

const ViewCarouselElementEditor: React.SFC<ViewCarouselElementEditorProps> = ({ viewCarouselElement }: ViewCarouselElementEditorProps) => (
  <React.Fragment>
    <div>Näytetty aika: {viewCarouselElement.displaySeconds} sekuntia</div>
    <ViewEditor view={viewCarouselElement.view} />
  </React.Fragment>
);

export default ViewCarouselElementEditor;
