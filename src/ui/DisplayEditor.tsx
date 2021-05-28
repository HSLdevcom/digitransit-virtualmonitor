import gql from "graphql-tag";
import * as React from "react";
import { Mutation } from "react-apollo";
import { WithTranslation, withTranslation } from "react-i18next";
import Async from 'react-promise';
import { Link } from "react-router-dom";

import { IConfiguration, IDisplay } from "./ConfigurationList";
import { pairs } from './DisplayUrlCompression';
import LatLonEditor from "./LatLonEditor";
import ViewCarouselElementEditor from './ViewCarouselElementEditor';
import { ApolloClientsContext } from "../VirtualMonitorApolloClients";

import './DisplayEditor.scss';

interface IDisplayEditorProps {
  readonly configuration?: IConfiguration,
  readonly display?: IDisplay,
}

interface IDisplayEditorPropsDefaulted extends IDisplayEditorProps {
  readonly display: IDisplay,
}

const addViewCarouselMutation = gql`
  mutation addViewCarouselElement($displayId: ID!, $viewCarouselElement: SViewWithDisplaySeconds) {
    addViewCarouselElement(displayId: $displayId, viewCarouselElement: $viewCarouselElement) @client {
      id
      displaySeconds
      view {
        id
        type
        ...on StopTimesView {
          title {
            fi
          }
          stops
        }
      }
    }
  }
`;

const DisplayEditor: React.SFC<IDisplayEditorProps & WithTranslation> = ({configuration, display, t}: IDisplayEditorPropsDefaulted & WithTranslation) => (
  <div>
    <h2>
      {(configuration)
        ? (<Link to={`/configuration/${configuration!.name}/display/${display.name}`}>
          {`${t('display')}: `}
          {t(display.name) || configuration!.name}
        </Link>)
        : <span>{t(display.name)}</span>
      }
    </h2>
    {display.position
      ? (<LatLonEditor
          {...display.position!}
          editable={true}
        />)
      : (<button
          disabled={true}
          style={{ display: 'none' }} // This feature isn't currently used.
        >
          {t('displayEditorDefinePosition')}
        </button>)
    }
    <ul id="viewCarouselElement">
      {display.viewCarousel.map(viewCarouselElement => (
        <li
          key={viewCarouselElement.view.id}
          className="ViewCarouselElementEditor"
        >
          <ViewCarouselElementEditor
            viewCarouselElement={viewCarouselElement}
          />
        </li>
      ))}
    </ul>

    <hr/>
    <hr/>
    <Async
      promise={pairs.v0.pack(display)}
      then={(packedUrl: string) => (
        <Link to={`/urld/v0/${encodeURIComponent(packedUrl)}`}>
          <button>{t('displayEditorStaticLink')}</button>
        </Link>
      )}
    />
    <ApolloClientsContext.Consumer>
      {({ virtualMonitor }) =>
        (<Mutation
          mutation={addViewCarouselMutation}
          client={virtualMonitor}
        >
          {(addViewCarousel: (arg0: { variables: { displayId: string | undefined; }; }) => void) => (
            <button onClick={() => addViewCarousel({ variables: { displayId: display.id } })}>
              {t('displayEditorNewView')}
            </button>
          )}
        </Mutation>)
      }
    </ApolloClientsContext.Consumer>
  </div>
);

DisplayEditor.defaultProps = {
  display: {
    id: 'Temporary',
    name: 'Temporary Display',
    viewCarousel: [],
  },
};

export default withTranslation('translations')(DisplayEditor);
