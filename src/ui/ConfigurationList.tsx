import * as React from "react";
import { InjectedTranslateProps, translate } from "react-i18next";

import ConfigEditor from "src/ui/ConfigEditor";
import { ILatLon } from "src/ui/LatLonEditor";

interface ITranslatedString {
  readonly [twoLetterLanguageCode: string]: string;
};

interface IStop {
  readonly gtfsId: string;
};

export interface IDisplay {
  readonly position?: ILatLon;
  readonly title?: ITranslatedString;
  readonly stops: {
    readonly [gtfsId: string]: IStop,
  },
};

export interface IConfiguration {
  readonly name: string,
  readonly displays: {
    readonly [displayId: string]: IDisplay,
  },
  readonly position?: ILatLon;
};

export interface IConfigurations {
  readonly [configurationName: string]: IConfiguration,
};

export interface IConfigurations2 {
  [configurationName: string]: IConfiguration,
};

export interface IConfigurationListProps {
  readonly configurations: IConfigurations,
};

const ConfigurationList = ({configurations, t}: IConfigurationListProps & InjectedTranslateProps ) => (
  <div>
    {Object.values(configurations).map(configuration => (
      <ConfigEditor
        key={configuration.name}
        configuration={configuration}
      />
    ))}
  </div>
);

export default translate('translations')(ConfigurationList);
