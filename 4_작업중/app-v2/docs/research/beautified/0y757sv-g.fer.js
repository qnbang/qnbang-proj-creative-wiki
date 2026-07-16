(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["object" == typeof document ? document.currentScript : void 0, 98183, (e, t, r) => {
  "use strict";
  Object.defineProperty(r, "__esModule", {
    value: !0
  });
  var n = {
    assign: function() {
      return s
    },
    searchParamsToUrlQuery: function() {
      return i
    },
    urlQueryToSearchParams: function() {
      return l
    }
  };
  for (var o in n) Object.defineProperty(r, o, {
    enumerable: !0,
    get: n[o]
  });

  function i(e) {
    let t = {};
    for (let [r, n] of e.entries()) {
      let e = t[r];
      void 0 === e ? t[r] = n : Array.isArray(e) ? e.push(n) : t[r] = [e, n]
    }
    return t
  }

  function a(e) {
    return "string" == typeof e ? e : ("number" != typeof e || isNaN(e)) && "boolean" != typeof e ? "" : String(e)
  }

  function l(e) {
    let t = new URLSearchParams;
    for (let [r, n] of Object.entries(e))
      if (Array.isArray(n))
        for (let e of n) t.append(r, a(e));
      else t.set(r, a(n));
    return t
  }

  function s(e, ...t) {
    for (let r of t) {
      for (let t of r.keys()) e.delete(t);
      for (let [t, n] of r.entries()) e.append(t, n)
    }
    return e
  }
}, 18967, (e, t, r) => {
  "use strict";
  Object.defineProperty(r, "__esModule", {
    value: !0
  });
  var n = {
    DecodeError: function() {
      return g
    },
    MiddlewareNotFoundError: function() {
      return w
    },
    MissingStaticPage: function() {
      return v
    },
    NormalizeError: function() {
      return y
    },
    PageNotFoundError: function() {
      return b
    },
    SP: function() {
      return h
    },
    ST: function() {
      return m
    },
    WEB_VITALS: function() {
      return i
    },
    execOnce: function() {
      return a
    },
    getDisplayName: function() {
      return f
    },
    getLocationOrigin: function() {
      return u
    },
    getURL: function() {
      return c
    },
    isAbsoluteUrl: function() {
      return s
    },
    isResSent: function() {
      return d
    },
    loadGetInitialProps: function() {
      return C
    },
    normalizeRepeatedSlashes: function() {
      return p
    },
    stringifyError: function() {
      return S
    }
  };
  for (var o in n) Object.defineProperty(r, o, {
    enumerable: !0,
    get: n[o]
  });
  let i = ["CLS", "FCP", "FID", "INP", "LCP", "TTFB"];

  function a(e) {
    let t, r = !1;
    return (...n) => (r || (r = !0, t = e(...n)), t)
  }
  let l = /^[a-zA-Z][a-zA-Z\d+\-.]*?:/,
    s = e => l.test(e);

  function u() {
    let {
      protocol: e,
      hostname: t,
      port: r
    } = window.location;
    return `${e}//${t}${r?":"+r:""}`
  }

  function c() {
    let {
      href: e
    } = window.location, t = u();
    return e.substring(t.length)
  }

  function f(e) {
    return "string" == typeof e ? e : e.displayName || e.name || "Unknown"
  }

  function d(e) {
    return e.finished || e.headersSent
  }

  function p(e) {
    let t = e.split("?");
    return t[0].replace(/\\/g, "/").replace(/\/\/+/g, "/") + (t[1] ? `?${t.slice(1).join("?")}` : "")
  }
  async function C(e, t) {
    let r = t.res || t.ctx && t.ctx.res;
    if (!e.getInitialProps) return t.ctx && t.Component ? {
      pageProps: await C(t.Component, t.ctx)
    } : {};
    let n = await e.getInitialProps(t);
    if (r && d(r)) return n;
    if (!n) throw Object.defineProperty(Error(`"${f(e)}.getInitialProps()" should resolve to an object. But found "${n}" instead.`), "__NEXT_ERROR_CODE", {
      value: "E1025",
      enumerable: !1,
      configurable: !0
    });
    return n
  }
  let h = "u" > typeof performance,
    m = h && ["mark", "measure", "getEntriesByName"].every(e => "function" == typeof performance[e]);
  class g extends Error {}
  class y extends Error {}
  class b extends Error {
    constructor(e) {
      super(), this.code = "ENOENT", this.name = "PageNotFoundError", this.message = `Cannot find module for page: ${e}`
    }
  }
  class v extends Error {
    constructor(e, t) {
      super(), this.message = `Failed to load static file for page: ${e} ${t}`
    }
  }
  class w extends Error {
    constructor() {
      super(), this.code = "ENOENT", this.message = "Cannot find the middleware module"
    }
  }

  function S(e) {
    return JSON.stringify({
      message: e.message,
      stack: e.stack
    })
  }
}, 33525, (e, t, r) => {
  "use strict";
  Object.defineProperty(r, "__esModule", {
    value: !0
  }), Object.defineProperty(r, "warnOnce", {
    enumerable: !0,
    get: function() {
      return n
    }
  });
  let n = e => {}
}, 95057, (e, t, r) => {
  "use strict";
  Object.defineProperty(r, "__esModule", {
    value: !0
  });
  var n = {
    formatUrl: function() {
      return l
    },
    formatWithValidation: function() {
      return u
    },
    urlObjectKeys: function() {
      return s
    }
  };
  for (var o in n) Object.defineProperty(r, o, {
    enumerable: !0,
    get: n[o]
  });
  let i = e.r(90809)._(e.r(98183)),
    a = /https?|ftp|gopher|file/;

  function l(e) {
    let {
      auth: t,
      hostname: r
    } = e, n = e.protocol || "", o = e.pathname || "", l = e.hash || "", s = e.query || "", u = !1;
    t = t ? encodeURIComponent(t).replace(/%3A/i, ":") + "@" : "", e.host ? u = t + e.host : r && (u = t + (~r.indexOf(":") ? `[${r}]` : r), e.port && (u += ":" + e.port)), s && "object" == typeof s && (s = String(i.urlQueryToSearchParams(s)));
    let c = e.search || s && `?${s}` || "";
    return n && !n.endsWith(":") && (n += ":"), e.slashes || (!n || a.test(n)) && !1 !== u ? (u = "//" + (u || ""), o && "/" !== o[0] && (o = "/" + o)) : u || (u = ""), l && "#" !== l[0] && (l = "#" + l), c && "?" !== c[0] && (c = "?" + c), o = o.replace(/[?#]/g, encodeURIComponent), c = c.replace("#", "%23"), `${n}${u}${o}${c}${l}`
  }
  let s = ["auth", "hash", "host", "hostname", "href", "path", "pathname", "port", "protocol", "query", "search", "slashes"];

  function u(e) {
    return l(e)
  }
}, 18581, (e, t, r) => {
  "use strict";
  Object.defineProperty(r, "__esModule", {
    value: !0
  }), Object.defineProperty(r, "useMergedRef", {
    enumerable: !0,
    get: function() {
      return o
    }
  });
  let n = e.r(71645);

  function o(e, t) {
    let r = (0, n.useRef)(null),
      o = (0, n.useRef)(null);
    return (0, n.useCallback)(n => {
      if (null === n) {
        let e = r.current;
        e && (r.current = null, e());
        let t = o.current;
        t && (o.current = null, t())
      } else e && (r.current = i(e, n)), t && (o.current = i(t, n))
    }, [e, t])
  }

  function i(e, t) {
    if ("function" != typeof e) return e.current = t, () => {
      e.current = null
    };
    {
      let r = e(t);
      return "function" == typeof r ? r : () => e(null)
    }
  }("function" == typeof r.default || "object" == typeof r.default && null !== r.default) && void 0 === r.default.__esModule && (Object.defineProperty(r.default, "__esModule", {
    value: !0
  }), Object.assign(r.default, r), t.exports = r.default)
}, 73668, (e, t, r) => {
  "use strict";
  Object.defineProperty(r, "__esModule", {
    value: !0
  }), Object.defineProperty(r, "isLocalURL", {
    enumerable: !0,
    get: function() {
      return i
    }
  });
  let n = e.r(18967),
    o = e.r(52817);

  function i(e) {
    if (!(0, n.isAbsoluteUrl)(e)) return !0;
    try {
      let t = (0, n.getLocationOrigin)(),
        r = new URL(e, t);
      return r.origin === t && (0, o.hasBasePath)(r.pathname)
    } catch (e) {
      return !1
    }
  }
}, 84508, (e, t, r) => {
  "use strict";
  Object.defineProperty(r, "__esModule", {
    value: !0
  }), Object.defineProperty(r, "errorOnce", {
    enumerable: !0,
    get: function() {
      return n
    }
  });
  let n = e => {}
}, 22016, (e, t, r) => {
  "use strict";
  Object.defineProperty(r, "__esModule", {
    value: !0
  });
  var n = {
    default: function() {
      return g
    },
    useLinkStatus: function() {
      return b
    }
  };
  for (var o in n) Object.defineProperty(r, o, {
    enumerable: !0,
    get: n[o]
  });
  let i = e.r(90809),
    a = e.r(43476),
    l = i._(e.r(71645)),
    s = e.r(95057),
    u = e.r(8372),
    c = e.r(18581),
    f = e.r(18967),
    d = e.r(5550);
  e.r(33525);
  let p = e.r(88540),
    C = e.r(91949),
    h = e.r(73668),
    m = e.r(9396);

  function g(t) {
    var r, n;
    let o, i, g, [b, v] = (0, l.useOptimistic)(C.IDLE_LINK_STATUS),
      w = (0, l.useRef)(null),
      {
        href: S,
        as: L,
        children: x,
        prefetch: M = null,
        passHref: O,
        replace: P,
        shallow: j,
        scroll: E,
        onClick: _,
        onMouseEnter: k,
        onTouchStart: I,
        legacyBehavior: N = !1,
        onNavigate: R,
        transitionTypes: T,
        ref: $,
        unstable_dynamicOnHover: A,
        ...U
      } = t;
    o = x, N && ("string" == typeof o || "number" == typeof o) && (o = (0, a.jsx)("a", {
      children: o
    }));
    let D = l.default.useContext(u.AppRouterContext),
      F = !1 !== M,
      B = !1 !== M ? null === (n = M) || "auto" === n ? m.FetchStrategy.PPR : m.FetchStrategy.Full : m.FetchStrategy.PPR,
      K = "string" == typeof(r = L || S) ? r : (0, s.formatUrl)(r);
    if (N) {
      if (o?.$$typeof === Symbol.for("react.lazy")) throw Object.defineProperty(Error("`<Link legacyBehavior>` received a direct child that is either a Server Component, or JSX that was loaded with React.lazy(). This is not supported. Either remove legacyBehavior, or make the direct child a Client Component that renders the Link's `<a>` tag."), "__NEXT_ERROR_CODE", {
        value: "E863",
        enumerable: !1,
        configurable: !0
      });
      i = l.default.Children.only(o)
    }
    let Z = N ? i && "object" == typeof i && i.ref : $,
      z = l.default.useCallback(e => (null !== D && (w.current = (0, C.mountLinkInstance)(e, K, D, B, F, v)), () => {
        w.current && ((0, C.unmountLinkForCurrentNavigation)(w.current), w.current = null), (0, C.unmountPrefetchableInstance)(e)
      }), [F, K, D, B, v]),
      W = {
        ref: (0, c.useMergedRef)(z, Z),
        onClick(t) {
          N || "function" != typeof _ || _(t), N && i.props && "function" == typeof i.props.onClick && i.props.onClick(t), !D || t.defaultPrevented || function(t, r, n, o, i, a, s) {
            if ("u" > typeof window) {
              let u, {
                nodeName: c
              } = t.currentTarget;
              if ("A" === c.toUpperCase() && ((u = t.currentTarget.getAttribute("target")) && "_self" !== u || t.metaKey || t.ctrlKey || t.shiftKey || t.altKey || t.nativeEvent && 2 === t.nativeEvent.which) || t.currentTarget.hasAttribute("download")) return;
              if (!(0, h.isLocalURL)(r)) {
                o && (t.preventDefault(), location.replace(r));
                return
              }
              if (t.preventDefault(), a) {
                let e = !1;
                if (a({
                    preventDefault: () => {
                      e = !0
                    }
                  }), e) return
              }
              let {
                dispatchNavigateAction: f
              } = e.r(99781);
              l.default.startTransition(() => {
                f(r, o ? "replace" : "push", !1 === i ? p.ScrollBehavior.NoScroll : p.ScrollBehavior.Default, n.current, s)
              })
            }
          }(t, K, w, P, E, R, T)
        },
        onMouseEnter(e) {
          N || "function" != typeof k || k(e), N && i.props && "function" == typeof i.props.onMouseEnter && i.props.onMouseEnter(e), D && F && (0, C.onNavigationIntent)(e.currentTarget, !0 === A)
        },
        onTouchStart: function(e) {
          N || "function" != typeof I || I(e), N && i.props && "function" == typeof i.props.onTouchStart && i.props.onTouchStart(e), D && F && (0, C.onNavigationIntent)(e.currentTarget, !0 === A)
        }
      };
    return (0, f.isAbsoluteUrl)(K) ? W.href = K : N && !O && ("a" !== i.type || "href" in i.props) || (W.href = (0, d.addBasePath)(K)), g = N ? l.default.cloneElement(i, W) : (0, a.jsx)("a", {
      ...U,
      ...W,
      children: o
    }), (0, a.jsx)(y.Provider, {
      value: b,
      children: g
    })
  }
  e.r(84508);
  let y = (0, l.createContext)(C.IDLE_LINK_STATUS),
    b = () => (0, l.useContext)(y);
  ("function" == typeof r.default || "object" == typeof r.default && null !== r.default) && void 0 === r.default.__esModule && (Object.defineProperty(r.default, "__esModule", {
    value: !0
  }), Object.assign(r.default, r), t.exports = r.default)
}, 68834, e => {
  "use strict";
  var t = e.i(71645);
  let r = e => {
      let t, r = new Set,
        n = (e, n) => {
          let o = "function" == typeof e ? e(t) : e;
          if (!Object.is(o, t)) {
            let e = t;
            t = (null != n ? n : "object" != typeof o || null === o) ? o : Object.assign({}, t, o), r.forEach(r => r(t, e))
          }
        },
        o = () => t,
        i = {
          setState: n,
          getState: o,
          getInitialState: () => a,
          subscribe: e => (r.add(e), () => r.delete(e))
        },
        a = t = e(n, o, i);
      return i
    },
    n = e => {
      let n = e ? r(e) : r,
        o = e => (function(e, r = e => e) {
          let n = t.default.useSyncExternalStore(e.subscribe, t.default.useCallback(() => r(e.getState()), [e, r]), t.default.useCallback(() => r(e.getInitialState()), [e, r]));
          return t.default.useDebugValue(n), n
        })(n, e);
      return Object.assign(o, n), o
    };
  e.s(["create", 0, e => e ? n(e) : n], 68834)
}, 95187, (e, t, r) => {
  "use strict";
  Object.defineProperty(r, "__esModule", {
    value: !0
  });
  var n = {
    callServer: function() {
      return i.callServer
    },
    createServerReference: function() {
      return l.createServerReference
    },
    findSourceMapURL: function() {
      return a.findSourceMapURL
    }
  };
  for (var o in n) Object.defineProperty(r, o, {
    enumerable: !0,
    get: n[o]
  });
  let i = e.r(32120),
    a = e.r(92245),
    l = e.r(35326)
}, 87968, e => {
  "use strict";
  var t = e.i(43476),
    r = e.i(48787),
    n = e.i(65658);
  e.s(["Spinner", 0, ({
    className: e
  }) => {
    let {
      r: o
    } = (0, n.useSpring)({
      from: {
        r: 0
      },
      to: {
        r: 360
      },
      loop: !0,
      config: {
        duration: 650
      }
    });
    return (0, t.jsxs)(r.animated.svg, {
      className: e,
      width: "18",
      height: "18",
      viewBox: "0 0 18 18",
      fill: "none",
      "aria-hidden": "true",
      style: {
        transform: o.to(e => `rotate(${e}deg)`)
      },
      children: [(0, t.jsx)("circle", {
        cx: "9",
        cy: "9",
        r: "7",
        stroke: "currentColor",
        strokeOpacity: "0.25",
        strokeWidth: "2"
      }), (0, t.jsx)("path", {
        d: "M16 9a7 7 0 0 0-7-7",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round"
      })]
    })
  }])
}, 88526, e => {
  "use strict";
  let t = "gl-signup-context",
    r = [
      ["utm_source", "utmSource"],
      ["utm_medium", "utmMedium"],
      ["utm_campaign", "utmCampaign"],
      ["utm_term", "utmTerm"],
      ["utm_content", "utmContent"]
    ];
  e.s(["captureFromBrowser", 0, function() {
    try {
      if (window.sessionStorage.getItem(t)) return;
      let e = new URLSearchParams(window.location.search),
        n = {},
        o = {},
        i = new Set(r.map(([e]) => e));
      for (let [t, r] of e.entries()) i.has(t) || (o[t] = r);
      for (let [t, i] of(Object.keys(o).length && (n.queryParams = o), r)) {
        let r = e.get(t);
        r && (n[i] = r)
      }
      "u" > typeof document && document.referrer && (n.referrer = document.referrer), n.landingPath = window.location.pathname, navigator.languages && navigator.languages.length ? n.languages = [...navigator.languages] : navigator.language && (n.languages = [navigator.language]);
      try {
        n.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      } catch {}
      Object.keys(n).length > 0 && window.sessionStorage.setItem(t, JSON.stringify(n))
    } catch {}
  }, "clearSessionContext", 0, function() {
    try {
      window.sessionStorage.removeItem(t)
    } catch {}
  }, "readSessionContext", 0, function() {
    try {
      let e = window.sessionStorage.getItem(t);
      if (!e) return null;
      return JSON.parse(e)
    } catch {
      return null
    }
  }])
}, 62754, e => {
  "use strict";
  e.s(["ApiError", 0, class extends Error {
    code;
    details;
    constructor(e, t, r) {
      super(t), this.name = "ApiError", this.code = e, this.details = r
    }
  }])
}, 98877, e => {
  "use strict";
  var t = e.i(62754);
  e.s(["asApiError", 0, function(e) {
    return new t.ApiError(e.code, e.message, e.details)
  }, "isApiErrorResponse", 0, function(e) {
    return "object" == typeof e && null !== e && "_apiError" in e
  }])
}, 53363, e => {
  "use strict";
  var t = e.i(68834);
  let r = "cookie-consent-v1",
    n = {
      necessary: !0,
      analytics: !1,
      marketing: !1
    },
    o = e => {
      try {
        window.localStorage.setItem(r, JSON.stringify(e))
      } catch {}
    },
    i = (0, t.create)(e => ({
      consent: null,
      hydrated: !1,
      modalOpen: !1,
      hydrate: () => e({
        consent: (() => {
          try {
            let e = window.localStorage.getItem(r);
            if (!e) return null;
            let t = JSON.parse(e);
            return {
              ...n,
              ...t,
              necessary: !0
            }
          } catch {
            return null
          }
        })(),
        hydrated: !0
      }),
      acceptAll: () => {
        let t = {
          necessary: !0,
          analytics: !1,
          marketing: !1
        };
        o(t), e({
          consent: t,
          modalOpen: !1
        })
      },
      rejectAll: () => {
        let t = {
          ...n
        };
        o(t), e({
          consent: t,
          modalOpen: !1
        })
      },
      savePreferences: ({
        analytics: t,
        marketing: r
      }) => {
        let n = {
          necessary: !0,
          analytics: t,
          marketing: r
        };
        o(n), e({
          consent: n,
          modalOpen: !1
        })
      },
      openModal: () => e({
        modalOpen: !0
      }),
      closeModal: () => e({
        modalOpen: !1
      })
    }));
  e.s(["useCookieStore", 0, i])
}, 31973, e => {
  "use strict";
  let t = (0, e.i(68834).create)(e => ({
    lenis: null,
    setLenis: t => e({
      lenis: t
    }),
    isEnableScroll: !0,
    start: () => e({
      isEnableScroll: !0
    }),
    stop: () => e({
      isEnableScroll: !1
    })
  }));
  e.s(["useScroll", 0, t])
}, 22263, e => {
  "use strict";
  var t = e.i(43476),
    r = e.i(71645),
    n = e.i(48787),
    o = e.i(65658),
    i = e.i(37203);
  e.s(["BorderGlow", 0, ({
    variant: e
  }) => {
    let a = (0, i.useIsStaticMode)(),
      l = (0, r.useRef)(null),
      [s, u] = (0, r.useState)({
        w: 0,
        h: 0,
        cr: 0
      }),
      [c, f] = (0, r.useState)(!1),
      {
        t: d
      } = (0, o.useSpring)({
        from: {
          t: 0
        },
        to: {
          t: 1
        },
        loop: !0,
        config: {
          duration: 4200
        },
        pause: !c
      });
    (0, r.useEffect)(() => {
      if (a) return;
      let e = l.current;
      if (!e) return;
      let t = () => {
        let t = e.offsetWidth,
          r = e.offsetHeight,
          n = Math.min(parseFloat(getComputedStyle(e).borderTopLeftRadius) || 0, t / 2, r / 2);
        u(e => e.w === t && e.h === r && e.cr === n ? e : {
          w: t,
          h: r,
          cr: n
        })
      };
      t();
      let r = new ResizeObserver(t);
      r.observe(e);
      let n = new IntersectionObserver(e => {
        let t = e[0];
        t && f(t.isIntersecting)
      }, {
        rootMargin: "200px 0px"
      });
      return n.observe(e), () => {
        r.disconnect(), n.disconnect()
      }
    }, [a]);
    let p = e => d.to(t => {
      let r = function(e, t, r, n) {
        let o = t - 2 * n,
          i = r - 2 * n,
          a = Math.PI / 2 * n,
          l = 2 * o + 2 * i + 4 * a;
        if (l <= 0) return {
          x: 0,
          y: 0
        };
        let s = (e % 1 * l + l) % l;
        if (s < o) return {
          x: n + s,
          y: 0
        };
        if ((s -= o) < a) {
          let e = -Math.PI / 2 + Math.PI / 2 * (s / a);
          return {
            x: t - n + n * Math.cos(e),
            y: n + n * Math.sin(e)
          }
        }
        if ((s -= a) < i) return {
          x: t,
          y: n + s
        };
        if ((s -= i) < a) {
          let e = Math.PI / 2 * (s / a);
          return {
            x: t - n + n * Math.cos(e),
            y: r - n + n * Math.sin(e)
          }
        }
        if ((s -= a) < o) return {
          x: t - n - s,
          y: r
        };
        if ((s -= o) < a) {
          let e = Math.PI / 2 + Math.PI / 2 * (s / a);
          return {
            x: n + n * Math.cos(e),
            y: r - n + n * Math.sin(e)
          }
        }
        if ((s -= a) < i) return {
          x: 0,
          y: r - n - s
        };
        let u = Math.PI + Math.PI / 2 * ((s -= i) / a);
        return {
          x: n + n * Math.cos(u),
          y: n + n * Math.sin(u)
        }
      }((t + e) % 1, s.w, s.h, s.cr);
      return `translate(-50%, -50%) translate(${r.x}px, ${r.y}px)`
    });
    return a ? null : (0, t.jsxs)("span", {
      ref: l,
      className: `border-glow ${e?`border-glow-${e}`:""}`,
      "aria-hidden": "true",
      children: [(0, t.jsx)(n.animated.span, {
        className: "border-glow-blob",
        style: {
          transform: p(0)
        }
      }), (0, t.jsx)(n.animated.span, {
        className: "border-glow-blob",
        style: {
          transform: p(.5)
        }
      })]
    })
  }])
}, 26377, e => {
  "use strict";
  var t = e.i(43476),
    r = e.i(48787),
    n = e.i(65658),
    o = e.i(71645),
    i = e.i(79050),
    a = e.i(48097);
  let l = (0, o.forwardRef)(({
    tag: e = "span",
    children: n,
    className: i,
    style: a,
    ...l
  }, s) => {
    let u = (0, o.useRef)(null);
    (0, o.useImperativeHandle)(s, () => u.current);
    let c = r.animated[e];
    return (0, t.jsx)(c, {
      ref: u,
      className: i,
      style: a,
      ...l,
      children: n
    })
  });
  l.displayName = "AnimatedVarTextTag";
  let s = (0, o.forwardRef)(({
    tag: e = "div",
    children: r,
    from: s = {},
    to: u = {},
    style: c,
    config: f = {},
    delayIn: d = 0,
    delayOut: p = 0,
    enabled: C = !0,
    trigger: h,
    disableOnMobile: m = !0,
    immediateOut: g = !1,
    ...y
  }, b) => {
    let v = (0, o.useRef)(null),
      [w, S] = (0, o.useState)(!1),
      L = (0, a.useWindowWidth)();
    (0, o.useImperativeHandle)(b, () => v.current), (0, o.useEffect)(() => {
      if ((0, i.isMobileDisabled)(i.springsConfig.disableOnMobile.hover || m)) return;
      let e = h?.current;
      if (!e) return;
      let t = () => {
          S(!0)
        },
        r = () => {
          S(!1)
        };
      return e.addEventListener("mouseenter", t), e.addEventListener("mouseleave", r), () => {
        e.removeEventListener("mouseenter", t), e.removeEventListener("mouseleave", r)
      }
    }, [h, m, L]);
    let x = (0, o.useMemo)(() => !(0, i.isMobileDisabled)(i.springsConfig.disableOnMobile.hover || m) && !!C && w, [C, w, m, L]),
      M = (0, n.useSpring)({
        from: s,
        to: x ? u : s,
        config: f,
        delay: x ? d : p,
        immediate: !x && g
      });
    return (0, t.jsx)(l, {
      ref: v,
      onMouseEnter: () => {
        (0, i.isMobileDisabled)(i.springsConfig.disableOnMobile.hover || m) || h?.current || S(!0)
      },
      onMouseLeave: () => {
        (0, i.isMobileDisabled)(i.springsConfig.disableOnMobile.hover || m) || h?.current || S(!1)
      },
      tag: e,
      style: {
        ...M,
        ...c
      },
      ...y,
      children: r
    })
  });
  s.displayName = "Hover", e.s(["Hover", 0, s])
}, 78661, e => {
  "use strict";
  var t = e.i(43476),
    r = e.i(71645),
    n = e.i(48787),
    o = e.i(65658),
    i = e.i(37203);
  let a = [{
      d: "M16.4043 15.75C16.4488 15.7501 16.4923 15.7633 16.5293 15.7881C16.5664 15.8129 16.5953 15.8484 16.6123 15.8896L16.9502 17.0732C17.1004 17.6058 17.3851 18.0911 17.7764 18.4824C18.1676 18.8736 18.653 19.1574 19.1855 19.3076L20.3691 19.6465C20.4142 19.6594 20.4541 19.6863 20.4824 19.7236C20.5108 19.7612 20.5263 19.8074 20.5264 19.8545C20.5264 19.9017 20.5108 19.9477 20.4824 19.9854C20.454 20.0229 20.4144 20.0505 20.3691 20.0635L19.1855 20.4014C18.6529 20.5516 18.1677 20.8362 17.7764 21.2275C17.3851 21.6189 17.1004 22.1041 16.9502 22.6367L16.6123 23.8193C16.5994 23.8648 16.5718 23.9051 16.5342 23.9336C16.4967 23.9618 16.4512 23.9774 16.4043 23.9775C16.3572 23.9775 16.311 23.9619 16.2734 23.9336C16.2358 23.9051 16.2082 23.8648 16.1953 23.8193L15.8574 22.6367C15.7073 22.1041 15.4226 21.6189 15.0312 21.2275C14.6399 20.8362 14.1547 20.5516 13.6221 20.4014L12.4395 20.0635C12.394 20.0506 12.3537 20.023 12.3252 19.9854C12.2968 19.9477 12.2812 19.9017 12.2812 19.8545C12.2813 19.8074 12.2968 19.7612 12.3252 19.7236C12.3536 19.6861 12.3941 19.6593 12.4395 19.6465L13.6221 19.3076C14.1546 19.1574 14.64 18.8736 15.0312 18.4824C15.4225 18.0911 15.7072 17.6058 15.8574 17.0732L16.1953 15.8896C16.2123 15.8484 16.2412 15.8129 16.2783 15.7881C16.3155 15.7632 16.3596 15.75 16.4043 15.75Z",
      cx: 16.4,
      cy: 19.86
    }, {
      d: "M8.53516 4.875C8.61253 4.875 8.68866 4.89833 8.75293 4.94141C8.81701 4.98447 8.86714 5.04576 8.89648 5.11719L9.48047 7.16211C9.74017 8.08328 10.2324 8.92285 10.9092 9.59961C11.5858 10.2762 12.4248 10.7676 13.3457 11.0273L15.3916 11.6123C15.4701 11.6346 15.5396 11.6819 15.5889 11.7471C15.638 11.8122 15.6641 11.892 15.6641 11.9736C15.664 12.055 15.6379 12.1342 15.5889 12.1992C15.5396 12.2644 15.4701 12.3117 15.3916 12.334L13.3457 12.9189C12.4248 13.1787 11.5858 13.6701 10.9092 14.3467C10.2324 15.0234 9.74017 15.863 9.48047 16.7842L8.89648 18.8301C8.87417 18.9084 8.82666 18.9772 8.76172 19.0264C8.69658 19.0756 8.6168 19.1025 8.53516 19.1025C8.45366 19.1025 8.37462 19.0755 8.30957 19.0264C8.24458 18.9773 8.19716 18.9084 8.1748 18.8301L7.58984 16.7842C7.33014 15.863 6.83789 15.0234 6.16113 14.3467C5.48446 13.6701 4.64557 13.1786 3.72461 12.9189L1.67871 12.334C1.6003 12.3117 1.53158 12.2643 1.48242 12.1992C1.43328 12.1342 1.40633 12.0551 1.40625 11.9736C1.40625 11.892 1.4332 11.8122 1.48242 11.7471C1.53158 11.6821 1.60034 11.6346 1.67871 11.6123L3.72461 11.0273C4.6456 10.7677 5.48446 10.2762 6.16113 9.59961C6.83789 8.92285 7.33014 8.08328 7.58984 7.16211L8.1748 5.11719C8.2042 5.04562 8.25409 4.98449 8.31836 4.94141C8.38257 4.89838 8.45787 4.87503 8.53516 4.875Z",
      cx: 8.53,
      cy: 11.99
    }, {
      d: "M16.4043 0C16.4488 9.07153e-05 16.4923 0.0133377 16.5293 0.0380859C16.5664 0.0629351 16.5953 0.0983965 16.6123 0.139648L16.9502 1.32324C17.1004 1.85582 17.3851 2.34114 17.7764 2.73242C18.1676 3.12365 18.653 3.40742 19.1855 3.55762L20.3691 3.89648C20.4142 3.90941 20.4541 3.93625 20.4824 3.97363C20.5108 4.01123 20.5263 4.05738 20.5264 4.10449C20.5264 4.15167 20.5108 4.1977 20.4824 4.23535C20.454 4.27291 20.4144 4.30054 20.3691 4.31348L19.1855 4.65137C18.6529 4.80156 18.1677 5.08623 17.7764 5.47754C17.3851 5.86887 17.1004 6.35408 16.9502 6.88672L16.6123 8.06934C16.5994 8.11476 16.5718 8.15513 16.5342 8.18359C16.4967 8.2118 16.4512 8.22744 16.4043 8.22754C16.3572 8.22754 16.311 8.21191 16.2734 8.18359C16.2358 8.15513 16.2082 8.11476 16.1953 8.06934L15.8574 6.88672C15.7073 6.35407 15.4226 5.86888 15.0312 5.47754C14.6399 5.08622 14.1547 4.80156 13.6221 4.65137L12.4395 4.31348C12.394 4.30058 12.3537 4.27302 12.3252 4.23535C12.2968 4.1977 12.2812 4.15166 12.2812 4.10449C12.2813 4.05738 12.2968 4.01123 12.3252 3.97363C12.3536 3.93609 12.3941 3.90935 12.4395 3.89648L13.6221 3.55762C14.1546 3.40743 14.64 3.12365 15.0312 2.73242C15.4225 2.34114 15.7072 1.85582 15.8574 1.32324L16.1953 0.139648C16.2123 0.0983879 16.2412 0.0629391 16.2783 0.0380859C16.3155 0.0132357 16.3596 0 16.4043 0Z",
      cx: 16.4,
      cy: 4.11
    }],
    l = ({
      d: e,
      cx: r,
      cy: i,
      delay: a,
      paused: l
    }) => {
      let {
        t: s
      } = (0, o.useSpring)({
        from: {
          t: 0
        },
        to: {
          t: 1
        },
        loop: !0,
        delay: a,
        config: {
          duration: 1500
        },
        pause: l
      });
      return (0, t.jsx)(n.animated.g, {
        transform: s.to(e => {
          let t = .4 + .6 * Math.sin(e * Math.PI);
          return `translate(${r} ${i}) scale(${t}) translate(${-r} ${-i})`
        }),
        children: (0, t.jsx)("path", {
          d: e,
          fill: "currentColor"
        })
      })
    };
  e.s(["AnimatedSpark", 0, ({
    className: e
  }) => {
    let n = (0, i.useIsStaticMode)(),
      o = (0, r.useRef)(null),
      [s, u] = (0, r.useState)(!1);
    return (0, r.useEffect)(() => {
      if (n) return;
      let e = o.current;
      if (!e) return;
      let t = new IntersectionObserver(e => {
        let t = e[0];
        t && u(t.isIntersecting)
      }, {
        rootMargin: "200px 0px"
      });
      return t.observe(e), () => t.disconnect()
    }, [n]), (0, t.jsx)("svg", {
      ref: o,
      className: e,
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      "aria-hidden": "true",
      children: a.map((e, r) => n ? (0, t.jsx)("path", {
        d: e.d,
        fill: "currentColor"
      }, r) : (0, t.jsx)(l, {
        ...e,
        delay: 380 * r,
        paused: !s
      }, r))
    })
  }])
}, 86337, e => {
  "use strict";

  function t(e) {
    if (!e) return "free";
    let t = e.plan.toLowerCase();
    return t.includes("full stack") || t.includes("power") ? "full_stack" : t.includes("unlimited") || t.includes("premium") ? "unlimited" : "free"
  }
  let r = e => "unlimited" === t(e),
    n = e => "full_stack" === t(e),
    o = e => "free" !== t(e);

  function i(e) {
    switch (e) {
      case "free":
        return 0;
      case "unlimited":
        return 1;
      case "full_stack":
        return 2
    }
  }

  function a(e) {
    return "lifetime" === e ? 3 : "yearly" === e ? 2 : +("monthly" === e)
  }

  function l(e, t, r = null) {
    if ("free" === e || !t) return 0;
    if ("regional" === r) return "unlimited" === e ? "monthly" === t ? 900 : "yearly" === t ? 3900 : 6900 : "monthly" === t ? 1400 : "yearly" === t ? 4900 : 8900;
    return "unlimited" === e ? "lifetime" === t ? 9900 : 7900 : "lifetime" === t ? 13900 : 9900
  }
  let s = {
    copy: null,
    source: null,
    video: null,
    window: null
  };

  function u(e) {
    return !!e && !!e.cancelledAt && "active" === e.status
  }

  function c(e) {
    return !!e && "free" !== e.tier && "active" === e.status
  }
  e.s(["accessActive", 0, c, "canAccessDownload", 0, function(e, t, r) {
    return "background" === e.category && "Free" === e.tier || !!n(t) && (void 0 === r || !!c(r))
  }, "canAccessPrompt", 0, function(e, t, r) {
    return "Free" === e.tier || !!o(t) && (void 0 === r || !!c(r))
  }, "hasFullStack", 0, n, "hasFullStackPerks", 0, function(e, t) {
    if (!n(e)) return !1;
    let r = t?.billingCycle ?? null;
    return "yearly" === r || "lifetime" === r
  }, "hasUnlimited", 0, r, "heroCta", 0, function(e, t) {
    return n(e) ? {
      show: !1,
      label: ""
    } : r(e) ? {
      show: !0,
      label: t.ctaUpgrade ?? t.cta,
      href: "/pricing"
    } : {
      show: !0,
      label: t.cta,
      href: "/pricing"
    }
  }, "isCancellationPending", 0, u, "isPastDue", 0, function(e) {
    return e?.status === "past_due"
  }, "isSubscriber", 0, o, "planLimits", 0, function(e, t) {
    return "free" !== e && "lifetime" !== t && t ? "monthly" === t ? "full_stack" === e ? {
      copy: 5,
      source: 2,
      video: 3,
      window: "week"
    } : {
      copy: 3,
      source: null,
      video: null,
      window: "week"
    } : "full_stack" === e ? {
      copy: 6,
      source: 6,
      video: 6,
      window: "day"
    } : {
      copy: 3,
      source: null,
      video: null,
      window: "day"
    } : s
  }, "purchaseDecisionFor", 0, function(e, t) {
    if (!e || "free" === e.tier || "expired" === e.status) return {
      kind: "buy"
    };
    let r = i(e.tier),
      n = i(t.tier),
      o = a(e.billingCycle),
      s = a(t.cycle);
    if (r === n && o === s && (e.region ?? null) === (t.region ?? null)) return {
      kind: "current",
      cancelled: u(e)
    };
    let c = l(e.tier, e.billingCycle, e.region ?? null),
      f = l(t.tier, t.cycle, t.region ?? null);
    return n >= r && f > c ? {
      kind: "upgrade-in-app"
    } : {
      kind: "downgrade"
    }
  }, "showGoUnlimitedThankYou", 0, e => o(e)])
}, 57043, e => {
  "use strict";
  var t = e.i(43476);
  e.s(["SparkIcon", 0, ({
    className: e
  }) => (0, t.jsx)("svg", {
    className: e,
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    "aria-hidden": "true",
    children: (0, t.jsx)("path", {
      d: "M16.4043 15.75C16.4488 15.7501 16.4923 15.7633 16.5293 15.7881C16.5664 15.8129 16.5953 15.8484 16.6123 15.8896L16.9502 17.0732C17.1004 17.6058 17.3851 18.0911 17.7764 18.4824C18.1676 18.8736 18.653 19.1574 19.1855 19.3076L20.3691 19.6465C20.4142 19.6594 20.4541 19.6863 20.4824 19.7236C20.5108 19.7612 20.5263 19.8074 20.5264 19.8545C20.5264 19.9017 20.5108 19.9477 20.4824 19.9854C20.454 20.0229 20.4144 20.0505 20.3691 20.0635L19.1855 20.4014C18.6529 20.5516 18.1677 20.8362 17.7764 21.2275C17.3851 21.6189 17.1004 22.1041 16.9502 22.6367L16.6123 23.8193C16.5994 23.8648 16.5718 23.9051 16.5342 23.9336C16.4967 23.9618 16.4512 23.9774 16.4043 23.9775C16.3572 23.9775 16.311 23.9619 16.2734 23.9336C16.2358 23.9051 16.2082 23.8648 16.1953 23.8193L15.8574 22.6367C15.7073 22.1041 15.4226 21.6189 15.0312 21.2275C14.6399 20.8362 14.1547 20.5516 13.6221 20.4014L12.4395 20.0635C12.394 20.0506 12.3537 20.023 12.3252 19.9854C12.2968 19.9477 12.2812 19.9017 12.2812 19.8545C12.2813 19.8074 12.2968 19.7612 12.3252 19.7236C12.3536 19.6861 12.3941 19.6593 12.4395 19.6465L13.6221 19.3076C14.1546 19.1574 14.64 18.8736 15.0312 18.4824C15.4225 18.0911 15.7072 17.6058 15.8574 17.0732L16.1953 15.8896C16.2123 15.8484 16.2412 15.8129 16.2783 15.7881C16.3155 15.7632 16.3596 15.75 16.4043 15.75ZM8.53516 4.875C8.61253 4.875 8.68866 4.89833 8.75293 4.94141C8.81701 4.98447 8.86714 5.04576 8.89648 5.11719L9.48047 7.16211C9.74017 8.08328 10.2324 8.92285 10.9092 9.59961C11.5858 10.2762 12.4248 10.7676 13.3457 11.0273L15.3916 11.6123C15.4701 11.6346 15.5396 11.6819 15.5889 11.7471C15.638 11.8122 15.6641 11.892 15.6641 11.9736C15.664 12.055 15.6379 12.1342 15.5889 12.1992C15.5396 12.2644 15.4701 12.3117 15.3916 12.334L13.3457 12.9189C12.4248 13.1787 11.5858 13.6701 10.9092 14.3467C10.2324 15.0234 9.74017 15.863 9.48047 16.7842L8.89648 18.8301C8.87417 18.9084 8.82666 18.9772 8.76172 19.0264C8.69658 19.0756 8.6168 19.1025 8.53516 19.1025C8.45366 19.1025 8.37462 19.0755 8.30957 19.0264C8.24458 18.9773 8.19716 18.9084 8.1748 18.8301L7.58984 16.7842C7.33014 15.863 6.83789 15.0234 6.16113 14.3467C5.48446 13.6701 4.64557 13.1786 3.72461 12.9189L1.67871 12.334C1.6003 12.3117 1.53158 12.2643 1.48242 12.1992C1.43328 12.1342 1.40633 12.0551 1.40625 11.9736C1.40625 11.892 1.4332 11.8122 1.48242 11.7471C1.53158 11.6821 1.60034 11.6346 1.67871 11.6123L3.72461 11.0273C4.6456 10.7677 5.48446 10.2762 6.16113 9.59961C6.83789 8.92285 7.33014 8.08328 7.58984 7.16211L8.1748 5.11719C8.2042 5.04562 8.25409 4.98449 8.31836 4.94141C8.38257 4.89838 8.45787 4.87503 8.53516 4.875ZM16.4043 0C16.4488 9.07153e-05 16.4923 0.0133377 16.5293 0.0380859C16.5664 0.0629351 16.5953 0.0983965 16.6123 0.139648L16.9502 1.32324C17.1004 1.85582 17.3851 2.34114 17.7764 2.73242C18.1676 3.12365 18.653 3.40742 19.1855 3.55762L20.3691 3.89648C20.4142 3.90941 20.4541 3.93625 20.4824 3.97363C20.5108 4.01123 20.5263 4.05738 20.5264 4.10449C20.5264 4.15167 20.5108 4.1977 20.4824 4.23535C20.454 4.27291 20.4144 4.30054 20.3691 4.31348L19.1855 4.65137C18.6529 4.80156 18.1677 5.08623 17.7764 5.47754C17.3851 5.86887 17.1004 6.35408 16.9502 6.88672L16.6123 8.06934C16.5994 8.11476 16.5718 8.15513 16.5342 8.18359C16.4967 8.2118 16.4512 8.22744 16.4043 8.22754C16.3572 8.22754 16.311 8.21191 16.2734 8.18359C16.2358 8.15513 16.2082 8.11476 16.1953 8.06934L15.8574 6.88672C15.7073 6.35407 15.4226 5.86888 15.0312 5.47754C14.6399 5.08622 14.1547 4.80156 13.6221 4.65137L12.4395 4.31348C12.394 4.30058 12.3537 4.27302 12.3252 4.23535C12.2968 4.1977 12.2812 4.15166 12.2812 4.10449C12.2813 4.05738 12.2968 4.01123 12.3252 3.97363C12.3536 3.93609 12.3941 3.90935 12.4395 3.89648L13.6221 3.55762C14.1546 3.40743 14.64 3.12365 15.0312 2.73242C15.4225 2.34114 15.7072 1.85582 15.8574 1.32324L16.1953 0.139648C16.2123 0.0983879 16.2412 0.0629391 16.2783 0.0380859C16.3155 0.0132357 16.3596 0 16.4043 0Z",
      fill: "currentColor"
    })
  })])
}, 19455, e => {
  "use strict";
  var t = e.i(43476),
    r = e.i(22016),
    n = e.i(26377),
    o = e.i(22263);
  e.s(["Button", 0, ({
    children: e,
    href: i,
    onClick: a,
    variant: l = "accent",
    size: s = "md",
    icon: u,
    borderGlow: c = !1,
    className: f = "",
    ariaLabel: d
  }) => {
    let p = (0, t.jsxs)(n.Hover, {
      tag: "span",
      className: `btn btn-${l} ${"sm"===s?"btn-sm":""} ${u?"btn-with-icon":""}`,
      from: {
        "--btn-hover": 0
      },
      to: {
        "--btn-hover": 1
      },
      config: {
        tension: 220,
        friction: 26
      },
      children: [c && (0, t.jsx)(o.BorderGlow, {}), (0, t.jsx)("span", {
        className: "btn-label",
        children: e
      }), u && (0, t.jsx)("span", {
        className: "btn-icon-circle",
        "aria-hidden": "true",
        children: u
      })]
    });
    return i ? (0, t.jsx)(r.default, {
      href: i,
      onClick: a,
      "aria-label": d,
      className: `btn-link ${f}`,
      children: p
    }) : (0, t.jsx)("button", {
      type: "button",
      onClick: a,
      "aria-label": d,
      className: `btn-link ${f}`,
      children: p
    })
  }])
}, 74813, e => {
  "use strict";
  let t = (0, e.i(68834).create)(e => ({
    open: !1,
    reason: null,
    show: t => e({
      open: !0,
      reason: t ?? null
    }),
    hide: () => e({
      open: !1,
      reason: null
    })
  }));
  e.s(["useSignInModal", 0, t])
}, 8388, e => {
  "use strict";
  let t = (0, e.i(68834).create)(e => ({
    complete: !1,
    markComplete: () => e({
      complete: !0
    })
  }));
  e.s(["useLoaderState", 0, t])
}]);