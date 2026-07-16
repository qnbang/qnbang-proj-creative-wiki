(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["object" == typeof document ? document.currentScript : void 0, 30843, e => {
  "use strict";
  var t = e.i(43476);
  let r = (0, e.i(70703).default)(() => e.A(40959).then(e => ({
    default: e.Cookie
  })), {
    loadableGenerated: {
      modules: [8356]
    },
    ssr: !1,
    loading: () => null
  });
  e.s(["LazyCookie", 0, function() {
    return (0, t.jsx)(r, {})
  }])
}, 59498, e => {
  "use strict";
  var t = e.i(43476),
    r = e.i(71645),
    a = e.i(18566),
    i = e.i(31973),
    n = e.i(46944),
    l = e.i(37203);

  function s() {
    return (0, l.useIsStaticMode)() ? null : (0, t.jsx)(o, {})
  }

  function o() {
    let e = (0, i.useScroll)(e => e.isEnableScroll),
      [t, l] = (0, r.useState)(""),
      [s, o] = (0, i.useScroll)((0, n.useShallow)(e => [e.lenis, e.setLenis])),
      d = (0, a.usePathname)(),
      u = (0, r.useRef)("");
    return (0, r.useEffect)(() => {
      window.scrollTo(0, 0);
      let e = t => {
        s?.raf(t), requestAnimationFrame(e)
      };
      return requestAnimationFrame(e), () => {
        o(null)
      }
    }, [o]), (0, r.useEffect)(() => {
      e ? (s?.start(), c(!0)) : (s?.stop(), c(!1))
    }, [e, s]), (0, r.useEffect)(() => {
      s && t && setTimeout(() => {
        ((e, t) => {
          let r = i.useScroll.getState().isEnableScroll;
          if ("string" == typeof e) {
            let a = document.getElementById(e);
            if (!a) return;
            r && i.useScroll.setState({
              isEnableScroll: !1
            }), setTimeout(() => {
              let e, r;
              window.scrollTo({
                top: (e = a.getBoundingClientRect(), r = window.pageYOffset || document.documentElement.scrollTop, e.top + r),
                behavior: t ? "instant" : "smooth"
              })
            }, 50)
          } else setTimeout(() => {
            window.scrollTo({
              top: Number(e) || 0,
              behavior: t ? "instant" : "smooth"
            })
          }, 50);
          r && setTimeout(() => {
            i.useScroll.setState({
              isEnableScroll: !0
            })
          }, 100)
        })(t, !0)
      }, 300)
    }, [s, t]), (0, r.useEffect)(() => {
      if (u.current !== d && (u.current = d, d.includes("#"))) {
        let e = d.split("#").pop();
        e && l(e)
      }
    }, [d, l]), (0, r.useEffect)(() => {
      let e = e => {
        let t;
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || 0 !== e.button) return;
        let r = e.target?.closest("a[href]");
        if (!r || r.target && "_self" !== r.target || !(r.getAttribute("href") ?? "").includes("#")) return;
        try {
          t = new URL(r.href, window.location.href)
        } catch {
          return
        }
        if (t.origin !== window.location.origin || t.pathname !== window.location.pathname || !t.hash) return;
        let a = t.hash.slice(1),
          i = document.getElementById(a);
        i && (e.preventDefault(), s ? s.scrollTo(i) : i.scrollIntoView({
          behavior: "smooth",
          block: "start"
        }))
      };
      return document.addEventListener("click", e), () => document.removeEventListener("click", e)
    }, [s]), null
  }
  let c = e => {
    if ("u" < typeof document || !document) return;
    let t = document.querySelector("html");
    t && (e ? (t.style.removeProperty("position"), t.style.removeProperty("overflow"), t.style.removeProperty("height")) : (t.style.position = "relative", t.style.overflow = "hidden", t.style.height = "100%"))
  };
  e.s(["ScrollLayout", 0, function({
    children: e
  }) {
    return (0, t.jsxs)("div", {
      className: "scroll-layout",
      children: [(0, t.jsx)("div", {
        className: "scroll-layout-content",
        children: e
      }), (0, t.jsx)(s, {})]
    })
  }, "scrollSpeed", 0, {
    current: 1
  }], 59498)
}, 11062, e => {
  "use strict";
  var t = e.i(71645);
  e.s(["AdaptiveGrid", 0, ({
    baseWidth: e = 1920,
    coef: r = .6666
  }) => {
    let a = (0, t.useCallback)(() => {
      let t = document.documentElement;
      if (!t) return;
      let a = 16 - (e - window.innerWidth) / e * 100 * r * 16 / 100;
      a > 16 ? t.style.setProperty("font-size", `${a}px`) : t.style.removeProperty("font-size")
    }, [e, r]);
    return (0, t.useEffect)(() => (a(), window.addEventListener("resize", a), () => window.removeEventListener("resize", a)), [a]), null
  }])
}, 62557, e => {
  "use strict";
  var t = e.i(71645),
    r = e.i(14283);
  e.s(["AuthHydration", 0, () => {
    let e = (0, r.useAuth)(e => e.hydrate);
    return (0, t.useEffect)(() => {
      e()
    }, [e]), null
  }])
}, 57113, e => {
  "use strict";
  var t = e.i(71645),
    r = e.i(88526);
  e.s(["SignupContextCapture", 0, () => ((0, t.useEffect)(() => {
    (0, r.captureFromBrowser)()
  }, []), null)])
}, 75331, e => {
  "use strict";
  var t = e.i(43476),
    r = e.i(71645),
    a = e.i(18566),
    i = e.i(48787),
    n = e.i(65658);
  e.s(["NavigationProgress", 0, () => {
    let e = (0, a.usePathname)(),
      [l, s] = (0, r.useState)(!1),
      [o, c] = (0, r.useState)(!1),
      d = (0, r.useRef)(null);
    (0, r.useEffect)(() => {
      let e = e => {
        let t;
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || 0 !== e.button) return;
        let r = e.target?.closest("a[href]");
        if (!r || r.target && "_self" !== r.target) return;
        let a = r.getAttribute("href") ?? "";
        if (!(!a || a.startsWith("#") || a.startsWith("mailto:") || a.startsWith("tel:"))) {
          try {
            t = new URL(r.href, window.location.href)
          } catch {
            return
          }
          t.origin !== window.location.origin || t.pathname !== window.location.pathname && (d.current = window.location.pathname, c(!1), s(!0))
        }
      };
      return document.addEventListener("click", e, !0), () => document.removeEventListener("click", e, !0)
    }, []), (0, r.useEffect)(() => {
      if (!l || e === d.current) return;
      c(!0);
      let t = setTimeout(() => {
        s(!1), c(!1), d.current = null
      }, 320);
      return () => clearTimeout(t)
    }, [e, l]);
    let u = (0, n.useSpring)({
        width: l ? o ? 100 : 88 : 0,
        config: l ? o ? {
          tension: 320,
          friction: 26
        } : {
          duration: 1100
        } : {
          tension: 220,
          friction: 24
        }
      }),
      m = (0, n.useSpring)({
        opacity: l && !o ? 1 : 0,
        config: {
          tension: 220,
          friction: 24
        }
      });
    return (0, t.jsx)(i.animated.div, {
      className: "nav-progress",
      style: {
        opacity: m.opacity
      },
      "aria-hidden": "true",
      children: (0, t.jsx)(i.animated.div, {
        className: "nav-progress-fill",
        style: {
          width: u.width.to(e => `${e}%`)
        }
      })
    })
  }])
}, 89439, e => {
  "use strict";
  var t = e.i(43476),
    r = e.i(71645),
    a = e.i(48787),
    i = e.i(65658),
    n = e.i(40803),
    l = e.i(14283),
    s = e.i(31973),
    o = e.i(8406),
    c = e.i(86337),
    d = e.i(62754),
    u = e.i(87968);
  let m = "gl-past-due-dismissed";
  e.s(["PastDueGate", 0, () => {
    let e = (0, l.useAuth)(e => e.subscription),
      f = (0, o.useToast)(e => e.show),
      [h, p] = (0, r.useState)(!1),
      [g, b] = (0, r.useState)(!1);
    (0, r.useEffect)(() => {
      if (!(0, c.isPastDue)(e)) return void p(!1);
      try {
        if ("1" === sessionStorage.getItem(m)) return void p(!1)
      } catch {}
      p(!0)
    }, [e]);
    let y = () => {
        p(!1);
        try {
          sessionStorage.setItem(m, "1")
        } catch {}
      },
      v = async () => {
        if (!g) {
          b(!0);
          try {
            let {
              url: e
            } = await (0, n.openSubscriptionPortalAction)();
            window.location.href = e
          } catch (e) {
            f(e instanceof d.ApiError ? e.message : "Couldn't open billing portal."), b(!1)
          }
        }
      };
    return (0, r.useEffect)(() => {
      if (!h) return;
      s.useScroll.setState({
        isEnableScroll: !1
      });
      let e = e => {
        "Escape" === e.key && y()
      };
      return window.addEventListener("keydown", e), () => {
        s.useScroll.setState({
          isEnableScroll: !0
        }), window.removeEventListener("keydown", e)
      }
    }, [h]), (0, i.useTransition)(h, {
      from: {
        opacity: 0,
        scale: .94,
        blur: 0
      },
      enter: {
        opacity: 1,
        scale: 1,
        blur: 10
      },
      leave: {
        opacity: 0,
        scale: .96,
        blur: 0
      },
      config: {
        tension: 280,
        friction: 30
      }
    })((r, i) => i ? (0, t.jsx)(a.animated.div, {
      className: "modal-backdrop modal-backdrop-centered",
      style: {
        opacity: r.opacity,
        backdropFilter: r.blur.to(e => `blur(${e}px)`),
        WebkitBackdropFilter: r.blur.to(e => `blur(${e}px)`)
      },
      onClick: y,
      children: (0, t.jsxs)(a.animated.div, {
        className: "modal-panel past-due-modal",
        style: {
          opacity: r.opacity,
          transform: r.scale.to(e => `scale(${e})`)
        },
        onClick: e => e.stopPropagation(),
        role: "alertdialog",
        "aria-modal": "true",
        "aria-labelledby": "past-due-title",
        children: [(0, t.jsx)("button", {
          type: "button",
          className: "modal-close",
          onClick: y,
          "aria-label": "Dismiss",
          children: (0, t.jsx)("svg", {
            viewBox: "0 0 16 16",
            fill: "none",
            "aria-hidden": "true",
            children: (0, t.jsx)("path", {
              d: "M4 4l8 8M12 4l-8 8",
              stroke: "currentColor",
              strokeWidth: "1.6",
              strokeLinecap: "round"
            })
          })
        }), (0, t.jsxs)("div", {
          className: "past-due-modal-head",
          children: [(0, t.jsx)("p", {
            className: "past-due-modal-eyebrow",
            children: "Payment failed"
          }), (0, t.jsxs)("h2", {
            id: "past-due-title",
            className: "modal-title",
            children: ["We couldn’t renew your ", e?.label ?? "plan"]
          }), (0, t.jsx)("p", {
            className: "modal-desc",
            children: "The latest charge to your card was declined. We’ll keep retrying for a short grace period, but updating your payment method now is the safest way to avoid losing access."
          })]
        }), (0, t.jsxs)("div", {
          className: "past-due-modal-actions",
          children: [(0, t.jsx)("button", {
            type: "button",
            className: "btn-tertiary",
            onClick: y,
            disabled: g,
            children: "Not now"
          }), (0, t.jsxs)("button", {
            type: "button",
            className: "btn-secondary profile-card-cta-urgent",
            onClick: v,
            disabled: g,
            "aria-busy": g,
            children: [g && (0, t.jsx)(u.Spinner, {}), g ? "Opening…" : "Update payment method"]
          })]
        })]
      })
    }) : null)
  }])
}, 27846, e => {
  "use strict";
  var t = e.i(43476),
    r = e.i(71645),
    a = e.i(22016),
    i = e.i(48787),
    n = e.i(65658),
    l = e.i(72562),
    s = e.i(37038),
    o = e.i(87968),
    c = e.i(14283),
    d = e.i(31973),
    u = e.i(74813),
    m = e.i(21104),
    f = e.i(53837),
    h = e.i(98877);
  let p = () => (0, t.jsxs)("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 18 18",
    "aria-hidden": "true",
    children: [(0, t.jsx)("path", {
      fill: "#4285F4",
      d: "M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z"
    }), (0, t.jsx)("path", {
      fill: "#34A853",
      d: "M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z"
    }), (0, t.jsx)("path", {
      fill: "#FBBC05",
      d: "M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.05l3.01-3.33Z"
    }), (0, t.jsx)("path", {
      fill: "#EA4335",
      d: "M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z"
    })]
  });
  e.s(["SignInModal", 0, () => {
    let e = (0, u.useSignInModal)(e => e.open),
      g = (0, u.useSignInModal)(e => e.reason),
      b = (0, u.useSignInModal)(e => e.hide),
      y = (0, c.useAuth)(e => e.applySession),
      v = (0, c.useAuth)(e => e.user),
      [x, w] = (0, r.useState)(""),
      [j, S] = (0, r.useState)(""),
      [k, N] = (0, r.useState)(!1),
      [E, C] = (0, r.useState)(null);
    (0, r.useEffect)(() => {
      e && v && b()
    }, [e, v, b]), (0, r.useEffect)(() => {
      if (!e) return;
      w(""), S(""), C(null), N(!1), d.useScroll.setState({
        isEnableScroll: !1
      });
      let t = e => {
        "Escape" === e.key && b()
      };
      return window.addEventListener("keydown", t), () => {
        d.useScroll.setState({
          isEnableScroll: !0
        }), window.removeEventListener("keydown", t)
      }
    }, [e, b]);
    let A = async e => {
      if (e.preventDefault(), !k) {
        if (!x.trim() || !j) return void C("Enter your email and password.");
        N(!0), C(null);
        try {
          let e = await (0, m.signInAction)({
            email: x.trim(),
            password: j
          });
          if ((0, h.isApiErrorResponse)(e)) {
            let t = (0, h.asApiError)(e._apiError);
            C(t.details?.email ?? t.details?.password ?? t.message), N(!1);
            return
          }
          y(e), b()
        } catch (e) {
          C(e instanceof Error ? e.message : "Something went wrong."), N(!1)
        }
      }
    }, I = async () => {
      if (!k) {
        N(!0), C(null);
        try {
          let e = window.location.pathname + window.location.search,
            {
              url: t
            } = await (0, f.signInWithGoogleAction)("/" !== e ? {
              next: e
            } : {});
          window.location.href = t
        } catch (e) {
          C(e instanceof Error ? e.message : "Couldn't start Google sign-in."), N(!1)
        }
      }
    };
    return (0, n.useTransition)(e, {
      from: {
        opacity: 0,
        scale: .94,
        blur: 0
      },
      enter: {
        opacity: 1,
        scale: 1,
        blur: 10
      },
      leave: {
        opacity: 0,
        scale: .96,
        blur: 0
      },
      config: {
        tension: 280,
        friction: 30
      }
    })((e, r) => r ? (0, t.jsx)(i.animated.div, {
      className: "modal-backdrop",
      style: {
        opacity: e.opacity,
        backdropFilter: e.blur.to(e => `blur(${e}px)`),
        WebkitBackdropFilter: e.blur.to(e => `blur(${e}px)`)
      },
      onClick: b,
      children: (0, t.jsxs)(i.animated.div, {
        className: "relative w-full max-w-[28rem]",
        "data-lenis-prevent": !0,
        style: {
          opacity: e.opacity,
          transform: e.scale.to(e => `scale(${e})`)
        },
        onClick: e => e.stopPropagation(),
        role: "dialog",
        "aria-modal": "true",
        "aria-label": "Sign in",
        children: [(0, t.jsx)("button", {
          type: "button",
          className: "modal-close",
          onClick: b,
          "aria-label": "Close",
          children: (0, t.jsx)("svg", {
            viewBox: "0 0 16 16",
            fill: "none",
            "aria-hidden": "true",
            children: (0, t.jsx)("path", {
              d: "M4 4l8 8M12 4l-8 8",
              stroke: "currentColor",
              strokeWidth: "1.6",
              strokeLinecap: "round"
            })
          })
        }), (0, t.jsxs)("div", {
          className: "glass auth-card signin-modal-card",
          children: [(0, t.jsx)(a.default, {
            href: "/",
            className: "auth-logo",
            onClick: b,
            children: (0, t.jsx)(l.Logo, {})
          }), (0, t.jsx)("h2", {
            className: "auth-title",
            children: "Welcome back"
          }), (0, t.jsx)("p", {
            className: "auth-sub",
            children: g ?? "Sign in to keep copying prompts."
          }), (0, t.jsxs)("div", {
            className: "flex w-full flex-col gap-2",
            children: [(0, t.jsxs)("button", {
              type: "button",
              className: "auth-google",
              onClick: I,
              disabled: k,
              children: [(0, t.jsx)(p, {}), "Continue with Google"]
            }), (0, t.jsx)("div", {
              className: "auth-divider",
              children: (0, t.jsx)("span", {
                children: "or"
              })
            }), (0, t.jsxs)("form", {
              className: "auth-form",
              onSubmit: A,
              noValidate: !0,
              children: [(0, t.jsx)("input", {
                className: "auth-input",
                type: "email",
                inputMode: "email",
                autoComplete: "email",
                placeholder: "Email address",
                value: x,
                onChange: e => w(e.target.value),
                disabled: k
              }), (0, t.jsx)(s.PasswordInput, {
                placeholder: "Password",
                autoComplete: "current-password",
                value: j,
                onChange: e => S(e.target.value),
                disabled: k,
                hasError: !!E
              }), E && (0, t.jsx)("p", {
                className: "auth-error",
                children: E
              }), (0, t.jsxs)("button", {
                type: "submit",
                className: "auth-submit btn-secondary",
                disabled: k,
                children: [k && (0, t.jsx)(o.Spinner, {}), k ? "Signing in…" : "Sign in"]
              })]
            })]
          }), (0, t.jsxs)("p", {
            className: "auth-switch",
            children: ["New to getlayers?", " ", (0, t.jsx)(a.default, {
              href: "/sign-up",
              onClick: b,
              children: "Create one"
            })]
          })]
        })]
      })
    }) : null)
  }])
}, 74352, e => {
  "use strict";
  var t = e.i(43476),
    r = e.i(71645),
    a = e.i(22016),
    i = e.i(95187);
  let n = (0, i.createServerReference)("00af5be1f0bda19bebb63dac1f8483965041a55215", i.callServer, void 0, i.findSourceMapURL, "getCurrentPromoAction");
  var l = e.i(14283),
    s = e.i(37203);
  let o = () => (0, t.jsxs)("svg", {
      viewBox: "0 0 16 16",
      fill: "none",
      "aria-hidden": "true",
      children: [(0, t.jsx)("circle", {
        cx: "8",
        cy: "8",
        r: "6.4",
        stroke: "currentColor",
        strokeWidth: "1.8"
      }), (0, t.jsx)("path", {
        d: "M8 4.6V8l2.6 1.6",
        stroke: "currentColor",
        strokeWidth: "1.8",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      })]
    }),
    c = e => e.toString().padStart(2, "0"),
    d = "gl-promo-cycle";

  function u(e) {
    try {
      window.localStorage.setItem(d, JSON.stringify(e))
    } catch {}
  }
  e.s(["PromoBanner", 0, () => {
    let e, i, m, f = (0, s.useIsStaticMode)(),
      [h, p] = (0, r.useState)(null),
      [g, b] = (0, r.useState)(null),
      y = (0, l.useAuth)(e => e.user),
      v = (0, l.useAuth)(e => e.updateUser),
      x = (0, l.useAuth)(e => e.hydrated),
      w = `${y?.id??"anon"}::${y?.plan??"free"}`;
    if ((0, r.useEffect)(() => {
        if (f || !x) return;
        let e = !1;
        return n().then(t => {
          e || p(t)
        }), () => {
          e = !0
        }
      }, [f, x, w]), (0, r.useEffect)(() => {
        let e;
        if (!h) return void b(null);
        if ("deadline" === h.mode) {
          if (!h.endsAt) return;
          let t = new Date(h.endsAt).getTime();
          if (Number.isNaN(t)) return;
          e = t
        } else if ("rolling" === h.mode) {
          if (!h.initialHours || h.initialHours <= 0) return;
          let t = 3600 * h.initialHours * 1e3;
          e = function(e, t, r, a) {
            let i = Date.now();
            if (r?.promoAnchor) {
              let {
                promoId: a,
                anchorAt: n
              } = r.promoAnchor;
              if (a === e && i < n + t) return u({
                id: a,
                anchorAt: n
              }), n
            }
            let n = function() {
              try {
                let e = window.localStorage.getItem(d);
                return e ? JSON.parse(e) : null
              } catch {
                return null
              }
            }();
            return n && n.id === e && i < n.anchorAt + t ? (r && !r.promoAnchor && a({
              promoAnchor: {
                promoId: e,
                anchorAt: n.anchorAt
              }
            }), n.anchorAt) : (u({
              id: e,
              anchorAt: i
            }), r && a({
              promoAnchor: {
                promoId: e,
                anchorAt: i
              }
            }), i)
          }(h.promoId, t, y, e => {
            v(e)
          }) + t
        } else e = null;
        if (null === e) return void b(1 / 0);
        let t = () => b(e - Date.now());
        t();
        let r = window.setInterval(t, 1e3),
          a = () => {
            window.clearInterval(r), "visible" === document.visibilityState && (t(), r = window.setInterval(t, 1e3))
          };
        return document.addEventListener("visibilitychange", a), () => {
          window.clearInterval(r), document.removeEventListener("visibilitychange", a)
        }
      }, [h, y, v]), (0, r.useEffect)(() => {
        if (h && null !== g && !(g <= 0)) return document.body.style.setProperty("--promo-height", "2.4rem"), () => {
          document.body.style.removeProperty("--promo-height")
        }
      }, [h, g]), !h || null === g || g <= 0) return null;
    let j = h.href ?? "/pricing",
      S = Number.isFinite(g),
      k = (0, t.jsxs)(t.Fragment, {
        children: [S && (0, t.jsx)("span", {
          className: "promo-banner-icon",
          "aria-hidden": "true",
          children: (0, t.jsx)(o, {})
        }), (0, t.jsx)("span", {
          className: "promo-banner-label-mobile",
          children: "Early Access"
        }), (0, t.jsx)("span", {
          className: "promo-banner-label",
          children: h.label
        }), (0, t.jsx)("span", {
          className: "promo-banner-divider",
          "aria-hidden": "true",
          children: "—"
        }), h.oldPrice && (0, t.jsx)("span", {
          className: "promo-banner-strike",
          children: h.oldPrice
        }), (0, t.jsx)("span", {
          children: "now"
        }), (0, t.jsx)("span", {
          className: "promo-banner-amount",
          children: h.newPrice
        }), S && (0, t.jsxs)(t.Fragment, {
          children: [(0, t.jsx)("span", {
            className: "promo-banner-divider",
            "aria-hidden": "true",
            children: "—"
          }), (0, t.jsxs)("span", {
            className: "promo-banner-time",
            "aria-live": "off",
            children: [(i = Math.floor((e = Math.max(0, Math.floor(g / 1e3))) / 3600), m = Math.floor(e % 3600 / 60), `${c(i)}:${c(m)}:${c(e%60)}`), " left"]
          })]
        })]
      });
    return (0, t.jsx)("div", {
      className: "promo-banner",
      role: "region",
      "aria-label": h.label,
      children: (0, t.jsx)(a.default, {
        href: j,
        className: "promo-banner-link",
        children: k
      })
    })
  }], 74352)
}, 90944, e => {
  "use strict";
  var t = e.i(71645),
    r = e.i(95187);
  let a = (0, r.createServerReference)("406b8cba7ee18ba37cd7d5209c9f1089c9b06b1cbb", r.callServer, void 0, r.findSourceMapURL, "recordSessionAction"),
    i = "gl-session-tracked";
  e.s(["SessionTracker", 0, () => ((0, t.useEffect)(() => {
    try {
      if ("1" === sessionStorage.getItem(i)) return;
      sessionStorage.setItem(i, "1")
    } catch {}
    let e = (() => {
      try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone
      } catch {
        return
      }
    })();
    a({
      languages: Array.from(navigator.languages ?? []),
      timezone: e,
      referrer: document.referrer || void 0,
      landingPath: window.location.pathname
    })
  }, []), null)], 90944)
}, 8341, (e, t, r) => {
  "use strict";
  Object.defineProperty(r, "__esModule", {
    value: !0
  });
  var a = {
    cancelIdleCallback: function() {
      return l
    },
    requestIdleCallback: function() {
      return n
    }
  };
  for (var i in a) Object.defineProperty(r, i, {
    enumerable: !0,
    get: a[i]
  });
  let n = "u" > typeof self && self.requestIdleCallback && self.requestIdleCallback.bind(window) || function(e) {
      let t = Date.now();
      return self.setTimeout(function() {
        e({
          didTimeout: !1,
          timeRemaining: function() {
            return Math.max(0, 50 - (Date.now() - t))
          }
        })
      }, 1)
    },
    l = "u" > typeof self && self.cancelIdleCallback && self.cancelIdleCallback.bind(window) || function(e) {
      return clearTimeout(e)
    };
  ("function" == typeof r.default || "object" == typeof r.default && null !== r.default) && void 0 === r.default.__esModule && (Object.defineProperty(r.default, "__esModule", {
    value: !0
  }), Object.assign(r.default, r), t.exports = r.default)
}, 79520, (e, t, r) => {
  "use strict";
  Object.defineProperty(r, "__esModule", {
    value: !0
  });
  var a = {
    default: function() {
      return v
    },
    handleClientScriptLoad: function() {
      return g
    },
    initScriptLoader: function() {
      return b
    }
  };
  for (var i in a) Object.defineProperty(r, i, {
    enumerable: !0,
    get: a[i]
  });
  let n = e.r(55682),
    l = e.r(90809),
    s = e.r(43476),
    o = n._(e.r(74080)),
    c = l._(e.r(71645)),
    d = e.r(42732),
    u = e.r(22737),
    m = e.r(8341),
    f = new Map,
    h = new Set,
    p = e => {
      let {
        src: t,
        id: r,
        onLoad: a = () => {},
        onReady: i = null,
        dangerouslySetInnerHTML: n,
        children: l = "",
        strategy: s = "afterInteractive",
        onError: c,
        stylesheets: d
      } = e, m = r || t;
      if (m && h.has(m)) return;
      if (f.has(t)) {
        h.add(m), f.get(t).then(a, c);
        return
      }
      let p = () => {
          i && i(), h.add(m)
        },
        g = document.createElement("script"),
        b = new Promise((e, t) => {
          g.addEventListener("load", function(t) {
            e(), a && a.call(this, t), p()
          }), g.addEventListener("error", function(e) {
            t(e)
          })
        }).catch(function(e) {
          c && c(e)
        });
      n ? (g.innerHTML = n.__html || "", p()) : l ? (g.textContent = "string" == typeof l ? l : Array.isArray(l) ? l.join("") : "", p()) : t && (g.src = t, f.set(t, b)), (0, u.setAttributesFromProps)(g, e), "worker" === s && g.setAttribute("type", "text/partytown"), g.setAttribute("data-nscript", s), d && (e => {
        if (o.default.preinit) return e.forEach(e => {
          o.default.preinit(e, {
            as: "style"
          })
        });
        if ("u" > typeof window) {
          let t = document.head;
          e.forEach(e => {
            let r = document.createElement("link");
            r.type = "text/css", r.rel = "stylesheet", r.href = e, t.appendChild(r)
          })
        }
      })(d), document.body.appendChild(g)
    };

  function g(e) {
    let {
      strategy: t = "afterInteractive"
    } = e;
    "lazyOnload" === t ? window.addEventListener("load", () => {
      (0, m.requestIdleCallback)(() => p(e))
    }) : p(e)
  }

  function b(e) {
    e.forEach(g), [...document.querySelectorAll('[data-nscript="beforeInteractive"]'), ...document.querySelectorAll('[data-nscript="beforePageRender"]')].forEach(e => {
      let t = e.id || e.getAttribute("src");
      h.add(t)
    })
  }

  function y(e) {
    let {
      id: t,
      src: r = "",
      onLoad: a = () => {},
      onReady: i = null,
      strategy: n = "afterInteractive",
      onError: l,
      stylesheets: u,
      ...f
    } = e, {
      updateScripts: g,
      scripts: b,
      getIsSsr: y,
      appDir: v,
      nonce: x
    } = (0, c.useContext)(d.HeadManagerContext);
    x = f.nonce || x;
    let w = (0, c.useRef)(!1);
    (0, c.useEffect)(() => {
      let e = t || r;
      w.current || (i && e && h.has(e) && i(), w.current = !0)
    }, [i, t, r]);
    let j = (0, c.useRef)(!1);
    if ((0, c.useEffect)(() => {
        if (!j.current) {
          if ("afterInteractive" === n) p(e);
          else "lazyOnload" === n && ("complete" === document.readyState ? (0, m.requestIdleCallback)(() => p(e)) : window.addEventListener("load", () => {
            (0, m.requestIdleCallback)(() => p(e))
          }));
          j.current = !0
        }
      }, [e, n]), ("beforeInteractive" === n || "worker" === n) && (g ? (b[n] = (b[n] || []).concat([{
        id: t,
        src: r,
        onLoad: a,
        onReady: i,
        onError: l,
        ...f,
        nonce: x
      }]), g(b)) : y && y() ? h.add(t || r) : y && !y() && p({
        ...e,
        nonce: x
      })), v) {
      if (u && u.forEach(e => {
          o.default.preinit(e, {
            as: "style"
          })
        }), "beforeInteractive" === n)
        if (!r) return f.dangerouslySetInnerHTML && (f.children = f.dangerouslySetInnerHTML.__html, delete f.dangerouslySetInnerHTML), (0, s.jsx)("script", {
          nonce: x,
          dangerouslySetInnerHTML: {
            __html: `(self.__next_s=self.__next_s||[]).push(${JSON.stringify([0,{...f,id:t}])})`
          }
        });
        else return o.default.preload(r, f.integrity ? {
          as: "script",
          integrity: f.integrity,
          nonce: x,
          crossOrigin: f.crossOrigin
        } : {
          as: "script",
          nonce: x,
          crossOrigin: f.crossOrigin
        }), (0, s.jsx)("script", {
          nonce: x,
          dangerouslySetInnerHTML: {
            __html: `(self.__next_s=self.__next_s||[]).push(${JSON.stringify([r,{...f,id:t}])})`
          }
        });
      "afterInteractive" === n && r && o.default.preload(r, f.integrity ? {
        as: "script",
        integrity: f.integrity,
        nonce: x,
        crossOrigin: f.crossOrigin
      } : {
        as: "script",
        nonce: x,
        crossOrigin: f.crossOrigin
      })
    }
    return null
  }
  Object.defineProperty(y, "__nextScript", {
    value: !0
  });
  let v = y;
  ("function" == typeof r.default || "object" == typeof r.default && null !== r.default) && void 0 === r.default.__esModule && (Object.defineProperty(r.default, "__esModule", {
    value: !0
  }), Object.assign(r.default, r), t.exports = r.default)
}, 3303, (e, t, r) => {
  t.exports = e.r(79520)
}, 7966, e => {
  "use strict";
  var t = e.i(43476),
    r = e.i(3303),
    a = e.i(18566),
    i = e.i(71645),
    n = e.i(37203);
  e.s(["GoogleAnalytics", 0, ({
    measurementId: e
  }) => {
    let l = (0, n.useIsStaticMode)(),
      s = (0, a.usePathname)(),
      o = (0, a.useSearchParams)();
    return ((0, i.useEffect)(() => {
      if (l || !e) return;
      let t = window.setTimeout(() => {
        window.gtag?.("event", "page_view", {
          page_path: s + (o?.toString() ? `?${o.toString()}` : "")
        })
      }, 0);
      return () => window.clearTimeout(t)
    }, [s, o, e, l]), l || !e) ? null : (0, t.jsxs)(t.Fragment, {
      children: [(0, t.jsx)(r.default, {
        id: "ga4-loader",
        src: `https://www.googletagmanager.com/gtag/js?id=${e}`,
        strategy: "afterInteractive"
      }), (0, t.jsx)(r.default, {
        id: "ga4-init",
        strategy: "afterInteractive",
        children: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${e}', { send_page_view: true });
        `
      })]
    })
  }])
}, 13408, e => {
  "use strict";
  var t = e.i(43476),
    r = e.i(71645),
    a = e.i(48787),
    i = e.i(65658),
    n = e.i(72562),
    l = e.i(37203),
    s = e.i(8388);
  e.s(["Loader", 0, () => {
    let e = (0, l.useIsStaticMode)(),
      [o, c] = (0, r.useState)(!e),
      d = (0, s.useLoaderState)(e => e.markComplete);
    (0, r.useEffect)(() => {
      if (e) return;
      if (sessionStorage.getItem("gl-loaded")) return void c(!1);
      let t = setTimeout(() => {
        sessionStorage.setItem("gl-loaded", "1"), c(!1)
      }, 1600);
      return () => clearTimeout(t)
    }, [e]), (0, r.useEffect)(() => {
      (e || !o) && d()
    }, [e, o, d]);
    let u = (0, i.useTransition)(o, {
      from: {
        opacity: 1
      },
      enter: {
        opacity: 1
      },
      leave: {
        opacity: 0
      },
      config: {
        tension: 220,
        friction: 30
      }
    });
    return e ? null : u((e, r) => r ? (0, t.jsxs)(a.animated.div, {
      className: "loader",
      style: {
        opacity: e.opacity
      },
      children: [(0, t.jsx)("div", {
        className: "loader-border",
        "aria-hidden": "true"
      }), (0, t.jsx)("div", {
        className: "loader-center",
        children: (0, t.jsx)(n.Logo, {})
      })]
    }) : null)
  }])
}, 77855, e => {
  "use strict";
  var t = e.i(43476),
    r = e.i(71645),
    a = e.i(48787),
    i = e.i(65658),
    n = e.i(8406);
  e.s(["Toaster", 0, () => {
    let e = (0, n.useToast)(e => e.message),
      l = (0, n.useToast)(e => e.variant),
      s = (0, n.useToast)(e => e.hide);
    return (0, r.useEffect)(() => {
      if (!e) return;
      let t = setTimeout(s, 3400);
      return () => clearTimeout(t)
    }, [e, s]), (0, i.useTransition)(e, {
      from: {
        opacity: 0,
        y: 16
      },
      enter: {
        opacity: 1,
        y: 0
      },
      leave: {
        opacity: 0,
        y: 16
      },
      config: {
        tension: 300,
        friction: 26
      }
    })((e, r) => r ? (0, t.jsx)(a.animated.div, {
      className: `toast ${"error"===l?"toast--error":""}`,
      role: "alert",
      style: {
        opacity: e.opacity,
        transform: e.y.to(e => `translate(-50%, ${e}px)`)
      },
      children: r
    }) : null)
  }])
}, 39420, e => {
  "use strict";
  var t = e.i(43476),
    r = e.i(71645),
    a = e.i(22016),
    i = e.i(18566),
    n = e.i(48787),
    l = e.i(65658),
    s = e.i(23301),
    o = e.i(78661),
    c = e.i(19455),
    d = e.i(72562),
    u = e.i(57043),
    m = e.i(34631),
    f = e.i(14283),
    h = e.i(31973),
    p = e.i(86337);
  let g = e => e.split("#")[0] || "/",
    b = () => (0, t.jsx)("svg", {
      viewBox: "0 0 20 20",
      fill: "none",
      "aria-hidden": "true",
      children: (0, t.jsx)("path", {
        d: "M3 6h14M3 10h14M3 14h14",
        stroke: "currentColor",
        strokeWidth: "1.6",
        strokeLinecap: "round"
      })
    }),
    y = () => (0, t.jsx)("svg", {
      viewBox: "0 0 20 20",
      fill: "none",
      "aria-hidden": "true",
      children: (0, t.jsx)("path", {
        d: "M5 5l10 10M15 5L5 15",
        stroke: "currentColor",
        strokeWidth: "1.6",
        strokeLinecap: "round"
      })
    });
  e.s(["HomeHeader", 0, ({
    links: e,
    signIn: v,
    goUnlimited: x
  }) => {
    let w = (0, i.usePathname)(),
      j = (0, f.useAuth)(e => e.user),
      S = (0, f.useAuth)(e => e.subscription),
      [k, N] = (0, r.useState)(!1);
    (0, r.useEffect)(() => N(!0), []);
    let E = k && (0, p.hasFullStack)(j),
      C = k && (0, p.hasUnlimited)(j),
      A = k && (0, p.isSubscriber)(j),
      I = k && (0, p.isPastDue)(S),
      [L, M] = (0, r.useState)(!1);
    (0, r.useEffect)(() => {
      M(!1)
    }, [w]), (0, r.useEffect)(() => {
      if (!L) return;
      h.useScroll.setState({
        isEnableScroll: !1
      });
      let e = e => {
        "Escape" === e.key && M(!1)
      };
      return window.addEventListener("keydown", e), () => {
        h.useScroll.setState({
          isEnableScroll: !0
        }), window.removeEventListener("keydown", e)
      }
    }, [L]);
    let _ = (0, l.useTransition)(L, {
      from: {
        opacity: 0,
        y: -18,
        blur: 0
      },
      enter: {
        opacity: 1,
        y: 0,
        blur: 12
      },
      leave: {
        opacity: 0,
        y: -10,
        blur: 0
      },
      config: {
        tension: 280,
        friction: 28
      }
    });
    return (0, t.jsxs)(t.Fragment, {
      children: [(0, t.jsxs)(s.Spring, {
        tag: "header",
        mode: "once",
        from: {
          opacity: 0
        },
        to: {
          opacity: 1
        },
        config: {
          tension: 130,
          friction: 21
        },
        className: "fixed inset-x-0 top-[var(--promo-height,0px)] z-50 grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3.5 md:grid-cols-[1fr_auto_1fr] md:gap-4",
        children: [(0, t.jsx)("div", {
          className: "header-bar",
          "aria-hidden": "true"
        }), (0, t.jsxs)(a.default, {
          href: "/",
          "aria-label": "getlayers — home",
          className: "relative justify-self-start",
          children: [(0, t.jsx)("span", {
            className: "glass header-logo-tile md:hidden",
            children: (0, t.jsx)(d.Logo, {
              showWordmark: !1
            })
          }), (0, t.jsx)("span", {
            className: "hidden md:inline-flex",
            children: (0, t.jsx)(d.Logo, {})
          })]
        }), (0, t.jsx)("nav", {
          className: "glass glass-header relative hidden items-center gap-0.5 rounded-[var(--radius-pill)] px-1.5 py-1.5 md:flex",
          "aria-label": "Primary",
          children: e.map(e => {
            let r = w === g(e.href);
            return (0, t.jsxs)(a.default, {
              href: e.href,
              className: `nav-link ${r?"nav-link-active":""}`,
              "aria-current": r ? "page" : void 0,
              children: [e.label, "new" === e.badge && (0, t.jsx)("span", {
                className: "nav-badge-new",
                children: "New"
              })]
            }, e.label)
          })
        }), (0, t.jsx)("div", {
          className: "md:hidden",
          "aria-hidden": "true"
        }), k && j ? (0, t.jsxs)(a.default, {
          href: "/profile",
          className: "header-account relative hidden justify-self-end md:inline-flex",
          children: [(0, t.jsx)(m.UserAvatar, {
            email: j.email,
            size: 26,
            className: "header-account-avatar"
          }), j.name.split(" ")[0], (0, t.jsxs)("span", {
            className: `header-account-plan${A?" header-account-plan-paid":""}${I?" header-account-plan-unpaid":""}`,
            title: I ? "Payment failed — update your card" : void 0,
            children: [A && !I && (0, t.jsx)(u.SparkIcon, {}), j.plan, I && (0, t.jsx)("span", {
              className: "header-account-plan-flag",
              children: " · Unpaid"
            })]
          })]
        }) : (0, t.jsxs)(a.default, {
          href: v.href,
          className: "header-account relative hidden justify-self-end md:inline-flex",
          children: [(0, t.jsxs)("svg", {
            width: "16",
            height: "16",
            viewBox: "0 0 16 16",
            fill: "none",
            "aria-hidden": "true",
            children: [(0, t.jsx)("circle", {
              cx: "8",
              cy: "5",
              r: "3",
              stroke: "currentColor",
              strokeWidth: "1.4"
            }), (0, t.jsx)("path", {
              d: "M2.5 14c0-3 2.5-4.6 5.5-4.6s5.5 1.6 5.5 4.6",
              stroke: "currentColor",
              strokeWidth: "1.4",
              strokeLinecap: "round"
            })]
          }), v.label]
        }), (0, t.jsx)("button", {
          type: "button",
          className: "glass header-burger relative justify-self-end md:hidden",
          onClick: () => M(e => !e),
          "aria-label": L ? "Close menu" : "Open menu",
          "aria-expanded": L,
          "aria-controls": "mobile-menu",
          children: L ? (0, t.jsx)(y, {}) : (0, t.jsx)(b, {})
        })]
      }), _((r, i) => i ? (0, t.jsxs)(t.Fragment, {
        children: [(0, t.jsx)(n.animated.div, {
          className: "mobile-menu-backdrop md:hidden",
          style: {
            opacity: r.opacity,
            backdropFilter: r.blur.to(e => `blur(${e}px)`),
            WebkitBackdropFilter: r.blur.to(e => `blur(${e}px)`)
          },
          onClick: () => M(!1),
          "aria-hidden": "true"
        }), (0, t.jsxs)(n.animated.div, {
          className: "mobile-menu-stack md:hidden",
          style: {
            opacity: r.opacity,
            transform: r.y.to(e => `translateY(${e}px)`)
          },
          children: [(0, t.jsxs)("div", {
            id: "mobile-menu",
            className: "mobile-menu-panel",
            role: "dialog",
            "aria-modal": "true",
            "aria-label": "Menu",
            children: [(0, t.jsx)("p", {
              className: "mobile-menu-section-title",
              children: "Pages"
            }), (0, t.jsx)("nav", {
              "aria-label": "Mobile",
              children: (0, t.jsx)("ul", {
                className: "mobile-menu-list",
                children: e.map(e => {
                  let r = w === g(e.href);
                  return (0, t.jsx)("li", {
                    children: (0, t.jsxs)(a.default, {
                      href: e.href,
                      className: `mobile-menu-link ${r?"mobile-menu-link-active":""}`,
                      onClick: () => M(!1),
                      "aria-current": r ? "page" : void 0,
                      children: [e.label, "new" === e.badge && (0, t.jsx)("span", {
                        className: "nav-badge-new",
                        children: "New"
                      })]
                    })
                  }, e.label)
                })
              })
            }), (0, t.jsx)("div", {
              className: "mobile-menu-footer",
              children: k && j ? (0, t.jsxs)(a.default, {
                href: "/profile",
                className: "mobile-menu-account",
                onClick: () => M(!1),
                children: [(0, t.jsx)(m.UserAvatar, {
                  email: j.email,
                  size: 36,
                  radius: "0.65rem"
                }), (0, t.jsxs)("span", {
                  className: "mobile-menu-account-text",
                  children: [(0, t.jsx)("span", {
                    className: "mobile-menu-account-name",
                    children: j.name
                  }), (0, t.jsxs)("span", {
                    className: "mobile-menu-account-plan",
                    children: [j.plan, " plan", I && (0, t.jsxs)("span", {
                      className: "header-account-plan-flag",
                      children: [" ", "· Unpaid"]
                    })]
                  })]
                })]
              }) : (0, t.jsx)(a.default, {
                href: v.href,
                className: "mobile-menu-account mobile-menu-account-signin",
                onClick: () => M(!1),
                children: v.label
              })
            })]
          }), C ? (0, t.jsxs)("div", {
            className: "mobile-menu-upgrade glass",
            children: [(0, t.jsx)("h3", {
              className: "mobile-menu-upgrade-title",
              children: "Upgrade to Full Stack"
            }), (0, t.jsx)("p", {
              className: "mobile-menu-upgrade-text",
              children: "Get into our Private Discord Community and your work featured to our 17k+ audience."
            }), (0, t.jsx)("div", {
              className: "mobile-cta mobile-menu-upgrade-cta",
              children: (0, t.jsx)(c.Button, {
                variant: "accent",
                icon: (0, t.jsx)(o.AnimatedSpark, {}),
                borderGlow: !0,
                size: "sm",
                href: "/pricing",
                onClick: () => M(!1),
                children: "Upgrade to Full Stack"
              })
            })]
          }) : E ? null : (0, t.jsxs)("div", {
            className: "mobile-menu-upgrade glass",
            children: [(0, t.jsx)("h3", {
              className: "mobile-menu-upgrade-title",
              children: x.title
            }), (0, t.jsx)("p", {
              className: "mobile-menu-upgrade-text",
              children: x.text
            }), (0, t.jsx)("div", {
              className: "mobile-cta mobile-menu-upgrade-cta",
              children: (0, t.jsx)(c.Button, {
                variant: "accent",
                icon: (0, t.jsx)(o.AnimatedSpark, {}),
                borderGlow: !0,
                size: "sm",
                href: x.href,
                onClick: () => M(!1),
                children: x.cta
              })
            })]
          })]
        })]
      }) : null)]
    })
  }])
}]);