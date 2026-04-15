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
    <section className="flex w-full flex-col items-center gap-4 px-4 py-8">
      <h2 className="py-4 text-2xl text-neutral-900 sm:text-3xl md:text-4xl">
        Built for real-world credential trust
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ title, description, icon: Icon }) => (
          <article
            key={title}
            className="border-border bg-card cursor-default rounded-lg border p-5 shadow-sm transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="mb-2 inline-flex items-center gap-2">
              <Icon />
              <h3 className="text-foreground text-base font-semibold sm:text-lg">
                {title}
              </h3>
            </div>

            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              {description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
