import { HeroBanner } from "@/components/home/HeroBanner";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { FeatureSection } from "@/components/home/FeatureSection";

export default function Home() {
  return (
    <div>
      <HeroBanner />
      <FeaturedProducts />
      <FeatureSection />
      <CategoryShowcase />
    </div>
  );
}
