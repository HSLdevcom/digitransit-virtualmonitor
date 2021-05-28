import * as React from "react";
import { WithTranslation, withTranslation } from "react-i18next";

import ConfigurationRetriever, { ConfigurationRetrieverResult } from '../ui/ConfigurationRetriever';
import ViewCarousel from '../ui/ViewCarousel';

export interface IConfigurationDisplayProps {
  readonly title?: string,
  readonly configurationName: string,
  readonly displayName: string,
}

const ConfigurationDisplay = ({ configurationName, displayName, t }: IConfigurationDisplayProps & WithTranslation) => {
  return (
    <ConfigurationRetriever
      name={configurationName}
    >
      {(result: ConfigurationRetrieverResult): React.ReactNode => {
        if (result.loading) {
          return (<div>{t('loading')}</div>);
        }
        
        if (!result || !result.data) {
          return (<div>
            {t('configurationRetrieveError')} - {result.error ? result.error.message : 'Unspecified error'}
          </div>);
        }

        if (!result.data.configurations || (result.data.configurations.length <= 0)) {
          return (<div>
            {t('configurationRetrieveNotFound')}
          </div>);
        }

        if (result.data.configurations.length > 1) {
          return (<div>
            {`Wat? Expected one result, got ${result.data.configurations.length} results!`}
          </div>);
        }

        const usedConfiguration = result.data.configurations.find(c => c.name === configurationName);
        if (!usedConfiguration) {
          return null;
        }

        const usedDisplay = usedConfiguration.displays.find(display => display.name === displayName) || usedConfiguration.displays[0];
        if (!usedDisplay) {
          return null;
        }

        return (
          <ViewCarousel
            viewCarousel={usedDisplay.viewCarousel}
          />
        );
      }}
    </ConfigurationRetriever>
  );
};

export default withTranslation('translations')(ConfigurationDisplay);
