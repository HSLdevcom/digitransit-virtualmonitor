import React, { FC, useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import SiteHeader from '@hsl-fi/site-header';

const notificationAPI = '/api/user/notifications';

interface Props {
  user: any;
  favourites: any;
  config: any;
}

const BannerHSL: FC<Props> = ({ config, user, favourites }) => {
  const { t, i18n } = useTranslation();
  const [banners, setBanners] = useState([]);
  const notificationApiUrls = {
    get: `${notificationAPI}?language=${i18n.language}`,
    post: `${notificationAPI}?language=${i18n.language}`,
  };

  const changeLanguage = lang => {
    i18n.changeLanguage(lang);
    if (lang !== localStorage.getItem('lang')) {
      localStorage.setItem('lang', lang);
    }
  };

  // useEffect(() => {
  //   if (config.bannersUri) {
  //     fetch(`${config.bannersUri}language=${i18n.language}`)
  //       .then(res => res.json())
  //       .then(data => setBanners(data));
  //   }
  // }, [i18n.language]);

  const languages = [
    {
      name: 'fi',
      //url: `/fi`,
      onClick: () => {
        changeLanguage('fi');
      },
    },
    {
      name: 'sv',
      //url: `/sv`,
      onClick: () => {
        changeLanguage('sv');
      },
    },
    {
      name: 'en',
      //url: `/en`,
      onClick: () => {
        changeLanguage('en');
      },
    },
  ];

  // const { given_name, family_name } = user;

  // const initials =
  //   given_name && family_name
  //     ? given_name.charAt(0) + family_name.charAt(0)
  //     : ''; // Authenticated user's initials, will be shown next to Person-icon.

  // const url = encodeURI(location.pathname);
  // const params = location.search && location.search.substring(1);
  // const userMenu =
  //   config.allowLogin && (user.sub || user.notLogged)
  //     ? {
  //         userMenu: {
  //           isLoading: false, // When fetching for login-information, `isLoading`-property can be set to true. Spinner will be shown.
  //           isAuthenticated: !!user.sub, // If user is authenticated, set `isAuthenticated`-property to true.
  //           isSelected: false,
  //           loginUrl: `/login?url=${url}&${params}`, // Url that user will be redirect to when Person-icon is pressed and user is not logged in.
  //           initials,
  //           menuItems: [
  //             {
  //               name: intl.formatMessage({
  //                 id: 'userinfo',
  //                 defaultMessage: 'My information',
  //               }),
  //               url: `${config.URL.ROOTLINK}/omat-tiedot`,
  //               onClick: () => {},
  //             },
  //             {
  //               name: intl.formatMessage({
  //                 id: 'logout',
  //                 defaultMessage: 'Logout',
  //               }),
  //               url: '/logout',
  //               onClick: () => clearStorages(context),
  //             },
  //           ],
  //         },
  //       }
  //     : {};

  //const siteHeaderRef = useRef(null);
  //useEffect(() => siteHeaderRef.current?.fetchNotifications()[favourites]);

  return (
    <>
      <SiteHeader
        //ref={siteHeaderRef}
        hslFiUrl={config.HSLUri}
        lang={i18n.language}
        //userMenu={{}}
        languageMenu={languages}
        banners={banners}
        suggestionsApiUrl={config.suggestionsUri}
        notificationApiUrls={notificationApiUrls}
      />
    </>
  );
};

export default BannerHSL;
