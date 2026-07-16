import HomeHero from "@/components/hero/HomeHero";
import DomainOverview from "@/components/library/DomainOverview";
import ProjectsGrid from "@/components/library/ProjectsGrid";

export default function Home() {
  return (
    <>
      <HomeHero />
      <main className="relative w-full px-4 lg:z-20">
        <DomainOverview />
        <ProjectsGrid />
      </main>
    </>
  );
}
