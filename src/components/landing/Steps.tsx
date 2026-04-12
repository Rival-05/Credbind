const steps = [
  {
    step: "1",
    title: "Fill Details",
    desc: "Enter recipient info, title, and date.",
  },
  {
    step: "2",
    title: "Generate & Sign",
    desc: "Your certificate is hashed and signed securely.",
  },
  {
    step: "3",
    title: "Store & Share",
    desc: "Stored on IPFS with a unique verification code.",
  },
];

export function Steps() {
  return (
    <div id="steps" className="mt-10 px-4 py-12 sm:px-6 sm:py-16">
      <h2 className="mb-10 text-center text-2xl font-semibold text-neutral-900 italic sm:mb-12 sm:text-3xl md:text-4xl">
        How Credbind works
      </h2>
      <div className="mx-auto grid max-w-6xl gap-8 sm:gap-10 md:grid-cols-3">
        {steps.map((item, idx) => (
          <div key={item.step} className="relative text-center">
            <div className="border-primary/20 bg-primary/10 text-primary mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border text-lg font-bold shadow-sm sm:h-16 sm:w-16 sm:text-xl">
              {item.step}
            </div>

            <h3 className="text-foreground mb-2 text-base font-semibold sm:text-lg md:text-xl">
              {item.title}
            </h3>

            <p className="text-muted-foreground text-sm sm:text-base">
              {item.desc}
            </p>

            {idx < 2 && (
              <svg
                className="text-border absolute top-7 -right-10 hidden md:block"
                width="80"
                height="20"
                viewBox="0 0 100 20"
              >
                <path
                  d="M0 10 Q50 0 100 10"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="4"
                />
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
