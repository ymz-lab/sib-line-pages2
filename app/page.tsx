import Hero from "@/components/Hero";
import About from "@/components/About";
import Business from "@/components/Business";
import MissionVisionValue from "@/components/MissionVisionValue";
import Events from "@/components/Events";
import Partners from "@/components/Partners";
import News from "@/components/News";
import ContactCTA from "@/components/ContactCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Business variant="summary" />
      <MissionVisionValue variant="summary" />
      <Events variant="summary" />
      <Partners variant="summary" />
      <News />
      <ContactCTA />
    </>
  );
}
