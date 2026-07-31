import React, { useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SiteHeader, UserMenu, QuickSearch } from '@hsl-fi/site-header';
import { AlertTriangleFilled } from '@hsl-fi/icons';
import { UserContext, ConfigContext } from '../contexts';
import { logout } from '../util/logoutUtil';

const NOTIFICATION_API = '/api/user/notifications';

interface ICrisisBanner {
  body: string;
  priority: 'Primary' | 'Secondary';
}

const BannerHSL = () => {
  const { i18n } = useTranslation();
  const user = useContext(UserContext);
  const config = useContext(ConfigContext);
  const lang = i18n.language as 'fi' | 'sv' | 'en';

  const [banners, setBanners] = useState<ICrisisBanner[]>([]);

  useEffect(() => {
    if (!config.useCookiesPrompt) return;
    // Load HSL's Cookie Information consent platform. It defines
    // window.CookieConsent, whose renew() reopens the consent dialog from the
    // footer "Cookie settings" button. Without this script the button is inert.
    let script = document.getElementById(
      'CookieConsent',
    ) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = 'CookieConsent';
      script.src = 'https://policy.app.cookieinformation.com/uc.js';
      script.type = 'text/javascript';
      script.setAttribute('data-gcm-version', '2.0');
      document.head.appendChild(script);
    }
    script.setAttribute('data-culture', lang.toUpperCase());
  }, [config.useCookiesPrompt, lang]);

  useEffect(() => {
    if (!config.bannersUri) return undefined;
    const controller = new AbortController();
    fetch(`${config.bannersUri}language=${lang}`, { signal: controller.signal })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setBanners(data);
        }
      })
      .catch(err => {
        if (err.name === 'AbortError') return;
        setBanners([]);
      });
    return () => controller.abort();
  }, [lang]);

  const [userNotifications, setUserNotifications] = useState({
    unreadCount: 0,
    loading: false,
    error: false,
    notifications: [],
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    refetch: () => {
      /* noop until first fetch */
    },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onOpen: () => {
      /* noop until first fetch */
    },
  });

  useEffect(() => {
    if (!user.sub) return undefined;

    let controller = new AbortController();

    const markAsRead = () => {
      fetch(`${NOTIFICATION_API}?language=${lang}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        signal: controller.signal,
      })
        .then(() => {
          setUserNotifications(prev => ({ ...prev, unreadCount: 0 }));
        })
        .catch(() => {
          /* ignore mark-as-read errors */
        });
    };

    const fetchNotifications = () => {
      controller = new AbortController();
      setUserNotifications(prev => ({
        ...prev,
        loading: true,
        error: false,
      }));
      fetch(`${NOTIFICATION_API}?language=${lang}`, {
        signal: controller.signal,
      })
        .then(res => res.json())
        .then(data => {
          setUserNotifications({
            unreadCount: data?.unreadCount || 0,
            loading: false,
            error: false,
            notifications: (data?.notifications || []).map(n => ({
              ...n,
              link: n.link || {},
            })),
            refetch: fetchNotifications,
            onOpen: markAsRead,
          });
        })
        .catch(err => {
          if (err.name === 'AbortError') return;
          setUserNotifications(prev => ({
            ...prev,
            loading: false,
            error: true,
          }));
        });
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => {
      clearInterval(interval);
      controller.abort();
    };
  }, [user.sub, lang]);

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

    const controller = new AbortController();
    const timer = setTimeout(() => {
      setSearchLoading(true);
      setSearchError(false);
      fetch(
        `${
          config.suggestionsUri
        }?language=${lang}&take=5&query=${encodeURIComponent(searchQuery)}`,
        { signal: controller.signal },
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
        .catch(err => {
          if (err.name === 'AbortError') return;
          setSearchError(true);
          setSearchLoading(false);
        });
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchQuery, lang]);

  const changeLanguage = (newLang: string) => {
    i18n.changeLanguage(newLang);
    if (newLang !== localStorage.getItem('lang')) {
      localStorage.setItem('lang', newLang);
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
  const params = window.location.search && window.location.search.substring(1);

  const userResolved = !!user.sub || !!user.notLogged;

  const userMenuNode = (
    <UserMenu
      authenticated={!!user.sub}
      loading={!userResolved}
      loginLink={{ href: `hsl-login?url=${url}&${params}` }}
      logoutLink={{
        href: '/logout',
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onClick: () => logout(() => {}),
      }}
      travelersAccountLink={{ href: `${config.HSLUri}/omat-tiedot` }}
      myStopsAndRoutesLink={{ href: `${config.HSLUri}/omat-reitit` }}
      name={
        given_name && family_name
          ? { givenName: given_name, familyName: family_name }
          : undefined
      }
      userNotifications={user.sub ? userNotifications : undefined}
      lang={lang}
    />
  );

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

  const displayBanners: ICrisisBanner[] =
    config.showStaticCrisisBanners && config.staticCrisisBanners
      ? config.staticCrisisBanners
      : banners;

  return (
    <>
      {displayBanners.map((banner, i) => (
        <div
          key={i}
          className={`crisis-banner crisis-banner--${
            banner.priority === 'Primary' ? 'primary' : 'secondary'
          }`}
        >
          {banner.priority === 'Primary' && (
            <div className="crisis-banner__icon">
              <AlertTriangleFilled
                width="19"
                fill="#ffffff"
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                {...({} as any)}
              />
            </div>
          )}
          <div dangerouslySetInnerHTML={{ __html: banner.body }} />
        </div>
      ))}
      <SiteHeader
        baseUrl={config.HSLUri}
        lang={lang}
        langMenu={langMenu}
        userMenu={userMenuNode}
        search={searchNode}
      />
    </>
  );
};

export default BannerHSL;
