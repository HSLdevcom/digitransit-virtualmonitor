import { RIEInput } from "@attently/riek";
import * as copy from "copy-to-clipboard";
import gql from "graphql-tag";
import * as React from "react";
import { Mutation } from "react-apollo";
import { InjectedTranslateProps, translate } from "react-i18next";

import { IConfiguration } from "src/ui/ConfigurationList";
import DisplayEditor from "src/ui/DisplayEditor";
import { ApolloClientsContext } from "src/VirtualMonitorApolloClients";

const copyConfigurationToClipboard = (configuration: IConfiguration) => () => copy(JSON.stringify(configuration));

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

const ConfigEditor: React.StatelessComponent<IConfigEditorProps & InjectedTranslateProps> = ({ configuration, readonly, t }: IConfigEditorProps & InjectedTranslateProps) => (
  <div>
    <h1>
      <label>{t('configuration')}: </label>
      <RIEInput
        change={emptyFunc}
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
      onChange={emptyFunc}
    />
    <button onClick={copyConfigurationToClipboard(configuration)} value={'Copy JSON to clipboard'}>Copy JSON to clipboard</button>
    <ApolloClientsContext.Consumer>
      {({ virtualMonitor }) =>
        (<Mutation
          mutation={saveConfigurationMutation}
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
