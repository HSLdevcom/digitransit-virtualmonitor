import gql from "graphql-tag";
import * as React from "react";
import { Mutation } from "react-apollo";
import { InjectedTranslateProps, translate } from "react-i18next";
import { Link } from "react-router-dom";

import { IConfiguration, IDisplay } from "src/ui/ConfigurationList";
import LatLonEditor from "src/ui/LatLonEditor";

interface IDisplayEditorProps {
  configuration: IConfiguration,
  display: IDisplay,
};

const ADD_STOP = gql`
  mutation AddStop {
    addStop @client
  }
`;

// {
//   Mutation: {
//     addStop: (_: any, { configuration, display }: { configuration: string, display: string }, { cache, getCacheKey }: any) => {
//       cache.writeData();
//     },
//   },
// };

// const wrapper: MouseEvent<HTMLButtonElement> = () => {

// };

const DisplayEditor = ({configuration, display, t}: IDisplayEditorProps & InjectedTranslateProps) => (
  <div>
    <h2>
      <Link to={`/configuration/${configuration.name}/display/${display.title}`}>
        {`${t('display')} :`}
        {display.title && (Object.values(display.title).length > 0)
          ? Object.values(display.title).filter(title => title)[0] || display.title
          : display.title
        }
      </Link>
    </h2>
    {display.position
      ? (<LatLonEditor
          {...display.position}
          editable={true}
        />)
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
    <Mutation mutation={ADD_STOP}>
      {addStop => (
        <button onClick={() => addStop()}>
          {t('addStop')}
        </button>
      )}
    </Mutation>
  </div>
);

export default translate('translations')(DisplayEditor);
