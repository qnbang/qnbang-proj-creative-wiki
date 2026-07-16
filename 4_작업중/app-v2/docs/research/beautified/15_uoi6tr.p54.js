(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["object" == typeof document ? document.currentScript : void 0, 63491, e => {
  "use strict";
  var r = e.i(43476),
    i = e.i(71645);
  e.s(["default", 0, function({
    error: e,
    reset: n
  }) {
    return (0, i.useEffect)(() => {
      console.error("[app/global-error]", e)
    }, [e]), (0, r.jsx)("html", {
      lang: "en",
      children: (0, r.jsx)("body", {
        style: {
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          background: "#060507",
          color: "#f5f4f7",
          fontFamily: "Onest, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"
        },
        children: (0, r.jsxs)("main", {
          style: {
            maxWidth: "32rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "1.25rem"
          },
          children: [(0, r.jsx)("p", {
            style: {
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#a3a1ad",
              fontWeight: 600,
              margin: 0
            },
            children: "500 · Something cracked"
          }), (0, r.jsx)("h1", {
            style: {
              fontSize: "2.25rem",
              fontWeight: 600,
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
              margin: 0
            },
            children: "Sorry — that didn’t work."
          }), (0, r.jsx)("p", {
            style: {
              fontSize: "1rem",
              lineHeight: 1.6,
              color: "#a3a1ad",
              margin: 0
            },
            children: "Something on our end is misbehaving. We’re already looking into it — give it a moment and try again. If you’re a Full Stack subscriber, drop a note in our private Discord and we’ll dig in with you."
          }), (0, r.jsx)("button", {
            type: "button",
            onClick: n,
            style: {
              marginTop: "0.5rem",
              padding: "0.55rem 1.2rem",
              borderRadius: "9999px",
              border: "1px solid rgba(255,255,255,0.16)",
              background: "rgba(255,255,255,0.06)",
              color: "#f5f4f7",
              fontSize: "0.95rem",
              cursor: "pointer"
            },
            children: "Try again"
          }), e.digest && (0, r.jsxs)("p", {
            style: {
              fontSize: "0.75rem",
              color: "#6a6873",
              margin: 0
            },
            children: ["Reference: ", (0, r.jsx)("code", {
              children: e.digest
            })]
          })]
        })
      })
    })
  }])
}]);