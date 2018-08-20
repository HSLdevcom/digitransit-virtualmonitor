import * as React from "react";

import { IConfiguration } from "./ConfigurationList";
import DisplayEditor from "./DisplayEditor";

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
    {/* <button onClick={() => { navigator.clipboard.writeText(JSON.stringify(configuration)) }} value={'Copy JSON to clipboard'} /> */}
  </div>
);

export default ConfigEditor;
