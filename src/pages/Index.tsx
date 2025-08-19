import { Hero } from "@/components/Hero";
import { MobileFeatures } from "@/components/MobileFeatures";
import { Pricing } from "@/components/Pricing";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <MobileFeatures />
      <Pricing />
      <Footer />
    </div>
  );
};

export default Index;