import React = require('react');

import { IViewBase, IStopTimesView } from 'src/ui/ConfigurationList';
import StopTimesViewEditor from 'src/ui/StopTimesViewEditor';

export interface IViewEditorProps {
  readonly view: IViewBase,
};

const ViewEditor: React.SFC<IViewEditorProps> = ({ view }: IViewEditorProps) => {
  const viewWrapper = (innerView: React.ReactNode) => (
    <React.Fragment>
      <div>{`Näkymä: ${view.title ? view.title.fi : 'nimeämätön'}. Tyyppi: ${view.type}`}</div>
      {innerView}
    </React.Fragment>
  );
  switch (view.type) {
    case 'stopTimes':
      return (viewWrapper(
        <StopTimesViewEditor
          view={view as IStopTimesView}
        />
      ))
    default:
      return (
        <div>
          {`Unknown view editor with title '${view.title}' of type ${view.type}`}
        </div>
      );
  }
};

export default ViewEditor;
