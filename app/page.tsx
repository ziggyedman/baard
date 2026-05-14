import Hero from "@/app/components/Hero";
import Bio from "@/app/components/Bio";
import Career from "@/app/components/Career";
import Hobbies from "@/app/components/Hobbies";
import Connect from "@/app/components/Connect";

export default function Home() {
  return (
    <main>
      <Hero />
      <Bio />
      <Career />
      <Hobbies />
      <Connect />
    </main>
  );
}
