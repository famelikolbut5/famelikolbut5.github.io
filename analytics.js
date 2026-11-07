(() => {
  'use strict';
  const storageKey = 'portfolio-analytics-consent';
  const metrikaId = 113735381;
  const googleId = 'G-Z33T96QBNJ';
  const production = location.hostname === 'arturkolesnikov.online';
  let consent = readConsent();
  let started = false;
  let settingsTrigger = null;

  function readConsent() {
    try {
      const value = localStorage.getItem(storageKey);
      return value === 'granted' || value === 'denied' ? value : null;
    } catch { return null; }
  }
  function addScript(src) {
    const script = document.createElement('script');
    script.async = true;
    script.src = src;
    document.head.append(script);
  }
  function startAnalytics() {
    if (!production || consent !== 'granted' || started) return;
    started = true;
    const pageUrl = location.origin + location.pathname;
    let referrer = '';
    try { referrer = new URL(document.referrer).origin; } catch {}
    window.ym = window.ym || function () { (window.ym.a = window.ym.a || []).push(arguments); };
    window.ym.l = Date.now();
    window.ym(metrikaId, 'init', {
      clickmap: true, accurateTrackBounce: true, trackLinks: true,
      webvisor: false, url: pageUrl, referrer
    });
    addScript('https://mc.yandex.ru/metrika/tag.js?id=' + metrikaId);
    if (googleId) {
      window['ga-disable-' + googleId] = false;
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('consent', 'default', {
        analytics_storage: 'granted', ad_storage: 'denied',
        ad_user_data: 'denied', ad_personalization: 'denied'
      });
      window.gtag('js', new Date());
      window.gtag('config', googleId, {
        page_location: pageUrl, page_referrer: referrer,
        allow_google_signals: false, allow_ad_personalization_signals: false
      });
      addScript('https://www.googletagmanager.com/gtag/js?id=' + googleId);
    }
  }
  function clearAnalyticsStorage() {
    const analyticsCookie = /^(?:_ym_|_ga(?:_|$)|_gid$|_gat(?:_|$))/;
    for (const entry of document.cookie.split(';')) {
      const name = entry.trim().split('=')[0];
      if (!analyticsCookie.test(name)) continue;
      for (const domain of ['', location.hostname, '.' + location.hostname]) {
        document.cookie = name + '=; Max-Age=0; Path=/; SameSite=Lax' + (domain ? '; Domain=' + domain : '');
      }
    }
    try {
      for (const key of Object.keys(localStorage)) {
        if (key.startsWith('_ym')) localStorage.removeItem(key);
      }
    } catch {}
  }
  function stopAnalytics() {
    if (googleId) window['ga-disable-' + googleId] = true;
    try {
      if (started && typeof window.ym === 'function') window.ym(metrikaId, 'destruct');
    } catch {}

    clearAnalyticsStorage();
    // Reload unloads provider listeners and timers after a saved withdrawal.
    if (started) location.reload();
  }

  const banner = document.createElement('section');
  banner.className = 'analytics-notice';
  banner.hidden = true;
  banner.setAttribute('aria-labelledby', 'analytics-notice-title');
  banner.innerHTML = '<h2 id="analytics-notice-title">Cookie</h2>' +
    '<p>С вашего согласия сайт использует cookie Яндекс Метрики и Google Analytics для статистики посещений. <a href="/privacy/">Подробнее</a></p>' +
    '<div class="analytics-actions"><button type="button" data-consent="granted">Принять</button><button type="button" data-consent="denied">Отклонить</button></div>';
  document.body.append(banner);
  function updateSettingsLabel() {
    const state = consent === 'granted' ? 'статистические cookie разрешены' : 'статистические cookie отключены';
    document.querySelectorAll('[data-analytics-settings]').forEach(button => {
      button.setAttribute('aria-label', 'Cookie, ' + state);
    });
  }
  function choose(value) {
    consent = value;
    try { localStorage.setItem(storageKey, value); } catch {}
    banner.hidden = true;
    updateSettingsLabel();
    if (settingsTrigger && settingsTrigger.isConnected) settingsTrigger.focus({ preventScroll: true });
    if (value === 'granted') startAnalytics();
    else stopAnalytics();
  }
  banner.querySelectorAll('[data-consent]').forEach(button => {
    button.addEventListener('click', () => choose(button.dataset.consent));
  });
  document.querySelectorAll('[data-analytics-settings]').forEach(button => {
    button.addEventListener('click', () => {
      settingsTrigger = button;
      banner.hidden = false;
      banner.querySelector('[data-consent]').focus({ preventScroll: true });
    });
  });
  document.addEventListener('click', event => {
    if (!production || !started || consent !== 'granted') return;
    const target = event.target.closest('[data-contact],[data-copy]');
    if (!target) return;
    const channel = target.dataset.contact || 'max';
    if (!['telegram', 'email', 'phone', 'max'].includes(channel)) return;
    window.ym(metrikaId, 'reachGoal', 'contact_' + channel);
    if (googleId && typeof window.gtag === 'function') {
      window.gtag('event', 'contact_click', { contact_method: channel });
    }
  });
  window.addEventListener('storage', event => {
    if (event.key !== storageKey && event.key !== null) return;
    consent = readConsent();
    banner.hidden = consent !== null;
    updateSettingsLabel();
    if (consent === 'granted') startAnalytics();
    else stopAnalytics();
  });
  updateSettingsLabel();
  banner.hidden = consent !== null;
  if (consent === 'granted') startAnalytics();
  else clearAnalyticsStorage();
})();
