import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AwarenessSection from "@/components/AwarenessSection";
import MethodologySection from "@/components/MethodologySection";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";

const Index = () => {
  return (
    <>
      <Navbar />
      <div id='hero'>
        <Hero />
      </div>
      <div id='awareness'>
        <AwarenessSection />
      </div>
      <div id='methodology'>
        <MethodologySection />
      </div>
      <MedicalDisclaimer variant="dark" className="!rounded-none !border-x-0" />
    </>
  );
};

export default Index;
