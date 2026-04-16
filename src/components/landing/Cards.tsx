import FingerprintIcon from "../svgs/fingerprint";
import ShieldIcon from "../svgs/shield";
import SealCheckIcon from "../svgs/sealcheck";

const cards = [
  {
    title: "Ownership",
    description:
      "Holder keys prove identity, allowing only the owner to access their credentials.",
    icon: FingerprintIcon,
  },
  {
    title: "Verification",
    description:
      "Registry and IPFS content are matched, ensuring authenticity.",
    icon: ShieldIcon,
  },
  {
    title: "Trust",
    description:
      "Only approved universities and colleges can issue credentials.",
    icon: SealCheckIcon,
  },
];

export function Cards() {
  return (
    <section className="my-2 flex w-full flex-col items-center gap-4 px-3 py-4 sm:my-4 sm:gap-6 sm:px-4 sm:py-6 md:py-10">
      <h2 className="text-foreground max-w-2xl py-2 text-xl sm:py-4 sm:text-2xl md:text-3xl lg:text-4xl">
        Built for real-world credential trust
      </h2>

      <div className="grid w-full gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {cards.map(({ title, description, icon: Icon }) => (
          <article
            key={title}
            className="border-border bg-card cursor-default rounded-lg border p-4 shadow-sm transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-md sm:p-5 md:p-6"
          >
            <div className="mb-2 inline-flex items-center gap-2 sm:mb-3">
              <Icon />
              <h3 className="text-foreground text-sm font-semibold sm:text-base md:text-lg">
                {title}
              </h3>
            </div>

            <p className="text-muted-foreground mt-2 text-xs leading-relaxed sm:text-sm">
              {description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
