import { RIEInput } from "@attently/riek";
import * as copy from "copy-to-clipboard";
import gql from "graphql-tag";
import * as React from "react";
import { InjectedTranslateProps, translate } from "react-i18next";

import { IConfiguration } from "./ConfigurationList";
import DisplayEditor from "./DisplayEditor";
import { ApolloClientsContext } from "src/VirtualMonitorApolloClients";
import { Mutation } from "react-apollo";

const copyConfigurationToClipboard = (configuration: IConfiguration) => () => copy(JSON.stringify(configuration));

const id = () => {};

interface IConfigEditorProps {
  configuration: IConfiguration,
  readonly?: boolean,
};

const saveConfiguration = gql`
  mutation saveConfiguration($name: String!) {
    saveConfiguration(name: $name)
  }
`;

const ConfigEditor: React.StatelessComponent<IConfigEditorProps & InjectedTranslateProps> = ({ configuration, readonly, t }: IConfigEditorProps & InjectedTranslateProps) => (
  <div>
    <h1>
      <label>{t('configuration')}: </label>
      <RIEInput
        change={id}
        propName={'name'}
        value={configuration.name}
      />
    </h1>
    {Object.entries(configuration.displays).map(([key, d]) => (
      <DisplayEditor
        key={key}
        configuration={configuration}
        display={d}
      />
    ))}
    <label>JSON: </label>
    <textarea
      value={JSON.stringify(configuration)}
      onChange={id}
    />
    <button onClick={copyConfigurationToClipboard(configuration)} value={'Copy JSON to clipboard'}>Copy JSON to clipboard</button>
    <ApolloClientsContext.Consumer>
      {({ virtualMonitor }) =>
        (<Mutation
          mutation={saveConfiguration}
          client={virtualMonitor}
        >
          {saveConfiguration => (
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

export default translate('translations')(ConfigEditor);
