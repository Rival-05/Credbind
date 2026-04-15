import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is CredBind?",
    answer:
      "CredBind is a digital platform that helps verify certificates quickly and securely, reducing dependence on paper-based verification.",
  },
  {
    question: "How does CredBind work?",
    answer:
      "Certificates are uploaded by authorized institutions and linked to a secure verification record. Users can verify them using a certificate ID, QR code, or verification link.",
  },
  {
    question: "Who can use CredBind?",
    answer:
      "Students, recruiters, colleges, employers, and training institutes can all use CredBind for issuing or verifying credentials.",
  },
  {
    question: "Why is CredBind useful?",
    answer:
      "It prevents fake certificates, saves time in manual verification, and builds trust between certificate holders and verifiers.",
  },
  {
    question: "Do I need an account to verify a certificate?",
    answer:
      "No, basic verification can be done without an account. Only admins or institutions need login access to manage certificates.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="mt-12 py-2 sm:py-4">
      <div id="faq" className="mx-auto min-w-5xl">
        <h2 className="text-foreground text-center text-2xl sm:text-3xl md:text-4xl">
          Frequently Asked Questions
        </h2>

        <Accordion defaultValue={[faqs[0].question]} className="bg-card p-6">
          {faqs.map((faq) => (
            <AccordionItem key={faq.question} value={faq.question}>
              <AccordionTrigger className="cursor-pointer text-base sm:text-lg">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm sm:text-base">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
