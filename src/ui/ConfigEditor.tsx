import * as copy from "copy-to-clipboard";
import * as React from "react";

import { IConfiguration } from "./ConfigurationList";
import DisplayEditor from "./DisplayEditor";

const copyConfigurationToClipboard = (configuration: IConfiguration) => () => copy(JSON.stringify(configuration));

const ConfigEditor = ({ configuration }: { configuration: IConfiguration }) => (
  <div>
    <h1>Konfiguraatio: {configuration.name}</h1>
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

export default ConfigEditor;
