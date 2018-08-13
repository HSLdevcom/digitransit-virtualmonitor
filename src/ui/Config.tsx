import * as React from "react";
import { InjectedTranslateProps, translate } from "react-i18next";
import { Link } from "react-router-dom";

interface ITranslatedString {
  readonly [twoLetterLanguageCode: string]: string;
};

interface ILonLat {
  readonly lon: number,
  readonly lat: number,
};

interface IStop {
  readonly gtfsId: string;
};

export interface IDisplay {
  readonly position?: ILonLat;
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
  readonly position?: ILonLat;
};

interface IProps {
  configuration: IConfiguration,
};

const Config = ({t, configuration}: IProps & InjectedTranslateProps ) => (
  <div>
    <h1>Konfiguraatio: {configuration.name}</h1>
    {Object.entries(configuration.displays).map(([key, d]) => (
      <div>
        {d.title && (Object.values(d.title).length > 0)
          ? <h2>Display: {Object.values(d.title).filter(title => title)[0] || key}</h2>
          : <h2>Display: {key}</h2>
        }
        {d.position
          ? (<div>
              Lon: {d.position.lon}&nbsp;
              Lat: {d.position.lat}
            </div>)
          : null
        }
        <ul>
          {Object.values(d.stops).map(s => (
            <div>
              <Link
                to={`/stop/${s.gtfsId}`}
              >
                Stop {s.gtfsId}
              </Link>              
            </div>
          ))}
        </ul>
      </div>
    ))}
  </div>
);

export default translate('translations')(Config);
