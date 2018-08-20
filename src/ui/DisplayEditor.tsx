import * as React from "react";
import { Link } from "react-router-dom";

import { IConfiguration, IDisplay } from "./ConfigurationList";

const DisplayEditor = ({configuration, display}: { configuration: IConfiguration, display: IDisplay }) => (
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
      ? (<div>
          Lon: {display.position.lon}&nbsp;
          Lat: {display.position.lat}
        </div>)
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

export default DisplayEditor;
