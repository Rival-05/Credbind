import { Cards } from "@/components/landing/Cards";
import { Container } from "@/components/common/Container";
import { Hero } from "@/components/landing/Hero";
import { Waitlist } from "@/components/landing/waitlist";
import { FAQ } from "@/components/landing/faq";
import { Separator } from "@/components/ui/separator";
import Footer from "@/components/common/Footer";

export default function Home() {
  return (
    <div className="bg-background min-h-screen w-full pt-16">
      <Container>
        <Hero />
        <Cards />
        <Waitlist />
        <FAQ />
        <Separator />
        <Footer />
      </Container>
    </div>
  );
}
