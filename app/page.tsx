import Hero from "@/components/Hero";
import About from "@/components/About";
import Business from "@/components/Business";
import WhyBaseAI from "@/components/WhyBaseAI";
import Events from "@/components/Events";
import News from "@/components/News";
import ContactCTA from "@/components/ContactCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Business variant="summary" />
      <WhyBaseAI variant="summary" />
      <Events variant="summary" />
      <News />
      <ContactCTA />
    </>
  );
}
