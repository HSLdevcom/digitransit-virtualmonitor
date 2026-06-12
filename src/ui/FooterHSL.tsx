import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { SiteFooter, FooterData } from '@hsl-fi/site-footer';
import { ConfigContext } from '../contexts';

const getFooterData = (
  baseUrl: string,
  lang: 'fi' | 'sv' | 'en',
): FooterData => {
  switch (lang) {
    case 'sv':
      return {
        column1: {
          title: 'Resor',
          links: [
            { label: 'Reseplanerare', href: `${baseUrl}sv/reseplanerare` },
            {
              label: 'Linjer och karta',
              href: `${baseUrl}/sv/linjer-och-karta`,
            },
            { label: 'Tidtabeller', href: `${baseUrl}/sv/tidtabeller` },
            {
              label: 'Hållplatser och stationer',
              href: `${baseUrl}/sv/hallplatser`,
            },
          ],
        },
        column2: {
          title: 'Biljetter och kort',
          links: [
            { label: 'Köp biljett', href: `${baseUrl}/sv/biljetter` },
            { label: 'Resekort', href: `${baseUrl}/sv/biljetter/resekort` },
            {
              label: 'Alla biljettalternativ',
              href: `${baseUrl}/sv/biljetter/alla-biljettalternativ`,
            },
            {
              label: 'Biljetter för företag',
              href: `${baseUrl}/sv/for-foretag/biljetter-for-foretag`,
            },
          ],
        },
        column3: {
          title: 'HRT',
          links: [
            { label: 'Om HRT', href: `${baseUrl}/sv/om-hrt` },
            {
              label: 'Lediga tjänster',
              href: `${baseUrl}/sv/lediga-tjanster`,
            },
            { label: 'Media', href: `${baseUrl}/sv/media` },
            { label: 'För företag', href: `${baseUrl}/sv/for-foretag` },
          ],
        },
        column4: {
          title: 'Applikationer och data',
          links: [
            { label: 'HRT-appen', href: `${baseUrl}/sv/applikationer` },
            { label: 'För utvecklare', href: `${baseUrl}/sv/for-utvecklare` },
            { label: 'Öppen data', href: `${baseUrl}/sv/oppen-data` },
          ],
        },
        secondaryLinks: {
          contantInfoLink: {
            href: `${baseUrl}/sv/hrt/hrt-som-organisation/kontaktuppgifter`,
          },
          paymentMethodsLink: {
            href: `${baseUrl}/sv/hrt/betalsatt`,
          },
          privacyLink: { href: `${baseUrl}/sv/hrt/dataskydd` },
          cookieSettingsLink: { href: `${baseUrl}/sv/hrt/kakor` },
          termsOfUseLink: { href: `${baseUrl}/sv/hrt/anvandarvillkoren` },
          accessibilityStatementLink: {
            href: `${baseUrl}/sv/hrt/tillganglighet`,
          },
        },
      };
    case 'en':
      return {
        column1: {
          title: 'Travelling',
          links: [
            {
              label: 'Journey planner',
              href: `${baseUrl}/en/journey-planner`,
            },
            { label: 'Lines and map', href: `${baseUrl}/en/lines-and-map` },
            { label: 'Timetables', href: `${baseUrl}/en/timetables` },
            { label: 'Stops and stations', href: `${baseUrl}/en/stops` },
          ],
        },
        column2: {
          title: 'Tickets and cards',
          links: [
            { label: 'Buy a ticket', href: `${baseUrl}/en/tickets` },
            {
              label: 'Travel card',
              href: `${baseUrl}/en/tickets/travel-card`,
            },
            {
              label: 'All ticket options',
              href: `${baseUrl}/en/tickets/all-ticket-options`,
            },
            {
              label: 'Tickets for companies',
              href: `${baseUrl}/en/for-companies/tickets-for-companies`,
            },
          ],
        },
        column3: {
          title: 'HSL',
          links: [
            { label: 'About HSL', href: `${baseUrl}/en/about-hsl` },
            { label: 'Jobs', href: `${baseUrl}/en/jobs` },
            { label: 'Media', href: `${baseUrl}/en/media` },
            { label: 'For companies', href: `${baseUrl}/en/for-companies` },
          ],
        },
        column4: {
          title: 'Apps and data',
          links: [
            { label: 'HSL app', href: `${baseUrl}/en/applications` },
            { label: 'For developers', href: `${baseUrl}/en/for-developers` },
            { label: 'Open data', href: `${baseUrl}/en/open-data` },
          ],
        },
        secondaryLinks: {
          contantInfoLink: {
            href: `${baseUrl}/en/hsl/hsl-as-an-organization/contacts`,
          },
          paymentMethodsLink: {
            href: `${baseUrl}/en/hsl/payment-methods`,
          },
          privacyLink: { href: `${baseUrl}/en/hsl/privacy-policy` },
          cookieSettingsLink: { href: `${baseUrl}/en/hsl/cookies` },
          termsOfUseLink: { href: `${baseUrl}/en/hsl/terms-of-use` },
          accessibilityStatementLink: {
            href: `${baseUrl}/en/hsl/accessibility-statement`,
          },
        },
      };
    default:
      return {
        column1: {
          title: 'Matkustaminen',
          links: [
            { label: 'Reittiopas', href: `${baseUrl}/reittiopas` },
            {
              label: 'Linjat ja kartta',
              href: `${baseUrl}/linjat-ja-kartta`,
            },
            { label: 'Aikataululistat', href: `${baseUrl}/aikataululistat` },
            { label: 'Pysäkit ja asemat', href: `${baseUrl}/pysakit` },
          ],
        },
        column2: {
          title: 'Liput ja kortit',
          links: [
            { label: 'Osta lippu', href: `${baseUrl}/liput` },
            {
              label: 'Yhteyskortti',
              href: `${baseUrl}/liput/yhteyskortti`,
            },
            {
              label: 'Kaikki lippuvaihtoehdot',
              href: `${baseUrl}/liput/kaikki-lippuvaihtoehdot`,
            },
            {
              label: 'Liput yrityksille',
              href: `${baseUrl}/yrityksille/liput-yrityksille`,
            },
          ],
        },
        column3: {
          title: 'HSL',
          links: [
            { label: 'HSL:stä', href: `${baseUrl}/hsl` },
            {
              label: 'Avoimet työpaikat',
              href: `${baseUrl}/avoimet-tyopaikat`,
            },
            { label: 'Media', href: `${baseUrl}/media` },
            { label: 'Yrityksille', href: `${baseUrl}/yrityksille` },
          ],
        },
        column4: {
          title: 'Sovellukset ja data',
          links: [
            { label: 'HSL-sovellus', href: `${baseUrl}/sovellukset` },
            { label: 'Kehittäjille', href: `${baseUrl}/kehittajille` },
            { label: 'Avoin data', href: `${baseUrl}/avoin-data` },
          ],
        },
        secondaryLinks: {
          contantInfoLink: { href: `${baseUrl}/yhteystiedot` },
          paymentMethodsLink: { href: `${baseUrl}/maksutavat` },
          privacyLink: { href: `${baseUrl}/hsl/tietosuoja` },
          cookieSettingsLink: { href: `${baseUrl}/hsl/evasteet` },
          termsOfUseLink: { href: `${baseUrl}/hsl/kayttoehdot` },
          accessibilityStatementLink: { href: `${baseUrl}/hsl/saavutettavuus` },
        },
      };
  }
};

const FooterHSL = () => {
  const { i18n } = useTranslation();
  const config = useContext(ConfigContext);
  const lang = i18n.language as 'fi' | 'sv' | 'en';
  const data = getFooterData(config.HSLUri, lang);

  return (
    <SiteFooter
      baseUrl={config.HSLUri}
      variant="compact"
      lang={lang}
      data={data}
      cookieSettingsButtonProps={{
        onClick: () =>
          (window as any).CookieConsent?.renew &&
          (window as any).CookieConsent.renew(),
      }}
    />
  );
};

export default FooterHSL;
