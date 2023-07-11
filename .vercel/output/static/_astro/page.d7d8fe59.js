var Q = '@vercel/analytics',
  W = '0.1.11',
  X = () => {
    window.va ||
      (window.va = function (...t) {
        (window.vaq = window.vaq || []).push(t);
      });
  };
function Z() {
  return typeof window < 'u';
}
function $() {
  try {
    const e = 'production';
    return e === 'development' || e === 'test';
  } catch {
    return !1;
  }
}
function z(e = 'auto') {
  return e === 'auto' ? ($() ? 'development' : 'production') : e;
}
var G = (e = { debug: !0 }) => {
    var t;
    if (!Z()) return;
    const n = z(e.mode);
    X(), e.beforeSend && ((t = window.va) == null || t.call(window, 'beforeSend', e.beforeSend));
    const i =
      n === 'development' ? 'https://cdn.vercel-insights.com/v1/script.debug.js' : '/_vercel/insights/script.js';
    if (document.head.querySelector(`script[src*="${i}"]`)) return;
    const r = document.createElement('script');
    (r.src = i),
      (r.defer = !0),
      r.setAttribute('data-sdkn', Q),
      r.setAttribute('data-sdkv', W),
      n === 'development' && e.debug === !1 && r.setAttribute('data-debug', 'false'),
      document.head.appendChild(r);
  },
  v,
  g,
  j,
  y,
  H = -1,
  p = function (e) {
    addEventListener(
      'pageshow',
      function (t) {
        t.persisted && ((H = t.timeStamp), e(t));
      },
      !0
    );
  },
  L = function () {
    return window.performance && performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
  },
  T = function () {
    var e = L();
    return (e && e.activationStart) || 0;
  },
  d = function (e, t) {
    var n = L(),
      i = 'navigate';
    return (
      H >= 0
        ? (i = 'back-forward-cache')
        : n &&
          (document.prerendering || T() > 0
            ? (i = 'prerender')
            : document.wasDiscarded
            ? (i = 'restore')
            : n.type && (i = n.type.replace(/_/g, '-'))),
      {
        name: e,
        value: t === void 0 ? -1 : t,
        rating: 'good',
        delta: 0,
        entries: [],
        id: 'v3-'.concat(Date.now(), '-').concat(Math.floor(8999999999999 * Math.random()) + 1e12),
        navigationType: i,
      }
    );
  },
  b = function (e, t, n) {
    try {
      if (PerformanceObserver.supportedEntryTypes.includes(e)) {
        var i = new PerformanceObserver(function (r) {
          Promise.resolve().then(function () {
            t(r.getEntries());
          });
        });
        return i.observe(Object.assign({ type: e, buffered: !0 }, n || {})), i;
      }
    } catch {}
  },
  f = function (e, t, n, i) {
    var r, o;
    return function (c) {
      t.value >= 0 &&
        (c || i) &&
        ((o = t.value - (r || 0)) || r === void 0) &&
        ((r = t.value),
        (t.delta = o),
        (t.rating = (function (u, a) {
          return u > a[1] ? 'poor' : u > a[0] ? 'needs-improvement' : 'good';
        })(t.value, n)),
        e(t));
    };
  },
  C = function (e) {
    requestAnimationFrame(function () {
      return requestAnimationFrame(function () {
        return e();
      });
    });
  },
  A = function (e) {
    var t = function (n) {
      (n.type !== 'pagehide' && document.visibilityState !== 'hidden') || e(n);
    };
    addEventListener('visibilitychange', t, !0), addEventListener('pagehide', t, !0);
  },
  k = function (e) {
    var t = !1;
    return function (n) {
      t || (e(n), (t = !0));
    };
  },
  l = -1,
  I = function () {
    return document.visibilityState !== 'hidden' || document.prerendering ? 1 / 0 : 0;
  },
  w = function (e) {
    document.visibilityState === 'hidden' && l > -1 && ((l = e.type === 'visibilitychange' ? e.timeStamp : 0), J());
  },
  P = function () {
    addEventListener('visibilitychange', w, !0), addEventListener('prerenderingchange', w, !0);
  },
  J = function () {
    removeEventListener('visibilitychange', w, !0), removeEventListener('prerenderingchange', w, !0);
  },
  D = function () {
    return (
      l < 0 &&
        ((l = I()),
        P(),
        p(function () {
          setTimeout(function () {
            (l = I()), P();
          }, 0);
        })),
      {
        get firstHiddenTime() {
          return l;
        },
      }
    );
  },
  E = function (e) {
    document.prerendering
      ? addEventListener(
          'prerenderingchange',
          function () {
            return e();
          },
          !0
        )
      : e();
  },
  B = [1800, 3e3],
  O = function (e, t) {
    (t = t || {}),
      E(function () {
        var n,
          i = D(),
          r = d('FCP'),
          o = b('paint', function (c) {
            c.forEach(function (u) {
              u.name === 'first-contentful-paint' &&
                (o.disconnect(),
                u.startTime < i.firstHiddenTime &&
                  ((r.value = Math.max(u.startTime - T(), 0)), r.entries.push(u), n(!0)));
            });
          });
        o &&
          ((n = f(e, r, B, t.reportAllChanges)),
          p(function (c) {
            (r = d('FCP')),
              (n = f(e, r, B, t.reportAllChanges)),
              C(function () {
                (r.value = performance.now() - c.timeStamp), n(!0);
              });
          }));
      });
  },
  F = [0.1, 0.25],
  K = function (e, t) {
    (t = t || {}),
      O(
        k(function () {
          var n,
            i = d('CLS', 0),
            r = 0,
            o = [],
            c = function (a) {
              a.forEach(function (s) {
                if (!s.hadRecentInput) {
                  var Y = o[0],
                    N = o[o.length - 1];
                  r && s.startTime - N.startTime < 1e3 && s.startTime - Y.startTime < 5e3
                    ? ((r += s.value), o.push(s))
                    : ((r = s.value), (o = [s]));
                }
              }),
                r > i.value && ((i.value = r), (i.entries = o), n());
            },
            u = b('layout-shift', c);
          u &&
            ((n = f(e, i, F, t.reportAllChanges)),
            A(function () {
              c(u.takeRecords()), n(!0);
            }),
            p(function () {
              (r = 0),
                (i = d('CLS', 0)),
                (n = f(e, i, F, t.reportAllChanges)),
                C(function () {
                  return n();
                });
            }),
            setTimeout(n, 0));
        })
      );
  },
  h = { passive: !0, capture: !0 },
  ee = new Date(),
  _ = function (e, t) {
    v || ((v = t), (g = e), (j = new Date()), V(removeEventListener), U());
  },
  U = function () {
    if (g >= 0 && g < j - ee) {
      var e = {
        entryType: 'first-input',
        name: v.type,
        target: v.target,
        cancelable: v.cancelable,
        startTime: v.timeStamp,
        processingStart: v.timeStamp + g,
      };
      y.forEach(function (t) {
        t(e);
      }),
        (y = []);
    }
  },
  te = function (e) {
    if (e.cancelable) {
      var t = (e.timeStamp > 1e12 ? new Date() : performance.now()) - e.timeStamp;
      e.type == 'pointerdown'
        ? (function (n, i) {
            var r = function () {
                _(n, i), c();
              },
              o = function () {
                c();
              },
              c = function () {
                removeEventListener('pointerup', r, h), removeEventListener('pointercancel', o, h);
              };
            addEventListener('pointerup', r, h), addEventListener('pointercancel', o, h);
          })(t, e)
        : _(t, e);
    }
  },
  V = function (e) {
    ['mousedown', 'keydown', 'touchstart', 'pointerdown'].forEach(function (t) {
      return e(t, te, h);
    });
  },
  M = [100, 300],
  ne = function (e, t) {
    (t = t || {}),
      E(function () {
        var n,
          i = D(),
          r = d('FID'),
          o = function (a) {
            a.startTime < i.firstHiddenTime && ((r.value = a.processingStart - a.startTime), r.entries.push(a), n(!0));
          },
          c = function (a) {
            a.forEach(o);
          },
          u = b('first-input', c);
        (n = f(e, r, M, t.reportAllChanges)),
          u &&
            A(
              k(function () {
                c(u.takeRecords()), u.disconnect();
              })
            ),
          u &&
            p(function () {
              var a;
              (r = d('FID')),
                (n = f(e, r, M, t.reportAllChanges)),
                (y = []),
                (g = -1),
                (v = null),
                V(addEventListener),
                (a = o),
                y.push(a),
                U();
            });
      });
  },
  R = [2500, 4e3],
  S = {},
  re = function (e, t) {
    (t = t || {}),
      E(function () {
        var n,
          i = D(),
          r = d('LCP'),
          o = function (a) {
            var s = a[a.length - 1];
            s &&
              s.startTime < i.firstHiddenTime &&
              ((r.value = Math.max(s.startTime - T(), 0)), (r.entries = [s]), n());
          },
          c = b('largest-contentful-paint', o);
        if (c) {
          n = f(e, r, R, t.reportAllChanges);
          var u = k(function () {
            S[r.id] || (o(c.takeRecords()), c.disconnect(), (S[r.id] = !0), n(!0));
          });
          ['keydown', 'click'].forEach(function (a) {
            addEventListener(a, u, !0);
          }),
            A(u),
            p(function (a) {
              (r = d('LCP')),
                (n = f(e, r, R, t.reportAllChanges)),
                C(function () {
                  (r.value = performance.now() - a.timeStamp), (S[r.id] = !0), n(!0);
                });
            });
        }
      });
  },
  q = [800, 1800],
  ie = function e(t) {
    document.prerendering
      ? E(function () {
          return e(t);
        })
      : document.readyState !== 'complete'
      ? addEventListener(
          'load',
          function () {
            return e(t);
          },
          !0
        )
      : setTimeout(t, 0);
  },
  oe = function (e, t) {
    t = t || {};
    var n = d('TTFB'),
      i = f(e, n, q, t.reportAllChanges);
    ie(function () {
      var r = L();
      if (r) {
        var o = r.responseStart;
        if (o <= 0 || o > performance.now()) return;
        (n.value = Math.max(o - T(), 0)),
          (n.entries = [r]),
          i(!0),
          p(function () {
            (n = d('TTFB', 0)), (i = f(e, n, q, t.reportAllChanges))(!0);
          });
      }
    });
  };
