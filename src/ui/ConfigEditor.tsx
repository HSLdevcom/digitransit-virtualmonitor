import { RIEInput } from "@attently/riek";
import * as copy from "copy-to-clipboard";
import * as React from "react";
import { InjectedTranslateProps, translate } from "react-i18next";

import { IConfiguration } from "./ConfigurationList";
import DisplayEditor from "./DisplayEditor";

const copyConfigurationToClipboard = (configuration: IConfiguration) => () => copy(JSON.stringify(configuration));

const id = () => null;

interface IConfigEditorProps {
  configuration: IConfiguration,
};

const ConfigEditor = ({ configuration, t }: IConfigEditorProps & InjectedTranslateProps) => (
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
    <textarea value={JSON.stringify(configuration)} />
    <button onClick={copyConfigurationToClipboard(configuration)} value={'Copy JSON to clipboard'}>Copy JSON to clipboard</button>
  </div>
);

export default translate('translations')(ConfigEditor);
