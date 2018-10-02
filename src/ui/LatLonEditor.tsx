import { RIENumber } from "@attently/riek";
import * as React from "react";
import { InjectedTranslateProps, translate } from "react-i18next";

const openMapEnabled = true;

export interface ILatLon {
  readonly lat: number,
  readonly lon: number,
};

export interface ILatLonEditor {
  readonly editable?: boolean,
};

const dummy = () => null;

const LatLonEditor = ({ editable, lat, lon, t }: ILatLon & ILatLonEditor & InjectedTranslateProps) => (
  <div>
    <label>
      {t('latitude')}:&nbsp;
    </label>
    <RIENumber
      value={lat}
      propName={'latitude'}
      change={dummy}
      isDisabled={!editable}
    />
    &nbsp;
    <label>
      {t('longitude')}:&nbsp;
    </label>
    <RIENumber
      value={lon}
      propName={'longitude'}
      change={dummy}
      isDisabled={!editable}
    />
    {openMapEnabled
      ? (<span>&nbsp;<button>Open Map</button></span>)
      : null
    }
  </div>
);

export default translate('translations')(LatLonEditor);
