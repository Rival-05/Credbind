import { Cards } from "@/components/landing/Cards";
import { Container } from "@/components/common/Container";
import { Hero } from "@/components/landing/Hero";
import { Steps } from "@/components/landing/Steps";
import Footer from "@/components/common/Footer";

export default function Home() {
  return (
    <div className="bg-background min-h-screen w-full pt-16">
      <Container>
        <Hero />
        <Cards />
        <Steps />
        <Footer />
      </Container>
    </div>
  );
}
