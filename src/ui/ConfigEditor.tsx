import copy from "copy-to-clipboard";
import gql from "graphql-tag";
import * as React from "react";
import { Mutation } from "react-apollo";
import { WithTranslation, withTranslation } from "react-i18next";

import { IConfiguration } from "./ConfigurationList";
import DisplayEditor from "./DisplayEditor";
import { ApolloClientsContext } from "../VirtualMonitorApolloClients";

const copyConfigurationToClipboard = (configuration: IConfiguration) => () => copy(JSON.stringify(configuration));

// tslint:disable-next-line
const emptyFunc = () => {};

interface IConfigEditorProps {
  readonly configuration: IConfiguration,
  readonly readonly?: boolean,
};

const saveConfigurationMutation = gql`
  mutation saveConfiguration($name: String!) {
    saveConfiguration(name: $name)
  }
`;

const ConfigEditor: React.StatelessComponent<IConfigEditorProps & WithTranslation> = ({ configuration, readonly, t }: IConfigEditorProps & WithTranslation) => (
  <div>
    <h1>
      <label>{t('configuration')}: </label>
      <input
        onChange={emptyFunc}
        name={'name'}
        value={configuration.name}
      />
    </h1>
    {configuration.displays.map(display => (
      <DisplayEditor
        key={display.id}
        configuration={configuration}
        display={display}
      />
    ))}
    <label>JSON: </label>
    <textarea
      value={JSON.stringify(configuration)}
      onChange={emptyFunc}
    />
    <button onClick={copyConfigurationToClipboard(configuration)} value={'Copy JSON to clipboard'}>Copy JSON to clipboard</button>
    <ApolloClientsContext.Consumer>
      {({ virtualMonitor }) =>
        (<Mutation
          mutation={saveConfigurationMutation}
          client={virtualMonitor}
        >
          {(saveConfiguration: () => void) => (
            <button onClick={() => saveConfiguration()} value={'Save'}>
              Save to server
            </button>
          )}
        </Mutation>)
      }
    </ApolloClientsContext.Consumer>
  </div>
);

ConfigEditor.defaultProps = {
  readonly: true,
};

export default withTranslation('translations')(ConfigEditor);
