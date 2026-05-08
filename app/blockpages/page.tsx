import Footer from "@/components/landing/Footer";
import LandingNav from "@/components/landing/LandingNav";
import { BuilderProvider } from "./buttonblock/BuilderContext";
import LeftSidebar from "./buttonblock/LeftSidebar";
import MainCanvas from "./buttonblock/MainCanvas";
import RightSidebar from "./buttonblock/RightSidebar";

export default function BlockPages() {
  return (
    <BuilderProvider>
      <main className="flex min-h-screen flex-col bg-[#f0f2f5] text-slate-900">
        <LandingNav />

        <section className="flex min-h-[calc(100vh-64px)] flex-1 overflow-hidden bg-[#f0f2f5]">
          <LeftSidebar />
          <MainCanvas />
          <RightSidebar />
        </section>

        <Footer />
      </main>
    </BuilderProvider>
  );
}
