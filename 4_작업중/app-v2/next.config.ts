import type { NextConfig } from "next";

// gh-pages 배포 시 PAGES_BASE=/qnbang-proj-creative-wiki 형태로 주입 — 로컬 개발(next dev)에선 미설정이라 "".
const basePath = process.env.PAGES_BASE ?? "";

const nextConfig: NextConfig = {
  // 정적 export — 위키 콘텐츠는 전부 클라이언트에서 읽는 로컬 JSON이라 서버 런타임이 필요 없다.
  output: "export",
  // 좌하단 Next.js DevTools 인디케이터(Route/Bundler 패널) 숨김 — dev 서버로 검토 중에도 안 보이게.
  // (프로덕션 export 빌드엔 원래 없음 — dev 전용 UI.)
  devIndicators: false,
  // 카드/모달 미디어는 인라인 svg·html이거나 외부 URL(위키미디어 등)뿐이라 Next 이미지 최적화 파이프라인 불필요.
  images: { unoptimized: true },
  basePath,
  assetPrefix: basePath || undefined,
};

export default nextConfig;
