// 디지털 UI 사조 자체 CSS 예시 (self-contained inline-styled HTML)
// 명화가 없는 디지털 사조의 "스타일 예시" — 미감 SVG 다이어그램과 같은 역할
module.exports = {
  skeuomorphism: `<div style="display:flex;gap:16px;align-items:center;justify-content:center;flex-wrap:wrap;padding:38px;background:linear-gradient(#efe9df,#d8d0c0);font-family:sans-serif">
    <button style="font:600 14px sans-serif;color:#4a3b2a;padding:12px 22px;border-radius:10px;background:linear-gradient(#fdfaf3,#dccfb6);border:1px solid #b3a585;box-shadow:0 2px 3px rgba(0,0,0,.3),inset 0 1px 0 #fff;cursor:default">눌러보기</button>
    <div style="width:56px;height:56px;border-radius:13px;background:linear-gradient(#7fb2e6,#2f6fb0);box-shadow:0 3px 6px rgba(0,0,0,.4),inset 0 1px 2px rgba(255,255,255,.65)"></div>
    <div style="width:120px;height:34px;border-radius:18px;background:linear-gradient(#cfcabd,#efe9df);box-shadow:inset 0 2px 4px rgba(0,0,0,.3);position:relative"><span style="position:absolute;top:2px;left:2px;width:30px;height:30px;border-radius:50%;background:linear-gradient(#fff,#d6cdbb);box-shadow:0 1px 2px rgba(0,0,0,.4)"></span></div>
  </div>`,
  'flat-design': `<div style="display:flex;gap:16px;align-items:center;justify-content:center;flex-wrap:wrap;padding:42px;background:#ecf0f1;font-family:sans-serif">
    <button style="font:600 14px sans-serif;color:#fff;padding:13px 26px;background:#1abc9c;border:none;cursor:default">버튼</button>
    <div style="width:54px;height:54px;background:#e74c3c"></div>
    <div style="width:54px;height:54px;background:#3498db;border-radius:50%"></div>
    <div style="width:54px;height:54px;background:#f1c40f"></div>
  </div>`,
  neumorphism: `<div style="display:flex;gap:22px;align-items:center;justify-content:center;flex-wrap:wrap;padding:46px;background:#e0e5ec;font-family:sans-serif">
    <button style="font:600 14px sans-serif;color:#5b6478;padding:15px 26px;border:none;border-radius:15px;background:#e0e5ec;box-shadow:6px 6px 12px #bcc3cf,-6px -6px 12px #ffffff;cursor:default">버튼</button>
    <div style="width:58px;height:58px;border-radius:50%;background:#e0e5ec;box-shadow:inset 5px 5px 10px #bcc3cf,inset -5px -5px 10px #fff"></div>
    <div style="width:58px;height:58px;border-radius:16px;background:#e0e5ec;box-shadow:5px 5px 10px #bcc3cf,-5px -5px 10px #fff"></div>
  </div>`,
  glassmorphism: `<div style="display:flex;align-items:center;justify-content:center;padding:44px;background:linear-gradient(135deg,#ff9a9e,#a18cd1 55%,#5ee7df);font-family:sans-serif">
    <div style="padding:22px 30px;border-radius:18px;background:rgba(255,255,255,.18);-webkit-backdrop-filter:blur(9px);backdrop-filter:blur(9px);border:1px solid rgba(255,255,255,.45);box-shadow:0 8px 32px rgba(31,38,135,.2);color:#fff">
      <div style="font:600 16px sans-serif">Glassmorphism</div>
      <div style="font:400 12px sans-serif;opacity:.9;margin-top:5px">반투명 · 블러 · 빛 통과</div>
    </div>
  </div>`,
  'neo-brutalism': `<div style="display:flex;gap:18px;align-items:center;justify-content:center;flex-wrap:wrap;padding:40px;background:#fde047;font-family:sans-serif">
    <button style="font:700 14px sans-serif;color:#000;padding:13px 22px;background:#fff;border:3px solid #000;box-shadow:5px 5px 0 #000;cursor:default">버튼</button>
    <div style="width:54px;height:54px;background:#4ade80;border:3px solid #000;box-shadow:5px 5px 0 #000"></div>
    <div style="font:700 16px sans-serif;color:#000;background:#f472b6;border:3px solid #000;box-shadow:5px 5px 0 #000;padding:12px 16px">A!</div>
  </div>`,
  y2k: `<div style="display:flex;gap:18px;align-items:center;justify-content:center;flex-wrap:wrap;padding:40px;background:linear-gradient(160deg,#bcd4f0,#7d9bc4);font-family:'Arial Black',sans-serif">
    <div style="font:800 26px 'Arial Black',sans-serif;background:linear-gradient(#ffffff,#b8c6da 45%,#6f8bb0 55%,#dfe9f5);-webkit-background-clip:text;background-clip:text;color:transparent;text-shadow:0 1px 1px rgba(255,255,255,.5)">Y2K</div>
    <div style="width:52px;height:52px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff,#aac4e6 42%,#5a7fb0)"></div>
    <div style="width:52px;height:52px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff,#d6b8e6 42%,#9a6fb0)"></div>
  </div>`,
  vaporwave: `<div style="position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;padding:48px 40px;background:linear-gradient(#2b1055,#7b2f9e 60%,#ff6ad5);font-family:sans-serif">
    <div style="position:absolute;left:0;right:0;bottom:0;height:46%;background:repeating-linear-gradient(90deg,transparent 0 22px,rgba(1,205,254,.5) 22px 23px),repeating-linear-gradient(0deg,transparent 0 16px,rgba(1,205,254,.5) 16px 17px);transform:perspective(120px) rotateX(58deg);transform-origin:bottom"></div>
    <div style="position:relative;font:800 26px Arial,sans-serif;color:#ff71ce;text-shadow:2px 2px #01cdfe;letter-spacing:3px">VAPOR</div>
  </div>`,
  grunge: `<div style="display:flex;align-items:center;justify-content:center;padding:42px;background:#3a3531;font-family:'Courier New',monospace">
    <div style="font:700 22px 'Courier New',monospace;color:#d9cfc2;letter-spacing:1px;transform:rotate(-2.5deg);border:2px solid #d9cfc2;padding:9px 18px;box-shadow:3px 3px 0 rgba(0,0,0,.45);background:repeating-linear-gradient(45deg,rgba(0,0,0,.06) 0 3px,transparent 3px 6px)">GRUNGE</div>
  </div>`,
};
