import gql from "graphql-tag";
import * as React from "react";
import { Mutation } from "react-apollo";
import { InjectedTranslateProps, translate } from "react-i18next";
import { Link } from "react-router-dom";

import { IConfiguration, IDisplay } from "src/ui/ConfigurationList";
import LatLonEditor from "src/ui/LatLonEditor";
import { ApolloClientsContext } from "src/VirtualMonitorApolloClients";
import ViewCarouselElementEditor from 'src/ui/ViewCarouselElementEditor';

interface IDisplayEditorProps {
  configuration?: IConfiguration,
  display?: IDisplay,
};

const ADD_STOP = gql`
  mutation AddStop {
    addStop @client
  }
`;

interface Foo extends IDisplayEditorProps {
  display: IDisplay,
};

// {
//   Mutation: {
//     addStop: (_: any, { configuration, display }: { configuration: string, display: string }, { cache, getCacheKey }: any) => {
//       cache.writeData();
//     },
//   },
// };

// const wrapper: MouseEvent<HTMLButtonElement> = () => {

// };

const DisplayEditor: React.SFC<IDisplayEditorProps & InjectedTranslateProps> = ({configuration, display, t}: Foo & InjectedTranslateProps) => (
  <div>
    <h2>
      {(configuration)
        ? (<Link to={`/configuration/${configuration!.name}/display/${display.name}`}>
          {`${t('display')}: `}
          {display.name || configuration!.name}
        </Link>)
        : <span>{display.name}</span>
      }
    </h2>
    {display.position
      ? (<LatLonEditor
          {...display.position!}
          editable={true}
        />)
      : (<button>
          Määritä sijainti
        </button>)
    }
    <ul>
      {display.viewCarousel.map(viewCarouselElement => (
        <li>
          <ViewCarouselElementEditor
            viewCarouselElement={viewCarouselElement}
          />
        </li>
      ))}
    </ul>
    <button>
      Lisää uusi pysäkkinäkymä karuselliin.
    </button>
    <ApolloClientsContext.Consumer>
      {({ virtualMonitor }) =>
        (<Mutation
          mutation={ADD_STOP}
          client={virtualMonitor}
        >
          {addStop => (
            <button onClick={() => addStop()}>
              {t('prepareStop')}
            </button>
          )}
        </Mutation>)
      }
    </ApolloClientsContext.Consumer>
  </div>
);

DisplayEditor.defaultProps = {
  display: {
    name: 'Uusi näyttö',
    viewCarousel: [],
  },
};

export default translate('translations')(DisplayEditor);
