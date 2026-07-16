import type { Metadata } from "next";
import "./globals.css";
import { RenderModeProvider } from "@/components/motion/RenderModeProvider";
import ScrollLayout from "@/components/shell/ScrollLayout";
import Header from "@/components/shell/Header";
import NavigationProgress from "@/components/shell/NavigationProgress";
import Loader from "@/components/shell/Loader";
import MeshBackdrop from "@/components/shell/MeshBackdrop";
import Footer from "@/components/shell/Footer";
import Toaster from "@/components/shell/Toaster";
import AdaptiveGrid from "@/components/shell/AdaptiveGrid";
import wikiFonts from "@/lib/wiki-google-fonts.json";

// 위키 v2: 원본 PromoBanner("Early Access Sale" 카운트다운)·CookieBanner(동의 배너+설정 모달)는
// getlayers 제품/법무 특유 장치라 통째로 제거(무관 항목).

// 파비콘 — 기존 4_작업중/site/index.html의 SVG 데이터 URI(이중 원 + 중심점, #4545da) 재사용.
// 원본 getlayers 마름모 로고의 public/favicon*.png·apple-icon*.png는 삭제했다(브랜드 잔재 제거).
const FAVICON_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23060507'/%3E%3Ccircle cx='16' cy='16' r='11' fill='none' stroke='%23f5f4f7' stroke-width='3'/%3E%3Ccircle cx='16' cy='16' r='3' fill='%234545da'/%3E%3C/svg%3E";

export const metadata: Metadata = {
  title: "크리에이티브 인덱스 — 미감·양식·타이포·전략·프론트엔드 지식 위키",
  description: "창작에 필요한 개념 381개를 한 곳에 모은 크리에이티브 인덱스.",
  icons: { icon: FAVICON_SVG },
};

// 모달 폰트 미리보기(art-movement·typography detail.fonts)용 — 위키 데이터에 등장하는 실제 서체명을
// 어댑터 스크립트(scripts/build-wiki-data.mjs)가 모아둔 목록으로 Google Fonts CSS2 한 번에 로드.
const GOOGLE_FONTS_HREF = `https://fonts.googleapis.com/css2?${wikiFonts
  .map((name) => `family=${encodeURIComponent(name).replace(/%20/g, "+")}`)
  .join("&")}&display=swap`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" data-render-mode="motion" suppressHydrationWarning>
      <head>
        {/* 원본 head 인라인 스크립트 재현 — 재방문 시 로더를 페인트 전에 숨김 */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(sessionStorage.getItem('gl-loaded'))document.documentElement.classList.add('gl-loaded')}catch(e){}",
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={GOOGLE_FONTS_HREF} />
        {/* 한글 웹폰트 — Onest/generalSans는 라틴 전용이라 한글 렌더용으로 별도 로드(fonts.css 스택 참조) */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="antialiased">
        <RenderModeProvider>
          <NavigationProgress />
          <ScrollLayout>
            <Header />
            <MeshBackdrop />
            {children}
            <Footer />
          </ScrollLayout>
          <Loader />
          <Toaster />
          <AdaptiveGrid />
        </RenderModeProvider>
      </body>
    </html>
  );
}
