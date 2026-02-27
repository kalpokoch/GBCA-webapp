import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AwarenessSection from "@/components/AwarenessSection";
import MethodologySection from "@/components/MethodologySection";

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
    </>
  );
};

export default Index;