const x = 'https://vitals.vercel-analytics.com/v1/vitals',
  ae = () =>
    'connection' in navigator && navigator.connection && 'effectiveType' in navigator.connection
      ? navigator.connection.effectiveType
      : '',
  m = (e, t) => {
    const n = {
        dsn: t.analyticsId,
        id: e.id,
        page: t.path,
        href: location.href,
        event_name: e.name,
        value: e.value.toString(),
        speed: ae(),
      },
      i = new Blob([new URLSearchParams(n).toString()], { type: 'application/x-www-form-urlencoded' });
    navigator.sendBeacon
      ? navigator.sendBeacon(x, i)
      : fetch(x, { body: i, method: 'POST', credentials: 'omit', keepalive: !0 });
  };
function ce() {
  const e = {}.PUBLIC_VERCEL_ANALYTICS_ID;
  if (!e) {
    console.error('[Analytics] VERCEL_ANALYTICS_ID not found');
    return;
  }
  const t = { path: window.location.pathname, analyticsId: e };
  try {
    ne((n) => m(n, t)), oe((n) => m(n, t)), re((n) => m(n, t)), K((n) => m(n, t)), O((n) => m(n, t));
  } catch (n) {
    console.error('[Analytics]', n);
  }
}
const ue = 'production';
G({ mode: ue });
ce();
