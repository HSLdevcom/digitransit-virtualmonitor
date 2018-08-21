import * as React from "react";
import { InjectedTranslateProps, translate } from "react-i18next";
import { Link } from "react-router-dom";

import { IConfiguration, IDisplay } from "src/ui/ConfigurationList";
import LatLonEditor from "src/ui/LatLonEditor";

interface IDisplayEditorProps {
  configuration: IConfiguration,
  display: IDisplay,
};

const DisplayEditor = ({configuration, display}: IDisplayEditorProps & InjectedTranslateProps) => (
  <div>
    <h2>
      <Link to={`/configuration/${configuration.name}/display/${display.title}`}>
        {'Display: '}
        {display.title && (Object.values(display.title).length > 0)
          ? Object.values(display.title).filter(title => title)[0] || display.title
          : display.title
        }
      </Link>
    </h2>
    {display.position
      ? (<LatLonEditor {...display.position} />)
      : null
    }
    <ul>
      {Object.values(display.stops).map(s => (
        <div key={s.gtfsId}>
          <Link
            to={`/stop/${s.gtfsId}`}
          >
            Stop {s.gtfsId}
          </Link>              
        </div>
      ))}
    </ul>
  </div>
);

export default translate('translations')(DisplayEditor);
