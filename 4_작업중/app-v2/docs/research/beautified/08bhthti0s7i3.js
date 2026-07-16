(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["object" == typeof document ? document.currentScript : void 0, 48787, 7027, 65658, e => {
  "use strict";
  var t, n, r, i, s, a = _(),
    o = e => v(e, a),
    l = _();
  o.write = e => v(e, l);
  var u = _();
  o.onStart = e => v(e, u);
  var f = _();
  o.onFrame = e => v(e, f);
  var d = _();
  o.onFinish = e => v(e, d);
  var c = [];
  o.setTimeout = (e, t) => {
    let n = o.now() + t,
      r = () => {
        let e = c.findIndex(e => e.cancel == r);
        ~e && c.splice(e, 1), g -= !!~e
      },
      i = {
        time: n,
        handler: e,
        cancel: r
      };
    return c.splice(h(n), 0, i), g += 1, x(), i
  };
  var h = e => ~(~c.findIndex(t => t.time > e) || ~c.length);
  o.cancel = e => {
    u.delete(e), f.delete(e), d.delete(e), a.delete(e), l.delete(e)
  }, o.sync = e => {
    y = !0, o.batchedUpdates(e), y = !1
  }, o.throttle = e => {
    let t;

    function n() {
      try {
        e(...t)
      } finally {
        t = null
      }
    }

    function r(...e) {
      t = e, o.onStart(n)
    }
    return r.handler = e, r.cancel = () => {
      u.delete(n), t = null
    }, r
  };
  var p = "u" > typeof window ? window.requestAnimationFrame : () => {};
  o.use = e => p = e, o.now = "u" > typeof performance ? () => performance.now() : Date.now, o.batchedUpdates = e => e(), o.catch = console.error, o.frameLoop = "always", o.advance = () => {
    "demand" !== o.frameLoop ? console.warn("Cannot call the manual advancement of rafz whilst frameLoop is not set as demand") : w()
  };
  var m = -1,
    g = 0,
    y = !1;

  function v(e, t) {
    y ? (t.delete(e), e(0)) : (t.add(e), x())
  }

  function x() {
    m < 0 && (m = 0, "demand" !== o.frameLoop && p(b))
  }

  function b() {
    ~m && (p(b), o.batchedUpdates(w))
  }

  function w() {
    let e = m,
      t = h(m = o.now());
    (t && (k(c.splice(0, t), e => e.handler()), g -= t), g) ? (u.flush(), a.flush(e ? Math.min(64, m - e) : 16.667), f.flush(), l.flush(), d.flush()) : m = -1
  }

  function _() {
    let e = new Set,
      t = e;
    return {
      add(n) {
        g += +!(t != e || e.has(n)), e.add(n)
      },
      delete: n => (g -= t == e && e.has(n) ? 1 : 0, e.delete(n)),
      flush(n) {
        t.size && (e = new Set, g -= t.size, k(t, t => t(n) && e.add(t)), g += e.size, t = e)
      }
    }
  }

  function k(e, t) {
    e.forEach(e => {
      try {
        t(e)
      } catch (e) {
        o.catch(e)
      }
    })
  }
  var M = e.i(71645),
    I = Object.defineProperty,
    P = {},
    S = {
      assign: () => U,
      colors: () => T,
      createStringInterpolator: () => t,
      skipAnimation: () => L,
      to: () => n,
      willAdvance: () => Q
    };
  for (var O in S) I(P, O, {
    get: S[O],
    enumerable: !0
  });

  function A() {}
  var E = (e, t, n) => Object.defineProperty(e, t, {
      value: n,
      writable: !0,
      configurable: !0
    }),
    C = {
      arr: Array.isArray,
      obj: e => !!e && "Object" === e.constructor.name,
      fun: e => "function" == typeof e,
      str: e => "string" == typeof e,
      num: e => "number" == typeof e,
      und: e => void 0 === e
    };

  function R(e, t) {
    if (C.arr(e)) {
      if (!C.arr(t) || e.length !== t.length) return !1;
      for (let n = 0; n < e.length; n++)
        if (e[n] !== t[n]) return !1;
      return !0
    }
    return e === t
  }
  var V = (e, t) => e.forEach(t);

  function z(e, t, n) {
    if (C.arr(e)) {
      for (let r = 0; r < e.length; r++) t.call(n, e[r], `${r}`);
      return
    }
    for (let r in e) e.hasOwnProperty(r) && t.call(n, e[r], r)
  }
  var j = e => C.und(e) ? [] : C.arr(e) ? e : [e];

  function F(e, t) {
    if (e.size) {
      let n = Array.from(e);
      e.clear(), V(n, t)
    }
  }
  var q = (e, ...t) => F(e, e => e(...t)),
    $ = () => "u" < typeof window || !window.navigator || /ServerSideRendering|^Deno\//.test(window.navigator.userAgent),
    T = null,
    L = !1,
    Q = A,
    U = e => {
      e.to && (n = e.to), e.now && (o.now = e.now), void 0 !== e.colors && (T = e.colors), null != e.skipAnimation && (L = e.skipAnimation), e.createStringInterpolator && (t = e.createStringInterpolator), e.requestAnimationFrame && o.use(e.requestAnimationFrame), e.batchedUpdates && (o.batchedUpdates = e.batchedUpdates), e.willAdvance && (Q = e.willAdvance), e.frameLoop && (o.frameLoop = e.frameLoop)
    },
    N = new Set,
    D = [],
    W = [],
    B = 0,
    G = {
      get idle() {
        return !N.size && !D.length
      },
      start(e) {
        B > e.priority ? (N.add(e), o.onStart(H)) : (Z(e), o(J))
      },
      advance: J,
      sort(e) {
        if (B) o.onFrame(() => G.sort(e));
        else {
          let t = D.indexOf(e);
          ~t && (D.splice(t, 1), K(e))
        }
      },
      clear() {
        D = [], N.clear()
      }
    };

  function H() {
    N.forEach(Z), N.clear(), o(J)
  }

  function Z(e) {
    D.includes(e) || K(e)
  }

  function K(e) {
    var t, n;
    let r;
    D.splice((t = D, n = t => t.priority > e.priority, (r = t.findIndex(n)) < 0 ? t.length : r), 0, e)
  }

  function J(e) {
    let t = W;
    for (let n = 0; n < D.length; n++) {
      let r = D[n];
      B = r.priority, !r.idle && (Q(r), r.advance(e), r.idle || t.push(r))
    }
    return B = 0, (W = D).length = 0, (D = t).length > 0
  }
  var X = {
      transparent: 0,
      aliceblue: 0xf0f8ffff,
      antiquewhite: 0xfaebd7ff,
      aqua: 0xffffff,
      aquamarine: 0x7fffd4ff,
      azure: 0xf0ffffff,
      beige: 0xf5f5dcff,
      bisque: 0xffe4c4ff,
      black: 255,
      blanchedalmond: 0xffebcdff,
      blue: 65535,
      blueviolet: 0x8a2be2ff,
      brown: 0xa52a2aff,
      burlywood: 0xdeb887ff,
      burntsienna: 0xea7e5dff,
      cadetblue: 0x5f9ea0ff,
      chartreuse: 0x7fff00ff,
      chocolate: 0xd2691eff,
      coral: 0xff7f50ff,
      cornflowerblue: 0x6495edff,
      cornsilk: 0xfff8dcff,
      crimson: 0xdc143cff,
      cyan: 0xffffff,
      darkblue: 35839,
      darkcyan: 9145343,
      darkgoldenrod: 0xb8860bff,
      darkgray: 0xa9a9a9ff,
      darkgreen: 6553855,
      darkgrey: 0xa9a9a9ff,
      darkkhaki: 0xbdb76bff,
      darkmagenta: 0x8b008bff,
      darkolivegreen: 0x556b2fff,
      darkorange: 0xff8c00ff,
      darkorchid: 0x9932ccff,
      darkred: 0x8b0000ff,
      darksalmon: 0xe9967aff,
      darkseagreen: 0x8fbc8fff,
      darkslateblue: 0x483d8bff,
      darkslategray: 0x2f4f4fff,
      darkslategrey: 0x2f4f4fff,
      darkturquoise: 0xced1ff,
      darkviolet: 0x9400d3ff,
      deeppink: 0xff1493ff,
      deepskyblue: 0xbfffff,
      dimgray: 0x696969ff,
      dimgrey: 0x696969ff,
      dodgerblue: 0x1e90ffff,
      firebrick: 0xb22222ff,
      floralwhite: 0xfffaf0ff,
      forestgreen: 0x228b22ff,
      fuchsia: 0xff00ffff,
      gainsboro: 0xdcdcdcff,
      ghostwhite: 0xf8f8ffff,
      gold: 0xffd700ff,
      goldenrod: 0xdaa520ff,
      gray: 0x808080ff,
      green: 8388863,
      greenyellow: 0xadff2fff,
      grey: 0x808080ff,
      honeydew: 0xf0fff0ff,
      hotpink: 0xff69b4ff,
      indianred: 0xcd5c5cff,
      indigo: 0x4b0082ff,
      ivory: 0xfffff0ff,
      khaki: 0xf0e68cff,
      lavender: 0xe6e6faff,
      lavenderblush: 0xfff0f5ff,
      lawngreen: 0x7cfc00ff,
      lemonchiffon: 0xfffacdff,
      lightblue: 0xadd8e6ff,
      lightcoral: 0xf08080ff,
      lightcyan: 0xe0ffffff,
      lightgoldenrodyellow: 0xfafad2ff,
      lightgray: 0xd3d3d3ff,
      lightgreen: 0x90ee90ff,
      lightgrey: 0xd3d3d3ff,
      lightpink: 0xffb6c1ff,
      lightsalmon: 0xffa07aff,
      lightseagreen: 0x20b2aaff,
      lightskyblue: 0x87cefaff,
      lightslategray: 0x778899ff,
      lightslategrey: 0x778899ff,
      lightsteelblue: 0xb0c4deff,
      lightyellow: 0xffffe0ff,
      lime: 0xff00ff,
      limegreen: 0x32cd32ff,
      linen: 0xfaf0e6ff,
      magenta: 0xff00ffff,
      maroon: 0x800000ff,
      mediumaquamarine: 0x66cdaaff,
      mediumblue: 52735,
      mediumorchid: 0xba55d3ff,
      mediumpurple: 0x9370dbff,
      mediumseagreen: 0x3cb371ff,
      mediumslateblue: 0x7b68eeff,
      mediumspringgreen: 0xfa9aff,
      mediumturquoise: 0x48d1ccff,
      mediumvioletred: 0xc71585ff,
      midnightblue: 0x191970ff,
      mintcream: 0xf5fffaff,
      mistyrose: 0xffe4e1ff,
      moccasin: 0xffe4b5ff,
      navajowhite: 0xffdeadff,
      navy: 33023,
      oldlace: 0xfdf5e6ff,
      olive: 0x808000ff,
      olivedrab: 0x6b8e23ff,
      orange: 0xffa500ff,
      orangered: 0xff4500ff,
      orchid: 0xda70d6ff,
      palegoldenrod: 0xeee8aaff,
      palegreen: 0x98fb98ff,
      paleturquoise: 0xafeeeeff,
      palevioletred: 0xdb7093ff,
      papayawhip: 0xffefd5ff,
      peachpuff: 0xffdab9ff,
      peru: 0xcd853fff,
      pink: 0xffc0cbff,
      plum: 0xdda0ddff,
      powderblue: 0xb0e0e6ff,
      purple: 0x800080ff,
      rebeccapurple: 0x663399ff,
      red: 0xff0000ff,
      rosybrown: 0xbc8f8fff,
      royalblue: 0x4169e1ff,
      saddlebrown: 0x8b4513ff,
      salmon: 0xfa8072ff,
      sandybrown: 0xf4a460ff,
      seagreen: 0x2e8b57ff,
      seashell: 0xfff5eeff,
      sienna: 0xa0522dff,
      silver: 0xc0c0c0ff,
      skyblue: 0x87ceebff,
      slateblue: 0x6a5acdff,
      slategray: 0x708090ff,
      slategrey: 0x708090ff,
      snow: 0xfffafaff,
      springgreen: 0xff7fff,
      steelblue: 0x4682b4ff,
      tan: 0xd2b48cff,
      teal: 8421631,
      thistle: 0xd8bfd8ff,
      tomato: 0xff6347ff,
      turquoise: 0x40e0d0ff,
      violet: 0xee82eeff,
      wheat: 0xf5deb3ff,
      white: 0xffffffff,
      whitesmoke: 0xf5f5f5ff,
      yellow: 0xffff00ff,
      yellowgreen: 0x9acd32ff
    },
    Y = "[-+]?\\d*\\.?\\d+",
    ee = Y + "%";

  function et(...e) {
    return "\\(\\s*(" + e.join(")\\s*,\\s*(") + ")\\s*\\)"
  }
  var en = RegExp("rgb" + et(Y, Y, Y)),
    er = RegExp("rgba" + et(Y, Y, Y, Y)),
    ei = RegExp("hsl" + et(Y, ee, ee)),
    es = RegExp("hsla" + et(Y, ee, ee, Y)),
    ea = /^#([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
    eo = /^#([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
    el = /^#([0-9a-fA-F]{6})$/,
    eu = /^#([0-9a-fA-F]{8})$/;

  function ef(e, t, n) {
    return (n < 0 && (n += 1), n > 1 && (n -= 1), n < 1 / 6) ? e + (t - e) * 6 * n : n < .5 ? t : n < 2 / 3 ? e + (t - e) * (2 / 3 - n) * 6 : e
  }

  function ed(e, t, n) {
    let r = n < .5 ? n * (1 + t) : n + t - n * t,
      i = 2 * n - r;
    return Math.round(255 * ef(i, r, e + 1 / 3)) << 24 | Math.round(255 * ef(i, r, e)) << 16 | Math.round(255 * ef(i, r, e - 1 / 3)) << 8
  }

  function ec(e) {
    let t = parseInt(e, 10);
    return t < 0 ? 0 : t > 255 ? 255 : t
  }

  function eh(e) {
    return (parseFloat(e) % 360 + 360) % 360 / 360
  }

  function ep(e) {
    let t = parseFloat(e);
    return t < 0 ? 0 : t > 1 ? 255 : Math.round(255 * t)
  }

  function em(e) {
    let t = parseFloat(e);
    return t < 0 ? 0 : t > 100 ? 1 : t / 100
  }

  function eg(e) {
    let t, n = "number" == typeof e ? e >>> 0 === e && e >= 0 && e <= 0xffffffff ? e : null : (t = el.exec(e)) ? parseInt(t[1] + "ff", 16) >>> 0 : T && void 0 !== T[e] ? T[e] : (t = en.exec(e)) ? (ec(t[1]) << 24 | ec(t[2]) << 16 | ec(t[3]) << 8 | 255) >>> 0 : (t = er.exec(e)) ? (ec(t[1]) << 24 | ec(t[2]) << 16 | ec(t[3]) << 8 | ep(t[4])) >>> 0 : (t = ea.exec(e)) ? parseInt(t[1] + t[1] + t[2] + t[2] + t[3] + t[3] + "ff", 16) >>> 0 : (t = eu.exec(e)) ? parseInt(t[1], 16) >>> 0 : (t = eo.exec(e)) ? parseInt(t[1] + t[1] + t[2] + t[2] + t[3] + t[3] + t[4] + t[4], 16) >>> 0 : (t = ei.exec(e)) ? (255 | ed(eh(t[1]), em(t[2]), em(t[3]))) >>> 0 : (t = es.exec(e)) ? (ed(eh(t[1]), em(t[2]), em(t[3])) | ep(t[4])) >>> 0 : null;
    if (null === n) return e;
    let r = (0xff000000 & (n = n || 0)) >>> 24,
      i = (0xff0000 & n) >>> 16,
      s = (65280 & n) >>> 8,
      a = (255 & n) / 255;
    return `rgba(${r}, ${i}, ${s}, ${a})`
  }
  var ey = (e, n, r) => {
      if (C.fun(e)) return e;
      if (C.arr(e)) return ey({
        range: e,
        output: n,
        extrapolate: r
      });
      if (C.str(e.output[0])) return t(e);
      let i = e.output,
        s = e.range || [0, 1],
        a = e.extrapolateLeft || e.extrapolate || "extend",
        o = e.extrapolateRight || e.extrapolate || "extend",
        l = e.easing || (e => e);
      return t => {
        let n = function(e, t) {
          for (var n = 1; n < t.length - 1 && !(t[n] >= e); ++n);
          return n - 1
        }(t, s);
        return function(e, t, n, r, i, s, a, o, l) {
          let u = l ? l(e) : e;
          if (u < t)
            if ("identity" === a) return u;
            else "clamp" === a && (u = t);
          if (u > n)
            if ("identity" === o) return u;
            else "clamp" === o && (u = n);
          return r === i ? r : t === n ? e <= t ? r : i : (t === -1 / 0 ? u = -u : n === 1 / 0 ? u -= t : u = (u - t) / (n - t), u = s(u), r === -1 / 0 ? u = -u : i === 1 / 0 ? u += r : u = u * (i - r) + r, u)
        }(t, s[n], s[n + 1], i[n], i[n + 1], l, a, o, e.map)
      }
    },
    ev = 2 * Math.PI / 3,
    ex = 2 * Math.PI / 4.5,
    eb = e => e < .36363636363636365 ? 7.5625 * e * e : e < .7272727272727273 ? 7.5625 * (e -= .5454545454545454) * e + .75 : e < .9090909090909091 ? 7.5625 * (e -= .8181818181818182) * e + .9375 : 7.5625 * (e -= .9545454545454546) * e + .984375,
    ew = {
      linear: e => e,
      easeInQuad: e => e * e,
      easeOutQuad: e => 1 - (1 - e) * (1 - e),
      easeInOutQuad: e => e < .5 ? 2 * e * e : 1 - Math.pow(-2 * e + 2, 2) / 2,
      easeInCubic: e => e * e * e,
      easeOutCubic: e => 1 - Math.pow(1 - e, 3),
      easeInOutCubic: e => e < .5 ? 4 * e * e * e : 1 - Math.pow(-2 * e + 2, 3) / 2,
      easeInQuart: e => e * e * e * e,
      easeOutQuart: e => 1 - Math.pow(1 - e, 4),
      easeInOutQuart: e => e < .5 ? 8 * e * e * e * e : 1 - Math.pow(-2 * e + 2, 4) / 2,
      easeInQuint: e => e * e * e * e * e,
      easeOutQuint: e => 1 - Math.pow(1 - e, 5),
      easeInOutQuint: e => e < .5 ? 16 * e * e * e * e * e : 1 - Math.pow(-2 * e + 2, 5) / 2,
      easeInSine: e => 1 - Math.cos(e * Math.PI / 2),
      easeOutSine: e => Math.sin(e * Math.PI / 2),
      easeInOutSine: e => -(Math.cos(Math.PI * e) - 1) / 2,
      easeInExpo: e => 0 === e ? 0 : Math.pow(2, 10 * e - 10),
      easeOutExpo: e => 1 === e ? 1 : 1 - Math.pow(2, -10 * e),
      easeInOutExpo: e => 0 === e ? 0 : 1 === e ? 1 : e < .5 ? Math.pow(2, 20 * e - 10) / 2 : (2 - Math.pow(2, -20 * e + 10)) / 2,
      easeInCirc: e => 1 - Math.sqrt(1 - Math.pow(e, 2)),
      easeOutCirc: e => Math.sqrt(1 - Math.pow(e - 1, 2)),
      easeInOutCirc: e => e < .5 ? (1 - Math.sqrt(1 - Math.pow(2 * e, 2))) / 2 : (Math.sqrt(1 - Math.pow(-2 * e + 2, 2)) + 1) / 2,
      easeInBack: e => 2.70158 * e * e * e - 1.70158 * e * e,
      easeOutBack: e => 1 + 2.70158 * Math.pow(e - 1, 3) + 1.70158 * Math.pow(e - 1, 2),
      easeInOutBack: e => e < .5 ? Math.pow(2 * e, 2) * (7.189819 * e - 2.5949095) / 2 : (Math.pow(2 * e - 2, 2) * (3.5949095 * (2 * e - 2) + 2.5949095) + 2) / 2,
      easeInElastic: e => 0 === e ? 0 : 1 === e ? 1 : -Math.pow(2, 10 * e - 10) * Math.sin((10 * e - 10.75) * ev),
      easeOutElastic: e => 0 === e ? 0 : 1 === e ? 1 : Math.pow(2, -10 * e) * Math.sin((10 * e - .75) * ev) + 1,
      easeInOutElastic: e => 0 === e ? 0 : 1 === e ? 1 : e < .5 ? -(Math.pow(2, 20 * e - 10) * Math.sin((20 * e - 11.125) * ex)) / 2 : Math.pow(2, -20 * e + 10) * Math.sin((20 * e - 11.125) * ex) / 2 + 1,
      easeInBounce: e => 1 - eb(1 - e),
      easeOutBounce: eb,
      easeInOutBounce: e => e < .5 ? (1 - eb(1 - 2 * e)) / 2 : (1 + eb(2 * e - 1)) / 2,
      steps: (e, t = "end") => n => {
        let r = (n = "end" === t ? Math.min(n, .999) : Math.max(n, .001)) * e;
        return Math.min(Math.max(("end" === t ? Math.floor(r) : Math.ceil(r)) / e, 0), 1)
      }
    },
    e_ = Symbol.for("FluidValue.get"),
    ek = Symbol.for("FluidValue.observers"),
    eM = e => !!(e && e[e_]),
    eI = e => e && e[e_] ? e[e_]() : e,
    eP = e => e[ek] || null;

  function eS(e, t) {
    let n = e[ek];
    n && n.forEach(e => {
      e.eventObserved ? e.eventObserved(t) : e(t)
    })
  }
  var eO = class {
      constructor(e) {
        if (!e && !(e = this.get)) throw Error("Unknown getter");
        eA(this, e)
      }
    },
    eA = (e, t) => eR(e, e_, t);

  function eE(e, t) {
    if (e[e_]) {
      let n = e[ek];
      n || eR(e, ek, n = new Set), !n.has(t) && (n.add(t), e.observerAdded && e.observerAdded(n.size, t))
    }
    return t
  }

  function eC(e, t) {
    let n = e[ek];
    if (n && n.has(t)) {
      let r = n.size - 1;
      r ? n.delete(t) : e[ek] = null, e.observerRemoved && e.observerRemoved(r, t)
    }
  }
  var eR = (e, t, n) => Object.defineProperty(e, t, {
      value: n,
      writable: !0,
      configurable: !0
    }),
    eV = /[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
    ez = /(#(?:[0-9a-f]{2}){2,4}|(#[0-9a-f]{3})|(rgb|hsl)a?\((-?\d+%?[,\s]+){2,3}\s*[\d\.]+%?\))/gi,
    ej = RegExp(`(${eV.source})(%|[a-z]+)`, "i"),
    eF = /rgba\(([0-9\.-]+), ([0-9\.-]+), ([0-9\.-]+), ([0-9\.-]+)\)/gi,
    eq = /var\((--[a-zA-Z0-9-_]+),? ?([a-zA-Z0-9 ()%#.,-]+)?\)/,
    e$ = e => {
      let [t, n] = eT(e);
      if (!t || $()) return e;
      let r = window.getComputedStyle(document.documentElement).getPropertyValue(t);
      if (r) return r.trim();
      if (n && n.startsWith("--")) {
        let e = window.getComputedStyle(document.documentElement).getPropertyValue(n);
        if (e) return e
      } else if (n && eq.test(n)) return e$(n);
      else if (n) return n;
      return e
    },
    eT = e => {
      let t = eq.exec(e);
      if (!t) return [, ];
      let [, n, r] = t;
      return [n, r]
    },
    eL = (e, t, n, r, i) => `rgba(${Math.round(t)}, ${Math.round(n)}, ${Math.round(r)}, ${i})`,
    eQ = e => {
      r || (r = T ? RegExp(`(${Object.keys(T).join("|")})(?!\\w)`, "g") : /^\b$/);
      let t = e.output.map(e => eI(e).replace(eq, e$).replace(ez, eg).replace(r, eg)),
        n = t.map(e => e.match(eV).map(Number)),
        i = n[0].map((e, t) => n.map(e => {
          if (!(t in e)) throw Error('The arity of each "output" value must be equal');
          return e[t]
        })).map(t => ey({
          ...e,
          output: t
        }));
      return e => {
        let n = !ej.test(t[0]) && t.find(e => ej.test(e))?.replace(eV, ""),
          r = 0;
        return t[0].replace(eV, () => `${i[r++](e)}${n||""}`).replace(eF, eL)
      }
    },
    eU = "react-spring: ",
    eN = e => {
      let t = !1;
      if ("function" != typeof e) throw TypeError(`${eU}once requires a function parameter`);
      return (...n) => {
        t || (e(...n), t = !0)
      }
    },
    eD = eN(console.warn);

  function eW() {
    eD(`${eU}The "interpolate" function is deprecated in v9 (use "to" instead)`)
  }
  var eB = eN(console.warn);

  function eG() {
    eB(`${eU}Directly calling start instead of using the api object is deprecated in v9 (use ".start" instead), this will be removed in later 0.X.0 versions`)
  }

  function eH(e) {
    return C.str(e) && ("#" == e[0] || /\d/.test(e) || !$() && eq.test(e) || e in (T || {}))
  }
  var eZ = new WeakMap,
    eK = e => e.forEach(({
      target: e,
      contentRect: t
    }) => eZ.get(e)?.forEach(e => e(t))),
    eJ = new Set,
    eX = (e, {
      container: t = document.documentElement
    } = {}) => {
      let n;
      if (t === document.documentElement) {
        let t;
        return eJ.add(e), s || (t = () => {
          eJ.forEach(e => e({
            width: window.innerWidth,
            height: window.innerHeight
          }))
        }, window.addEventListener("resize", t), s = () => {
          window.removeEventListener("resize", t)
        }), () => {
          eJ.delete(e), !eJ.size && s && (s(), s = void 0)
        }
      }
      return !i && "u" > typeof ResizeObserver && (i = new ResizeObserver(eK)), (n = eZ.get(t)) || (n = new Set, eZ.set(t, n)), n.add(e), i && i.observe(t), () => {
        let n = eZ.get(t);
        n && (n.delete(e), !n.size && i && i.unobserve(t))
      }
    },
    eY = {
      x: {
        length: "Width",
        position: "Left"
      },
      y: {
        length: "Height",
        position: "Top"
      }
    },
    e0 = class {
      constructor(e, t) {
        this.createAxis = () => ({
          current: 0,
          progress: 0,
          scrollLength: 0
        }), this.updateAxis = e => {
          let t, n, r = this.info[e],
            {
              length: i,
              position: s
            } = eY[e];
          r.current = this.container[`scroll${s}`], r.scrollLength = this.container[`scroll${i}`] - this.container[`client${i}`], t = r.scrollLength, n = r.current, r.progress = t - 0 == 0 ? 1 : (n - 0) / (t - 0)
        }, this.update = () => {
          this.updateAxis("x"), this.updateAxis("y")
        }, this.sendEvent = () => {
          this.callback(this.info)
        }, this.advance = () => {
          this.update(), this.sendEvent()
        }, this.callback = e, this.container = t, this.info = {
          time: 0,
          x: this.createAxis(),
          y: this.createAxis()
        }
      }
    },
    e1 = new WeakMap,
    e2 = new WeakMap,
    e5 = new WeakMap,
    e8 = e => e === document.documentElement ? window : e,
    e9 = $() ? M.useEffect : M.useLayoutEffect;

  function e3() {
    let e, t = (0, M.useState)()[1],
      n = (e = (0, M.useRef)(!1), e9(() => (e.current = !0, () => {
        e.current = !1
      }), []), e);
    return () => {
      n.current && t(Math.random())
    }
  }
  var e6 = e => (0, M.useEffect)(e, e4),
    e4 = [];

  function e7(e) {
    let t = (0, M.useRef)(void 0);
    return (0, M.useEffect)(() => {
      t.current = e
    }), t.current
  }
  e.s(["FluidValue", 0, eO, "Globals", 0, P, "addFluidObserver", 0, eE, "callFluidObservers", 0, eS, "colors", 0, X, "createInterpolator", 0, ey, "createStringInterpolator", 0, eQ, "defineHidden", 0, E, "deprecateDirectCall", 0, eG, "deprecateInterpolate", 0, eW, "each", 0, V, "eachProp", 0, z, "easings", 0, ew, "flush", 0, F, "flushCalls", 0, q, "frameLoop", 0, G, "getFluidObservers", 0, eP, "getFluidValue", 0, eI, "hasFluidValue", 0, eM, "is", 0, C, "isAnimatedString", 0, eH, "isEqual", 0, R, "noop", 0, A, "onResize", 0, eX, "onScroll", 0, (e, {
    container: t = document.documentElement
  } = {}) => {
    let n = e5.get(t);
    n || (n = new Set, e5.set(t, n));
    let r = new e0(e, t);
    if (n.add(r), !e1.has(t)) {
      let e = () => (n?.forEach(e => e.advance()), !0);
      e1.set(t, e);
      let r = e8(t);
      window.addEventListener("resize", e, {
        passive: !0
      }), t !== document.documentElement && e2.set(t, eX(e, {
        container: t
      })), r.addEventListener("scroll", e, {
        passive: !0
      })
    }
    let i = e1.get(t);
    return o(i), () => {
      o.cancel(i);
      let e = e5.get(t);
      if (!e || (e.delete(r), e.size)) return;
      let n = e1.get(t);
      e1.delete(t), n && (e8(t).removeEventListener("scroll", n), window.removeEventListener("resize", n), e2.get(t)?.())
    }
  }, "removeFluidObserver", 0, eC, "toArray", 0, j, "useConstant", 0, function(e) {
    let t = (0, M.useRef)(null);
    return null === t.current && (t.current = e()), t.current
  }, "useForceUpdate", 0, e3, "useIsomorphicLayoutEffect", 0, e9, "useOnce", 0, e6, "usePrev", 0, e7, "useReducedMotion", 0, () => {
    let [e, t] = (0, M.useState)(null);
    return e9(() => {
      let e = window.matchMedia("(prefers-reduced-motion)"),
        n = e => {
          t(e.matches), U({
            skipAnimation: e.matches
          })
        };
      return n(e), e.addEventListener ? e.addEventListener("change", n) : e.addListener(n), () => {
        e.removeEventListener ? e.removeEventListener("change", n) : e.removeListener(n)
      }
    }, []), e
  }], 7027);
  var te = Symbol.for("Animated:node"),
    tt = e => e && e[te],
    tn = e => e && e[te] && e[te].getPayload(),
    tr = class {
      constructor() {
        ((e, t) => E(e, te, t))(this, this)
      }
      getPayload() {
        return this.payload || []
      }
    },
    ti = class e extends tr {
      constructor(e) {
        super(), this._value = e, this.done = !0, this.durationProgress = 0, C.num(this._value) && (this.lastPosition = this._value)
      }
      static create(t) {
        return new e(t)
      }
      getPayload() {
        return [this]
      }
      getValue() {
        return this._value
      }
      setValue(e, t) {
        return C.num(e) && (this.lastPosition = e, t && (e = Math.round(e / t) * t, this.done && (this.lastPosition = e))), this._value !== e && (this._value = e, !0)
      }
      reset() {
        let {
          done: e
        } = this;
        this.done = !1, C.num(this._value) && (this.elapsedTime = 0, this.durationProgress = 0, this.lastPosition = this._value, e && (this.lastVelocity = null), this.v0 = null)
      }
    },
    ts = class e extends ti {
      constructor(e) {
        super(0), this._string = null, this._toString = ey({
          output: [e, e]
        })
      }
      static create(t) {
        return new e(t)
      }
      getValue() {
        let e = this._string;
        return null == e ? this._string = this._toString(this._value) : e
      }
      setValue(e) {
        if (C.str(e)) {
          if (e == this._string) return !1;
          this._string = e, this._value = 1
        } else {
          if (!super.setValue(e)) return !1;
          this._string = null
        }
        return !0
      }
      reset(e) {
        e && (this._toString = ey({
          output: [this.getValue(), e]
        })), this._value = 0, super.reset()
      }
    },
    ta = {
      dependencies: null
    },
    to = class extends tr {
      constructor(e) {
        super(), this.source = e, this.setValue(e)
      }
      getValue(e) {
        let t = {};
        return z(this.source, (n, r) => {
          n && n[te] === n ? t[r] = n.getValue(e) : eM(n) ? t[r] = eI(n) : e || (t[r] = n)
        }), t
      }
      setValue(e) {
        this.source = e, this.payload = this._makePayload(e)
      }
      reset() {
        this.payload && V(this.payload, e => e.reset())
      }
      _makePayload(e) {
        if (e) {
          let t = new Set;
          return z(e, this._addToPayload, t), Array.from(t)
        }
      }
      _addToPayload(e) {
        ta.dependencies && eM(e) && ta.dependencies.add(e);
        let t = tn(e);
        t && V(t, e => this.add(e))
      }
    },
    tl = class e extends to {
      constructor(e) {
        super(e)
      }
      static create(t) {
        return new e(t)
      }
      getValue() {
        return this.source.map(e => e.getValue())
      }
      setValue(e) {
        let t = this.getPayload();
        return e.length == t.length ? t.map((t, n) => t.setValue(e[n])).some(Boolean) : (super.setValue(e.map(tu)), !0)
      }
    };

  function tu(e) {
    return (eH(e) ? ts : ti).create(e)
  }

  function tf(e) {
    let t = tt(e);
    return t ? t.constructor : C.arr(e) ? tl : eH(e) ? ts : ti
  }
  var td = (e, t) => {
      let n = !C.fun(e) || e.prototype && e.prototype.isReactComponent;
      return (0, M.forwardRef)((r, i) => {
        var s, a;
        let l, u = (0, M.useRef)(null),
          f = n && (0, M.useCallback)(e => {
            var t, n;
            t = i, n = e, t && (C.fun(t) ? t(n) : t.current = n), u.current = n
          }, [i]),
          [d, c] = (s = r, a = t, ta.dependencies = l = new Set, s.style && (s = {
            ...s,
            style: a.createAnimatedStyle(s.style)
          }), s = new to(s), ta.dependencies = null, [s, l]),
          h = e3(),
          p = () => {
            let e = u.current;
            n && !e || !1 === (!!e && t.applyAnimatedValues(e, d.getValue(!0))) && h()
          },
          m = new tc(p, c),
          g = (0, M.useRef)(void 0);
        e9(() => (g.current = m, V(c, e => eE(e, m)), () => {
          g.current && (V(g.current.deps, e => eC(e, g.current)), o.cancel(g.current.update))
        })), (0, M.useEffect)(p, []), e6(() => () => {
          let e = g.current;
          V(e.deps, t => eC(t, e))
        });
        let y = t.getComponentProps(d.getValue());
        return M.createElement(e, {
          ...y,
          ref: f
        })
      })
    },
    tc = class {
      constructor(e, t) {
        this.update = e, this.deps = t
      }
      eventObserved(e) {
        "change" == e.type && o.write(this.update)
      }
    },
    th = Symbol.for("AnimatedComponent"),
    tp = e => C.str(e) ? e : e && C.str(e.displayName) ? e.displayName : C.fun(e) && e.name || null;

  function tm(e, ...t) {
    return C.fun(e) ? e(...t) : e
  }
  var tg = (e, t) => !0 === e || !!(t && e && (C.fun(e) ? e(t) : j(e).includes(t))),
    ty = (e, t) => C.obj(e) ? t && e[t] : e,
    tv = (e, t) => !0 === e.default ? e[t] : e.default ? e.default[t] : void 0,
    tx = e => e,
    tb = (e, t = tx) => {
      let n = tw;
      e.default && !0 !== e.default && (n = Object.keys(e = e.default));
      let r = {};
      for (let i of n) {
        let n = t(e[i], i);
        C.und(n) || (r[i] = n)
      }
      return r
    },
    tw = ["config", "onProps", "onStart", "onChange", "onPause", "onResume", "onRest"],
    t_ = {
      config: 1,
      from: 1,
      to: 1,
      ref: 1,
      loop: 1,
      reset: 1,
      pause: 1,
      cancel: 1,
      reverse: 1,
      immediate: 1,
      default: 1,
      delay: 1,
      onProps: 1,
      onStart: 1,
      onChange: 1,
      onPause: 1,
      onResume: 1,
      onRest: 1,
      onResolve: 1,
      items: 1,
      trail: 1,
      sort: 1,
      expires: 1,
      initial: 1,
      enter: 1,
      update: 1,
      leave: 1,
      children: 1,
      onDestroyed: 1,
      keys: 1,
      callId: 1,
      parentId: 1
    };

  function tk(e) {
    let t = function(e) {
      let t = {},
        n = 0;
      if (z(e, (e, r) => {
          !t_[r] && (t[r] = e, n++)
        }), n) return t
    }(e);
    if (t) {
      let n = {
        to: t
      };
      return z(e, (e, r) => r in t || (n[r] = e)), n
    }
    return {
      ...e
    }
  }

  function tM(e) {
    return e = eI(e), C.arr(e) ? e.map(tM) : eH(e) ? P.createStringInterpolator({
      range: [0, 1],
      output: [e, e]
    })(1) : e
  }

  function tI(e) {
    for (let t in e) return !0;
    return !1
  }

  function tP(e) {
    return C.fun(e) || C.arr(e) && C.obj(e[0])
  }

  function tS(e, t) {
    e.ref?.delete(e), t?.delete(e)
  }

  function tO(e, t) {
    t && e.ref !== t && (e.ref?.delete(e), t.add(e), e.ref = t)
  }
  var tA = {
      default: {
        tension: 170,
        friction: 26
      },
      gentle: {
        tension: 120,
        friction: 14
      },
      wobbly: {
        tension: 180,
        friction: 12
      },
      stiff: {
        tension: 210,
        friction: 20
      },
      slow: {
        tension: 280,
        friction: 60
      },
      molasses: {
        tension: 280,
        friction: 120
      }
    },
    tE = {
      ...tA.default,
      mass: 1,
      damping: 1,
      easing: ew.linear,
      clamp: !1
    },
    tC = class {
      constructor() {
        this.velocity = 0, Object.assign(this, tE)
      }
    };

  function tR(e, t) {
    if (C.und(t.decay)) {
      let n = !C.und(t.tension) || !C.und(t.friction);
      !n && C.und(t.frequency) && C.und(t.damping) && C.und(t.mass) || (e.duration = void 0, e.decay = void 0), n && (e.frequency = void 0)
    } else e.duration = void 0
  }
  var tV = [],
    tz = class {
      constructor() {
        this.changed = !1, this.values = tV, this.toValues = null, this.fromValues = tV, this.config = new tC, this.immediate = !1
      }
    };

  function tj(e, {
    key: t,
    props: n,
    defaultProps: r,
    state: i,
    actions: s
  }) {
    return new Promise((a, l) => {
      let u, f, d = tg(n.cancel ?? r?.cancel, t);
      if (d) p();
      else {
        C.und(n.pause) || (i.paused = tg(n.pause, t));
        let e = r?.pause;
        !0 !== e && (e = i.paused || tg(e, t)), u = tm(n.delay || 0, t), e ? (i.resumeQueue.add(h), s.pause()) : (s.resume(), h())
      }

      function c() {
        i.resumeQueue.add(h), i.timeouts.delete(f), f.cancel(), u = f.time - o.now()
      }

      function h() {
        u > 0 && !P.skipAnimation ? (i.delayed = !0, f = o.setTimeout(p, u), i.pauseQueue.add(c), i.timeouts.add(f)) : p()
      }

      function p() {
        i.delayed && (i.delayed = !1), i.pauseQueue.delete(c), i.timeouts.delete(f), e <= (i.cancelId || 0) && (d = !0);
        try {
          s.start({
            ...n,
            callId: e,
            cancel: d
          }, a)
        } catch (e) {
          l(e)
        }
      }
    })
  }
  var tF = (e, t) => 1 == t.length ? t[0] : t.some(e => e.cancelled) ? tT(e.get()) : t.every(e => e.noop) ? tq(e.get()) : t$(e.get(), t.every(e => e.finished)),
    tq = e => ({
      value: e,
      noop: !0,
      finished: !0,
      cancelled: !1
    }),
    t$ = (e, t, n = !1) => ({
      value: e,
      finished: t,
      cancelled: n
    }),
    tT = e => ({
      value: e,
      cancelled: !0,
      finished: !1
    });

  function tL(e, t, n, r) {
    let {
      callId: i,
      parentId: s,
      onRest: a
    } = t, {
      asyncTo: l,
      promise: u
    } = n;
    return s || e !== l || t.reset ? n.promise = (async () => {
      let f, d, c;
      n.asyncId = i, n.asyncTo = e;
      let h = tb(t, (e, t) => "onRest" === t ? void 0 : e),
        p = new Promise((e, t) => (f = e, d = t)),
        m = e => {
          let t = i <= (n.cancelId || 0) && tT(r) || i !== n.asyncId && t$(r, !1);
          if (t) throw e.result = t, d(e), e
        },
        g = (e, t) => {
          let s = new tU,
            a = new tN;
          return (async () => {
            if (P.skipAnimation) throw tQ(n), a.result = t$(r, !1), d(a), a;
            m(s);
            let o = C.obj(e) ? {
              ...e
            } : {
              ...t,
              to: e
            };
            o.parentId = i, z(h, (e, t) => {
              C.und(o[t]) && (o[t] = e)
            });
            let l = await r.start(o);
            return m(s), n.paused && await new Promise(e => {
              n.resumeQueue.add(e)
            }), l
          })()
        };
      if (P.skipAnimation) return tQ(n), t$(r, !1);
      try {
        let t;
        t = C.arr(e) ? (async e => {
          for (let t of e) await g(t)
        })(e) : Promise.resolve(e(g, r.stop.bind(r))), await Promise.all([t.then(f), p]), c = t$(r.get(), !0, !1)
      } catch (e) {
        if (e instanceof tU) c = e.result;
        else if (e instanceof tN) c = e.result;
        else throw e
      } finally {
        i == n.asyncId && (n.asyncId = s, n.asyncTo = s ? l : void 0, n.promise = s ? u : void 0)
      }
      return C.fun(a) && o.batchedUpdates(() => {
        a(c, r, r.item)
      }), c
    })() : u
  }

  function tQ(e, t) {
    F(e.timeouts, e => e.cancel()), e.pauseQueue.clear(), e.resumeQueue.clear(), e.asyncId = e.asyncTo = e.promise = void 0, t && (e.cancelId = t)
  }
  var tU = class extends Error {
      constructor() {
        super("An async animation has been interrupted. You see this error because you forgot to use `await` or `.catch(...)` on its returned promise.")
      }
    },
    tN = class extends Error {
      constructor() {
        super("SkipAnimationSignal")
      }
    },
    tD = 1,
    tW = class extends eO {
      constructor() {
        super(...arguments), this.id = tD++, this._priority = 0
      }
      get priority() {
        return this._priority
      }
      set priority(e) {
        this._priority != e && (this._priority = e, this._onPriorityChange(e))
      }
      get() {
        let e = tt(this);
        return e && e.getValue()
      }
      to(...e) {
        return P.to(this, e)
      }
      interpolate(...e) {
        return eW(), P.to(this, e)
      }
      toJSON() {
        return this.get()
      }
      observerAdded(e) {
        1 == e && this._attach()
      }
      observerRemoved(e) {
        0 == e && this._detach()
      }
      _attach() {}
      _detach() {}
      _onChange(e, t = !1) {
        eS(this, {
          type: "change",
          parent: this,
          value: e,
          idle: t
        })
      }
      _onPriorityChange(e) {
        this.idle || G.sort(this), eS(this, {
          type: "priority",
          parent: this,
          priority: e
        })
      }
    },
    tB = Symbol.for("SpringPhase"),
    tG = e => (1 & e[tB]) > 0,
    tH = e => (2 & e[tB]) > 0,
    tZ = e => (4 & e[tB]) > 0,
    tK = (e, t) => t ? e[tB] |= 3 : e[tB] &= -3,
    tJ = (e, t) => t ? e[tB] |= 4 : e[tB] &= -5,
    tX = class extends tW {
      constructor(e, t) {
        if (super(), this.animation = new tz, this.defaultProps = {}, this._state = {
            paused: !1,
            delayed: !1,
            pauseQueue: new Set,
            resumeQueue: new Set,
            timeouts: new Set
          }, this._pendingCalls = new Set, this._lastCallId = 0, this._lastToId = 0, this._memoizedDuration = 0, !C.und(e) || !C.und(t)) {
          const n = C.obj(e) ? {
            ...e
          } : {
            ...t,
            from: e
          };
          C.und(n.default) && (n.default = !0), this.start(n)
        }
      }
      get idle() {
        return !(tH(this) || this._state.asyncTo) || tZ(this)
      }
      get goal() {
        return eI(this.animation.to)
      }
      get velocity() {
        let e = tt(this);
        return e instanceof ti ? e.lastVelocity || 0 : e.getPayload().map(e => e.lastVelocity || 0)
      }
      get hasAnimated() {
        return tG(this)
      }
      get isAnimating() {
        return tH(this)
      }
      get isPaused() {
        return tZ(this)
      }
      get isDelayed() {
        return this._state.delayed
      }
      advance(e) {
        let t = !0,
          n = !1,
          r = this.animation,
          {
            toValues: i
          } = r,
          {
            config: s
          } = r,
          a = tn(r.to);
        !a && eM(r.to) && (i = j(eI(r.to))), r.values.forEach((o, l) => {
          if (o.done) return;
          let u = o.constructor == ts ? 1 : a ? a[l].lastPosition : i[l],
            f = r.immediate,
            d = u;
          if (!f) {
            let t;
            if (d = o.lastPosition, s.tension <= 0) {
              o.done = !0;
              return
            }
            let n = o.elapsedTime += e,
              i = r.fromValues[l],
              a = null != o.v0 ? o.v0 : o.v0 = C.arr(s.velocity) ? s.velocity[l] : s.velocity,
              c = s.precision || (i == u ? .005 : Math.min(1, .001 * Math.abs(u - i)));
            if (C.und(s.duration))
              if (s.decay) {
                let e = !0 === s.decay ? .998 : s.decay,
                  r = Math.exp(-(1 - e) * n);
                d = i + a / (1 - e) * (1 - r), f = Math.abs(o.lastPosition - d) <= c, t = a * r
              } else {
                t = null == o.lastVelocity ? a : o.lastVelocity;
                let n = s.restVelocity || c / 10,
                  r = s.clamp ? 0 : s.bounce,
                  l = !C.und(r),
                  h = i == u ? o.v0 > 0 : i < u,
                  p = Math.ceil(e / 1);
                for (let e = 0; e < p && !(!(Math.abs(t) > n) && (f = Math.abs(u - d) <= c)); ++e) {
                  l && (d == u || d > u == h) && (t = -t * r, d = u);
                  let e = (-(1e-6 * s.tension) * (d - u) + -(.001 * s.friction) * t) / s.mass;
                  t += +e, d += +t
                }
              }
            else {
              let r = 1;
              s.duration > 0 && (this._memoizedDuration !== s.duration && (this._memoizedDuration = s.duration, o.durationProgress > 0 && (o.elapsedTime = s.duration * o.durationProgress, n = o.elapsedTime += e)), o.durationProgress = r = (r = (s.progress || 0) + n / this._memoizedDuration) > 1 ? 1 : r < 0 ? 0 : r), t = ((d = i + s.easing(r) * (u - i)) - o.lastPosition) / e, f = 1 == r
            }
            o.lastVelocity = t, Number.isNaN(d) && (console.warn("Got NaN while animating:", this), f = !0)
          }
          a && !a[l].done && (f = !1), f ? o.done = !0 : t = !1, o.setValue(d, s.round) && (n = !0)
        });
        let o = tt(this),
          l = o.getValue();
        if (t) {
          let e = eI(r.to);
          (l !== e || n) && !s.decay ? (o.setValue(e), this._onChange(e)) : n && s.decay && this._onChange(l), this._stop()
        } else n && this._onChange(l)
      }
      set(e) {
        return o.batchedUpdates(() => {
          this._stop(), this._focus(e), this._set(e)
        }), this
      }
      pause() {
        this._update({
          pause: !0
        })
      }
      resume() {
        this._update({
          pause: !1
        })
      }
      finish() {
        if (tH(this)) {
          let {
            to: e,
            config: t
          } = this.animation;
          o.batchedUpdates(() => {
            this._onStart(), t.decay || this._set(e, !1), this._stop()
          })
        }
        return this
      }
      update(e) {
        return (this.queue || (this.queue = [])).push(e), this
      }
      start(e, t) {
        let n;
        return C.und(e) ? (n = this.queue || [], this.queue = []) : n = [C.obj(e) ? e : {
          ...t,
          to: e
        }], Promise.all(n.map(e => this._update(e))).then(e => tF(this, e))
      }
      stop(e) {
        let {
          to: t
        } = this.animation;
        return this._focus(this.get()), tQ(this._state, e && this._lastCallId), o.batchedUpdates(() => this._stop(t, e)), this
      }
      reset() {
        this._update({
          reset: !0
        })
      }
      eventObserved(e) {
        "change" == e.type ? this._start() : "priority" == e.type && (this.priority = e.priority + 1)
      }
      _prepareNode(e) {
        let t = this.key || "",
          {
            to: n,
            from: r
          } = e;
        (null == (n = C.obj(n) ? n[t] : n) || tP(n)) && (n = void 0), null == (r = C.obj(r) ? r[t] : r) && (r = void 0);
        let i = {
          to: n,
          from: r
        };
        return !tG(this) && (e.reverse && ([n, r] = [r, n]), r = eI(r), C.und(r) ? tt(this) || this._set(n) : this._set(r)), i
      }
      _update({
        ...e
      }, t) {
        let {
          key: n,
          defaultProps: r
        } = this;
        e.default && Object.assign(r, tb(e, (e, t) => /^on/.test(t) ? ty(e, n) : e)), t8(this, e, "onProps"), t9(this, "onProps", e, this);
        let i = this._prepareNode(e);
        if (Object.isFrozen(this)) throw Error("Cannot animate a `SpringValue` object that is frozen. Did you forget to pass your component to `animated(...)` before animating its props?");
        let s = this._state;
        return tj(++this._lastCallId, {
          key: n,
          props: e,
          defaultProps: r,
          state: s,
          actions: {
            pause: () => {
              tZ(this) || (tJ(this, !0), q(s.pauseQueue), t9(this, "onPause", t$(this, tY(this, this.animation.to)), this))
            },
            resume: () => {
              tZ(this) && (tJ(this, !1), tH(this) && this._resume(), q(s.resumeQueue), t9(this, "onResume", t$(this, tY(this, this.animation.to)), this))
            },
            start: this._merge.bind(this, i)
          }
        }).then(n => {
          if (e.loop && n.finished && !(t && n.noop)) {
            let t = t0(e);
            if (t) return this._update(t, !0)
          }
          return n
        })
      }
      _merge(e, t, n) {
        if (t.cancel) return this.stop(!0), n(tT(this));
        let r = !C.und(e.to),
          i = !C.und(e.from);
        if (r || i)
          if (!(t.callId > this._lastToId)) return n(tT(this));
          else this._lastToId = t.callId;
        let {
          key: s,
          defaultProps: a,
          animation: l
        } = this, {
          to: u,
          from: f
        } = l, {
          to: d = u,
          from: c = f
        } = e;
        i && !r && (!t.default || C.und(d)) && (d = c), t.reverse && ([d, c] = [c, d]);
        let h = !R(c, f);
        h && (l.from = c), c = eI(c);
        let p = !R(d, u);
        p && this._focus(d);
        let m = tP(t.to),
          {
            config: g
          } = l,
          {
            decay: y,
            velocity: v
          } = g;
        (r || i) && (g.velocity = 0), t.config && !m && function(e, t, n) {
          for (let r in n && (tR(n = {
              ...n
            }, t), t = {
              ...n,
              ...t
            }), tR(e, t), Object.assign(e, t), tE) null == e[r] && (e[r] = tE[r]);
          let {
            frequency: r,
            damping: i
          } = e, {
            mass: s
          } = e;
          C.und(r) || (r < .01 && (r = .01), i < 0 && (i = 0), e.tension = Math.pow(2 * Math.PI / r, 2) * s, e.friction = 4 * Math.PI * i * s / r)
        }(g, tm(t.config, s), t.config !== a.config ? tm(a.config, s) : void 0);
        let x = tt(this);
        if (!x || C.und(d)) return n(t$(this, !0));
        let b = C.und(t.reset) ? i && !t.default : !C.und(c) && tg(t.reset, s),
          w = b ? c : this.get(),
          _ = tM(d),
          k = C.num(_) || C.arr(_) || eH(_),
          M = !m && (!k || tg(a.immediate || t.immediate, s));
        if (p) {
          let e = tf(d);
          if (e !== x.constructor)
            if (M) x = this._set(_);
            else throw Error(`Cannot animate between ${x.constructor.name} and ${e.name}, as the "to" prop suggests`)
        }
        let I = x.constructor,
          P = eM(d),
          S = !1;
        if (!P) {
          let e = b || !tG(this) && h;
          (p || e) && (P = !(S = R(tM(w), _))), (R(l.immediate, M) || M) && R(g.decay, y) && R(g.velocity, v) || (P = !0)
        }
        if (S && tH(this) && (l.changed && !b ? P = !0 : P || this._stop(u)), !m && ((P || eM(u)) && (l.values = x.getPayload(), l.toValues = eM(d) ? null : I == ts ? [1] : j(_)), l.immediate != M && (l.immediate = M, M || b || this._set(u)), P)) {
          let {
            onRest: e
          } = l;
          V(t5, e => t8(this, t, e));
          let r = t$(this, tY(this, u));
          q(this._pendingCalls, r), this._pendingCalls.add(n), l.changed && o.batchedUpdates(() => {
            l.changed = !b, e?.(r, this), b ? tm(a.onRest, r) : l.onStart?.(r, this)
          })
        }
        b && this._set(w), m ? n(tL(t.to, t, this._state, this)) : P ? this._start() : tH(this) && !p ? this._pendingCalls.add(n) : n(tq(w))
      }
      _focus(e) {
        let t = this.animation;
        e !== t.to && (eP(this) && this._detach(), t.to = e, eP(this) && this._attach())
      }
      _attach() {
        let e = 0,
          {
            to: t
          } = this.animation;
        eM(t) && (eE(t, this), t instanceof tW && (e = t.priority + 1)), this.priority = e
      }
      _detach() {
        let {
          to: e
        } = this.animation;
        eM(e) && eC(e, this)
      }
      _set(e, t = !0) {
        let n = eI(e);
        if (!C.und(n)) {
          let e = tt(this);
          if (!e || !R(n, e.getValue())) {
            let r = tf(n);
            if (e && e.constructor == r) e.setValue(n);
            else E(this, te, r.create(n));
            e && o.batchedUpdates(() => {
              this._onChange(n, t)
            })
          }
        }
        return tt(this)
      }
      _onStart() {
        let e = this.animation;
        e.changed || (e.changed = !0, t9(this, "onStart", t$(this, tY(this, e.to)), this))
      }
      _onChange(e, t) {
        t || (this._onStart(), tm(this.animation.onChange, e, this)), tm(this.defaultProps.onChange, e, this), super._onChange(e, t)
      }
      _start() {
        let e = this.animation;
        tt(this).reset(eI(e.to)), e.immediate || (e.fromValues = e.values.map(e => e.lastPosition)), !tH(this) && (tK(this, !0), tZ(this) || this._resume())
      }
      _resume() {
        P.skipAnimation ? this.finish() : G.start(this)
      }
      _stop(e, t) {
        if (tH(this)) {
          tK(this, !1);
          let n = this.animation;
          V(n.values, e => {
            e.done = !0
          }), n.toValues && (n.onChange = n.onPause = n.onResume = void 0), eS(this, {
            type: "idle",
            parent: this
          });
          let r = t ? tT(this.get()) : t$(this.get(), tY(this, e ?? n.to));
          q(this._pendingCalls, r), n.changed && (n.changed = !1, t9(this, "onRest", r, this))
        }
      }
    };

  function tY(e, t) {
    let n = tM(t);
    return R(tM(e.get()), n)
  }

  function t0(e, t = e.loop, n = e.to) {
    let r = tm(t);
    if (r) {
      let i = !0 !== r && tk(r),
        s = (i || e).reverse,
        a = !i || i.reset;
      return t1({
        ...e,
        loop: t,
        default: !1,
        pause: void 0,
        to: !s || tP(n) ? n : void 0,
        from: a ? e.from : void 0,
        reset: a,
        ...i
      })
    }
  }

  function t1(e) {
    let {
      to: t,
      from: n
    } = e = tk(e), r = new Set;
    return C.obj(t) && t2(t, r), C.obj(n) && t2(n, r), e.keys = r.size ? Array.from(r) : null, e
  }

  function t2(e, t) {
    z(e, (e, n) => null != e && t.add(n))
  }
  var t5 = ["onStart", "onRest", "onChange", "onPause", "onResume"];

  function t8(e, t, n) {
    e.animation[n] = t[n] !== tv(t, n) ? ty(t[n], e.key) : void 0
  }

  function t9(e, t, ...n) {
    e.animation[t]?.(...n), e.defaultProps[t]?.(...n)
  }
  var t3 = ["onStart", "onChange", "onRest"],
    t6 = 1,
    t4 = class {
      constructor(e, t) {
        this.id = t6++, this.springs = {}, this.queue = [], this._lastAsyncId = 0, this._active = new Set, this._changed = new Set, this._started = !1, this._state = {
          paused: !1,
          pauseQueue: new Set,
          resumeQueue: new Set,
          timeouts: new Set
        }, this._events = {
          onStart: new Map,
          onChange: new Map,
          onRest: new Map
        }, this._onFrame = this._onFrame.bind(this), t && (this._flush = t), e && this.start({
          default: !0,
          ...e
        })
      }
      get idle() {
        return !this._state.asyncTo && Object.values(this.springs).every(e => e.idle && !e.isDelayed && !e.isPaused)
      }
      get item() {
        return this._item
      }
      set item(e) {
        this._item = e
      }
      get() {
        let e = {};
        return this.each((t, n) => e[n] = t.get()), e
      }
      set(e) {
        for (let t in e) {
          let n = e[t];
          C.und(n) || this.springs[t].set(n)
        }
      }
      update(e) {
        return e && this.queue.push(t1(e)), this
      }
      start(e) {
        let {
          queue: t
        } = this;
        return (e ? t = j(e).map(t1) : this.queue = [], this._flush) ? this._flush(this, t) : (ns(this, t), t7(this, t))
      }
      stop(e, t) {
        if (!!e !== e && (t = e), t) {
          let n = this.springs;
          V(j(t), t => n[t].stop(!!e))
        } else tQ(this._state, this._lastAsyncId), this.each(t => t.stop(!!e));
        return this
      }
      pause(e) {
        if (C.und(e)) this.start({
          pause: !0
        });
        else {
          let t = this.springs;
          V(j(e), e => t[e].pause())
        }
        return this
      }
      resume(e) {
        if (C.und(e)) this.start({
          pause: !1
        });
        else {
          let t = this.springs;
          V(j(e), e => t[e].resume())
        }
        return this
      }
      each(e) {
        z(this.springs, e)
      }
      _onFrame() {
        let {
          onStart: e,
          onChange: t,
          onRest: n
        } = this._events, r = this._active.size > 0, i = this._changed.size > 0;
        (r && !this._started || i && !this._started) && (this._started = !0, F(e, ([e, t]) => {
          t.value = this.get(), e(t, this, this._item)
        }));
        let s = !r && this._started,
          a = i || s && n.size ? this.get() : null;
        i && t.size && F(t, ([e, t]) => {
          t.value = a, e(t, this, this._item)
        }), s && (this._started = !1, F(n, ([e, t]) => {
          t.value = a, e(t, this, this._item)
        }))
      }
      eventObserved(e) {
        if ("change" == e.type) this._changed.add(e.parent), e.idle || this._active.add(e.parent);
        else {
          if ("idle" != e.type) return;
          this._active.delete(e.parent)
        }
        o.onFrame(this._onFrame)
      }
    };

  function t7(e, t) {
    return Promise.all(t.map(t => ne(e, t))).then(t => tF(e, t))
  }
  async function ne(e, t, n) {
    let {
      keys: r,
      to: i,
      from: s,
      loop: a,
      onRest: l,
      onResolve: u
    } = t, f = C.obj(t.default) && t.default;
    a && (t.loop = !1), !1 === i && (t.to = null), !1 === s && (t.from = null);
    let d = C.arr(i) || C.fun(i) ? i : void 0;
    d ? (t.to = void 0, t.onRest = void 0, f && (f.onRest = void 0)) : V(t3, n => {
      let r = t[n];
      if (C.fun(r)) {
        let i = e._events[n];
        t[n] = ({
          finished: e,
          cancelled: t
        }) => {
          let n = i.get(r);
          n ? (e || (n.finished = !1), t && (n.cancelled = !0)) : i.set(r, {
            value: null,
            finished: e || !1,
            cancelled: t || !1
          })
        }, f && (f[n] = t[n])
      }
    });
    let c = e._state;
    !c.paused === t.pause ? (c.paused = t.pause, q(t.pause ? c.pauseQueue : c.resumeQueue)) : c.paused && (t.pause = !0);
    let h = (r || Object.keys(e.springs)).map(n => e.springs[n].start(t)),
      p = !0 === t.cancel || !0 === tv(t, "cancel");
    (d || p && c.asyncId) && h.push(tj(++e._lastAsyncId, {
      props: t,
      state: c,
      actions: {
        pause: A,
        resume: A,
        start(t, n) {
          p ? (tQ(c, e._lastAsyncId), n(tT(e))) : (t.onRest = l, n(tL(d, t, c, e)))
        }
      }
    })), c.paused && await new Promise(e => {
      c.resumeQueue.add(e)
    });
    let m = tF(e, await Promise.all(h));
    if (a && m.finished && !(n && m.noop)) {
      let n = t0(t, a, i);
      if (n) return ns(e, [n]), ne(e, n, !0)
    }
    return u && o.batchedUpdates(() => u(m, e, e.item)), m
  }

  function nt(e, t) {
    let n = {
      ...e.springs
    };
    return t && V(j(t), e => {
      C.und(e.keys) && (e = t1(e)), C.obj(e.to) || (e = {
        ...e,
        to: void 0
      }), ni(n, e, e => nr(e))
    }), nn(e, n), n
  }

  function nn(e, t) {
    z(t, (t, n) => {
      e.springs[n] || (e.springs[n] = t, eE(t, e))
    })
  }

  function nr(e, t) {
    let n = new tX;
    return n.key = e, t && eE(n, t), n
  }

  function ni(e, t, n) {
    t.keys && V(t.keys, r => {
      (e[r] || (e[r] = n(r)))._prepareNode(t)
    })
  }

  function ns(e, t) {
    V(t, t => {
      ni(e.springs, t, t => nr(t, e))
    })
  }
  var na = M.createContext({
      pause: !1,
      immediate: !1
    }),
    no = () => {
      let e = [],
        t = function(t) {
          eG();
          let r = [];
          return V(e, (e, i) => {
            if (C.und(t)) r.push(e.start());
            else {
              let s = n(t, e, i);
              s && r.push(e.start(s))
            }
          }), r
        };
      t.current = e, t.add = function(t) {
        e.includes(t) || e.push(t)
      }, t.delete = function(t) {
        let n = e.indexOf(t);
        ~n && e.splice(n, 1)
      }, t.pause = function() {
        return V(e, e => e.pause(...arguments)), this
      }, t.resume = function() {
        return V(e, e => e.resume(...arguments)), this
      }, t.set = function(t) {
        V(e, (e, n) => {
          let r = C.fun(t) ? t(n, e) : t;
          r && e.set(r)
        })
      }, t.start = function(t) {
        let n = [];
        return V(e, (e, r) => {
          if (C.und(t)) n.push(e.start());
          else {
            let i = this._getProps(t, e, r);
            i && n.push(e.start(i))
          }
        }), n
      }, t.stop = function() {
        return V(e, e => e.stop(...arguments)), this
      }, t.update = function(t) {
        return V(e, (e, n) => e.update(this._getProps(t, e, n))), this
      };
      let n = function(e, t, n) {
        return C.fun(e) ? e(n, t) : e
      };
      return t._getProps = n, t
    },
    nl = 1,
    nu = class extends tW {
      constructor(e, t) {
        super(), this.source = e, this.idle = !0, this._active = new Set, this.calc = ey(...t);
        const n = this._get();
        ((e, t) => E(e, te, t))(this, tf(n).create(n))
      }
      advance(e) {
        let t = this._get();
        R(t, this.get()) || (tt(this).setValue(t), this._onChange(t, this.idle)), !this.idle && nd(this._active) && nc(this)
      }
      _get() {
        let e = C.arr(this.source) ? this.source.map(eI) : j(eI(this.source));
        return this.calc(...e)
      }
      _start() {
        this.idle && !nd(this._active) && (this.idle = !1, V(tn(this), e => {
          e.done = !1
        }), P.skipAnimation ? (o.batchedUpdates(() => this.advance()), nc(this)) : G.start(this))
      }
      _attach() {
        let e = 1;
        V(j(this.source), t => {
          eM(t) && eE(t, this), t instanceof tW && (t.idle || this._active.add(t), e = Math.max(e, t.priority + 1))
        }), this.priority = e, this._start()
      }
      _detach() {
        V(j(this.source), e => {
          eM(e) && eC(e, this)
        }), this._active.clear(), nc(this)
      }
      eventObserved(e) {
        "change" == e.type ? e.idle ? this.advance() : (this._active.add(e.parent), this._start()) : "idle" == e.type ? this._active.delete(e.parent) : "priority" == e.type && (this.priority = j(this.source).reduce((e, t) => Math.max(e, (t instanceof tW ? t.priority : 0) + 1), 0))
      }
    };

  function nf(e) {
    return !1 !== e.idle
  }

  function nd(e) {
    return !e.size || Array.from(e).every(nf)
  }

  function nc(e) {
    e.idle || (e.idle = !0, V(tn(e), e => {
      e.done = !0
    }), eS(e, {
      type: "idle",
      parent: e
    }))
  }
  P.assign({
    createStringInterpolator: eQ,
    to: (e, t) => new nu(e, t)
  }), G.advance, e.s(["SpringValue", 0, tX, "config", 0, tA, "useSpring", 0, function(e, t) {
    let n = C.fun(e),
      [
        [r], i
      ] = function(e, t, n) {
        let r = C.fun(t) && t;
        r && !n && (n = []);
        let i = (0, M.useMemo)(() => r || 3 == arguments.length ? no() : void 0, []),
          s = (0, M.useRef)(0),
          a = e3(),
          o = (0, M.useMemo)(() => ({
            ctrls: [],
            queue: [],
            flush(e, t) {
              let n = nt(e, t);
              return !(s.current > 0) || o.queue.length || Object.keys(n).some(t => !e.springs[t]) ? new Promise(r => {
                nn(e, n), o.queue.push(() => {
                  r(t7(e, t))
                }), a()
              }) : t7(e, t)
            }
          }), []),
          l = (0, M.useRef)([...o.ctrls]),
          u = (0, M.useRef)([]),
          f = e7(e) || 0;

        function d(e, n) {
          for (let i = e; i < n; i++) {
            let e = l.current[i] || (l.current[i] = new t4(null, o.flush)),
              n = r ? r(i, e) : t[i];
            n && (u.current[i] = function(e) {
              let t = t1(e);
              return C.und(t.default) && (t.default = tb(t)), t
            }(n))
          }
        }(0, M.useMemo)(() => {
          V(l.current.slice(e, f), e => {
            tS(e, i), e.stop(!0)
          }), l.current.length = e, d(f, e)
        }, [e]), (0, M.useMemo)(() => {
          d(0, Math.min(f, e))
        }, n);
        let c = l.current.map((e, t) => nt(e, u.current[t])),
          h = (0, M.useContext)(na),
          p = e7(h),
          m = h !== p && tI(h);
        e9(() => {
          s.current++, o.ctrls = l.current;
          let {
            queue: e
          } = o;
          e.length && (o.queue = [], V(e, e => e())), V(l.current, (e, t) => {
            i?.add(e), m && e.start({
              default: h
            });
            let n = u.current[t];
            n && (tO(e, n.ref), e.ref ? e.queue.push(n) : e.start(n))
          })
        }), e6(() => () => {
          V(o.ctrls, e => e.stop(!0))
        });
        let g = c.map(e => ({
          ...e
        }));
        return i ? [g, i] : g
      }(1, n ? e : [e], n ? t || [] : t);
    return n || 2 == arguments.length ? [r, i] : r
  }, "useTransition", 0, function(e, t, n) {
    let r = C.fun(t) && t,
      {
        reset: i,
        sort: s,
        trail: a = 0,
        expires: o = !0,
        exitBeforeEnter: l = !1,
        onDestroyed: u,
        ref: f,
        config: d
      } = r ? r() : t,
      c = (0, M.useMemo)(() => r || 3 == arguments.length ? no() : void 0, []),
      h = j(e),
      p = [],
      m = (0, M.useRef)(null),
      g = i ? null : m.current;
    e9(() => {
      m.current = p
    }), e6(() => (V(p, e => {
      c?.add(e.ctrl), e.ctrl.ref = c
    }), () => {
      V(m.current, e => {
        e.expired && clearTimeout(e.expirationId), tS(e.ctrl, c), e.ctrl.stop(!0)
      })
    }));
    let y = function(e, {
        key: t,
        keys: n = t
      }, r) {
        if (null === n) {
          let t = new Set;
          return e.map(e => {
            let n = r && r.find(n => n.item === e && "leave" !== n.phase && !t.has(n));
            return n ? (t.add(n), n.key) : nl++
          })
        }
        return C.und(n) ? e : C.fun(n) ? e.map(n) : j(n)
      }(h, r ? r() : t, g),
      v = i && m.current || [];
    e9(() => V(v, ({
      ctrl: e,
      item: t,
      key: n
    }) => {
      tS(e, c), tm(u, t, n)
    }));
    let x = [];
    if (g && V(g, (e, t) => {
        e.expired ? (clearTimeout(e.expirationId), v.push(e)) : ~(t = x[t] = y.indexOf(e.key)) && (p[t] = e)
      }), V(h, (e, t) => {
        p[t] || (p[t] = {
          key: y[t],
          item: e,
          phase: "mount",
          ctrl: new t4
        }, p[t].ctrl.item = e)
      }), x.length) {
      let e = -1,
        {
          leave: n
        } = r ? r() : t;
      V(x, (t, r) => {
        let i = g[r];
        ~t ? (e = p.indexOf(i), p[e] = {
          ...i,
          item: h[t]
        }) : n && p.splice(++e, 0, i)
      })
    }
    C.fun(s) && p.sort((e, t) => s(e.item, t.item));
    let b = -a,
      w = e3(),
      _ = tb(t),
      k = new Map,
      I = (0, M.useRef)(new Map),
      P = (0, M.useRef)(!1);
    V(p, (e, n) => {
      let i, s, u = e.key,
        c = e.phase,
        h = r ? r() : t,
        p = tm(h.delay || 0, u);
      if ("mount" == c) i = h.enter, s = "enter";
      else {
        let e = 0 > y.indexOf(u);
        if ("leave" != c)
          if (e) i = h.leave, s = "leave";
          else {
            if (!(i = h.update)) return;
            s = "update"
          }
        else {
          if (e) return;
          i = h.enter, s = "enter"
        }
      }
      if (i = tm(i, e.item, n), !(i = C.obj(i) ? tk(i) : {
          to: i
        }).config) {
        let t = d || _.config;
        i.config = tm(t, e.item, n, s)
      }
      b += a;
      let v = {
        ..._,
        delay: p + b,
        ref: f,
        immediate: h.immediate,
        reset: !1,
        ...i
      };
      if ("enter" == s && C.und(v.from)) {
        let i = r ? r() : t;
        v.from = tm(C.und(i.initial) || g ? i.from : i.initial, e.item, n)
      }
      let {
        onResolve: x
      } = v;
      v.onResolve = e => {
        tm(x, e);
        let t = m.current,
          n = t.find(e => e.key === u);
        if (n && (!e.cancelled || "update" == n.phase) && n.ctrl.idle) {
          let e = t.every(e => e.ctrl.idle);
          if ("leave" == n.phase) {
            let t = tm(o, n.item);
            if (!1 !== t) {
              let r = !0 === t ? 0 : t;
              if (n.expired = !0, !e && r > 0) {
                r <= 0x7fffffff && (n.expirationId = setTimeout(w, r));
                return
              }
            }
          }
          e && t.some(e => e.expired) && (I.current.delete(n), l && (P.current = !0), w())
        }
      };
      let M = nt(e.ctrl, v);
      "leave" === s && l ? I.current.set(e, {
        phase: s,
        springs: M,
        payload: v
      }) : k.set(e, {
        phase: s,
        springs: M,
        payload: v
      })
    });
    let S = (0, M.useContext)(na),
      O = e7(S),
      A = S !== O && tI(S);
    e9(() => {
      A && V(p, e => {
        e.ctrl.start({
          default: S
        })
      })
    }, [S]), V(k, (e, t) => {
      if (I.current.size) {
        let e = p.findIndex(e => e.key === t.key);
        p.splice(e, 1)
      }
    }), e9(() => {
      V(I.current.size ? I.current : k, ({
        phase: e,
        payload: t
      }, n) => {
        let {
          ctrl: r
        } = n;
        n.phase = e, c?.add(r), A && "enter" == e && r.start({
          default: S
        }), t && (tO(r, t.ref), (r.ref || c) && !P.current ? r.update(t) : (r.start(t), P.current && (P.current = !1)))
      })
    }, i ? void 0 : n);
    let E = e => M.createElement(M.Fragment, null, p.map((t, n) => {
      let {
        springs: r
      } = k.get(t) || t.ctrl, i = e({
        ...r
      }, t.item, t, n), s = C.str(t.key) || C.num(t.key) ? t.key : t.ctrl.id, a = M.version < "19.0.0", o = i?.props ?? {}, l = a ? i?.ref : o?.ref;
      return i && i.type ? M.createElement(i.type, {
        ...o,
        key: s,
        ref: l
      }) : i
    }));
    return c ? [E, c] : E
  }], 65658);
  var nh = e.i(74080),
    np = /^--/,
    nm = {},
    ng = {
      animationIterationCount: !0,
      borderImageOutset: !0,
      borderImageSlice: !0,
      borderImageWidth: !0,
      boxFlex: !0,
      boxFlexGroup: !0,
      boxOrdinalGroup: !0,
      columnCount: !0,
      columns: !0,
      flex: !0,
      flexGrow: !0,
      flexPositive: !0,
      flexShrink: !0,
      flexNegative: !0,
      flexOrder: !0,
      gridRow: !0,
      gridRowEnd: !0,
      gridRowSpan: !0,
      gridRowStart: !0,
      gridColumn: !0,
      gridColumnEnd: !0,
      gridColumnSpan: !0,
      gridColumnStart: !0,
      fontWeight: !0,
      lineClamp: !0,
      lineHeight: !0,
      opacity: !0,
      order: !0,
      orphans: !0,
      tabSize: !0,
      widows: !0,
      zIndex: !0,
      zoom: !0,
      fillOpacity: !0,
      floodOpacity: !0,
      stopOpacity: !0,
      strokeDasharray: !0,
      strokeDashoffset: !0,
      strokeMiterlimit: !0,
      strokeOpacity: !0,
      strokeWidth: !0
    },
    ny = ["Webkit", "Ms", "Moz", "O"];
  ng = Object.keys(ng).reduce((e, t) => (ny.forEach(n => e[n + t.charAt(0).toUpperCase() + t.substring(1)] = e[t]), e), ng);
  var nv = /^(matrix|translate|scale|rotate|skew)/,
    nx = /^(translate)/,
    nb = /^(rotate|skew)/,
    nw = (e, t) => C.num(e) && 0 !== e ? e + t : e,
    n_ = (e, t) => C.arr(e) ? e.every(e => n_(e, t)) : C.num(e) ? e === t : parseFloat(e) === t,
    nk = class extends to {
      constructor({
        x: e,
        y: t,
        z: n,
        ...r
      }) {
        const i = [],
          s = [];
        (e || t || n) && (i.push([e || 0, t || 0, n || 0]), s.push(e => [`translate3d(${e.map(e=>nw(e,"px")).join(",")})`, n_(e, 0)])), z(r, (e, t) => {
          if ("transform" === t) i.push([e || ""]), s.push(e => [e, "" === e]);
          else if (nv.test(t)) {
            if (delete r[t], C.und(e)) return;
            let n = nx.test(t) ? "px" : nb.test(t) ? "deg" : "";
            i.push(j(e)), s.push("rotate3d" === t ? ([e, t, r, i]) => [`rotate3d(${e},${t},${r},${nw(i,n)})`, n_(i, 0)] : e => [`${t}(${e.map(e=>nw(e,n)).join(",")})`, n_(e, +!!t.startsWith("scale"))])
          }
        }), i.length && (r.transform = new nM(i, s)), super(r)
      }
    },
    nM = class extends eO {
      constructor(e, t) {
        super(), this.inputs = e, this.transforms = t, this._value = null
      }
      get() {
        return this._value || (this._value = this._get())
      }
      _get() {
        let e = "",
          t = !0;
        return V(this.inputs, (n, r) => {
          let i = eI(n[0]),
            [s, a] = this.transforms[r](C.arr(i) ? i : n.map(eI));
          e += " " + s, t = t && a
        }), t ? "none" : e
      }
      observerAdded(e) {
        1 == e && V(this.inputs, e => V(e, e => eM(e) && eE(e, this)))
      }
      observerRemoved(e) {
        0 == e && V(this.inputs, e => V(e, e => eM(e) && eC(e, this)))
      }
      eventObserved(e) {
        "change" == e.type && (this._value = null), eS(this, e)
      }
    };
  P.assign({
    batchedUpdates: nh.unstable_batchedUpdates,
    createStringInterpolator: eQ,
    colors: X
  });
  var nI = ((e, {
    applyAnimatedValues: t = () => !1,
    createAnimatedStyle: n = e => new to(e),
    getComponentProps: r = e => e
  } = {}) => {
    let i = {
        applyAnimatedValues: t,
        createAnimatedStyle: n,
        getComponentProps: r
      },
      s = e => {
        let t = tp(e) || "Anonymous";
        return (e = C.str(e) ? s[e] || (s[e] = td(e, i)) : e[th] || (e[th] = td(e, i))).displayName = `Animated(${t})`, e
      };
    return z(e, (t, n) => {
      C.arr(e) && (n = tp(t)), s[n] = s(t)
    }), {
      animated: s
    }
  })(["a", "abbr", "address", "area", "article", "aside", "audio", "b", "base", "bdi", "bdo", "big", "blockquote", "body", "br", "button", "canvas", "caption", "cite", "code", "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "link", "main", "map", "mark", "menu", "menuitem", "meta", "meter", "nav", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "script", "section", "select", "small", "source", "span", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "u", "ul", "var", "video", "wbr", "circle", "clipPath", "defs", "ellipse", "foreignObject", "g", "image", "line", "linearGradient", "mask", "path", "pattern", "polygon", "polyline", "radialGradient", "rect", "stop", "svg", "text", "tspan"], {
    applyAnimatedValues: function(e, t) {
      if (!e.nodeType || !e.setAttribute) return !1;
      let n = "filter" === e.nodeName || e.parentNode && "filter" === e.parentNode.nodeName,
        {
          className: r,
          style: i,
          children: s,
          scrollTop: a,
          scrollLeft: o,
          viewBox: l,
          ...u
        } = t,
        f = Object.values(u),
        d = Object.keys(u).map(t => n || e.hasAttribute(t) ? t : nm[t] || (nm[t] = t.replace(/([A-Z])/g, e => "-" + e.toLowerCase())));
      for (let t in void 0 !== s && (e.textContent = s), i)
        if (i.hasOwnProperty(t)) {
          var c;
          let n = null == (c = i[t]) || "boolean" == typeof c || "" === c ? "" : "number" != typeof c || 0 === c || np.test(t) || ng.hasOwnProperty(t) && ng[t] ? ("" + c).trim() : c + "px";
          np.test(t) ? e.style.setProperty(t, n) : e.style[t] = n
        } d.forEach((t, n) => {
        e.setAttribute(t, f[n])
      }), void 0 !== r && (e.className = r), void 0 !== a && (e.scrollTop = a), void 0 !== o && (e.scrollLeft = o), void 0 !== l && e.setAttribute("viewBox", l)
    },
    createAnimatedStyle: e => new nk(e),
    getComponentProps: ({
      scrollTop: e,
      scrollLeft: t,
      ...n
    }) => n
  }).animated;
  e.s(["animated", 0, nI], 48787)
}]);