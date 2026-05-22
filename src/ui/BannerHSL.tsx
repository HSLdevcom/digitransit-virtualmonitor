import React, { useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SiteHeader, UserMenu, QuickSearch } from '@hsl-fi/site-header';
import { UserContext, ConfigContext } from '../contexts';
import { logout } from '../util/logoutUtil';

const BannerHSL = () => {
  const { i18n } = useTranslation();
  const user = useContext(UserContext);
  const config = useContext(ConfigContext);
  const [, setUser] = useState(user);
  const lang = i18n.language as 'fi' | 'sv' | 'en';

  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [searchHits, setSearchHits] = useState([]);
  const [searchHitsCount, setSearchHitsCount] = useState(0);

  useEffect(() => {
    if (!searchQuery || !config.suggestionsUri) {
      setSearchHits([]);
      setSearchHitsCount(0);
      return undefined;
    }

    const timer = setTimeout(() => {
      setSearchLoading(true);
      setSearchError(false);
      fetch(
        `${
          config.suggestionsUri
        }?language=${lang}&take=5&query=${encodeURIComponent(searchQuery)}`,
      )
        .then(res => res.json())
        .then(data => {
          const hits = (data?.hits || []).map(h => ({
            id: h.id,
            title: h.title,
            type: h.type,
            link: { href: h.url },
          }));
          setSearchHits(hits);
          setSearchHitsCount(
            data?.totalHits != null ? data.totalHits : hits.length,
          );
          setSearchLoading(false);
        })
        .catch(() => {
          setSearchError(true);
          setSearchLoading(false);
        });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, lang]);

  const changeLanguage = lang => {
    i18n.changeLanguage(lang);
    if (lang !== localStorage.getItem('lang')) {
      localStorage.setItem('lang', lang);
    }
  };

  const langMenu = {
    fi: {
      href: '/',
      onClick: () => changeLanguage('fi'),
    },
    sv: {
      href: '/sv',
      onClick: () => changeLanguage('sv'),
    },
    en: {
      href: '/en',
      onClick: () => changeLanguage('en'),
    },
  };

  const { given_name, family_name } = user;

  const url = encodeURI(window.location.pathname);
  const params = location.search && location.search.substring(1);

  const userMenuNode =
    user.sub || user.notLogged ? (
      <UserMenu
        authenticated={!!user.sub}
        loading={false}
        loginLink={{ href: `hsl-login?url=${url}&${params}` }}
        logoutLink={{
          href: '/logout',
          onClick: () => logout(setUser),
        }}
        travelersAccountLink={{ href: `${config.HSLUri}/omat-tiedot` }}
        myStopsAndRoutesLink={{ href: `${config.HSLUri}/omat-reitit` }}
        name={
          given_name && family_name
            ? { givenName: given_name, familyName: family_name }
            : undefined
        }
        lang={lang}
      />
    ) : undefined;

  const searchNode = config.suggestionsUri ? (
    <QuickSearch
      searchPageLink={{ href: `${config.HSLUri}/${lang}/haku` }}
      loading={searchLoading}
      error={searchError}
      query={searchQuery}
      onQueryChange={e => setSearchQuery(e.target.value)}
      hitsCount={searchHitsCount}
      hits={searchHits}
      lang={lang}
    />
  ) : undefined;

  return (
    <SiteHeader
      baseUrl={config.HSLUri}
      lang={lang}
      langMenu={langMenu}
      userMenu={userMenuNode}
      search={searchNode}
    />
  );
};

export default BannerHSL;
