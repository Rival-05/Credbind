import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is Credbind?",
    answer:
      "Credbind is a digital platform that helps verify certificates quickly and securely, reducing dependence on paper-based verification.",
  },
  {
    question: "How does Credbind work?",
    answer:
      "Certificates are uploaded by authorized institutions and linked to a secure verification record. Users can verify them using a certificate Id.",
  },
  {
    question: "Who can use Credbind?",
    answer:
      "Students, recruiters, colleges, employers, and training institutes can all use Credbind for issuing or verifying credentials.",
  },
  {
    question: "Why is Credbind useful?",
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
    <div className="mx-auto w-full max-w-5xl px-3 py-4 sm:mt-2 sm:px-4 sm:py-6 md:px-6 md:py-10">
      <h2 className="text-foreground text-center text-lg sm:text-2xl md:text-3xl lg:text-4xl">
        Frequently Asked Questions
      </h2>

      <Accordion
        defaultValue={[faqs[0].question]}
        className="mt-6 w-full p-2 sm:mt-8 sm:p-3 md:p-4 lg:p-6"
      >
        {faqs.map((faq) => (
          <AccordionItem
            key={faq.question}
            value={faq.question}
            className="w-full"
          >
            <AccordionTrigger className="hover:text-foreground w-full cursor-pointer py-3 text-left text-xs whitespace-normal transition-colors sm:py-4 sm:text-sm md:text-base">
              {faq.question}
            </AccordionTrigger>

            <AccordionContent className="text-muted-foreground w-full pb-3 text-xs leading-relaxed sm:pb-4 sm:text-sm md:text-base">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
