import { Globe, Lock, Zap } from "lucide-react";

const cards = [
  {
    title: "Tamper-Proof",
    description: "Certificates are stored securely on decentralized IPFS.",
    icon: Lock,
    iconColor: "text-cyan-600/80",
    cardColor: "bg-cyan-900/10",
    iconBg: "bg-cyan-900/30",
    titleColor: "text-cyan-300/90",
  },
  {
    title: "Instant Verification",
    description: "Verify authenticity in seconds from anywhere.",
    icon: Zap,
    iconColor: "text-green-600/80",
    cardColor: "bg-green-900/10",
    iconBg: "bg-green-900/30",
    titleColor: "text-green-300/90",
  },
  {
    title: "Accessible Anywhere",
    description: "Works globally without any central authority.",
    icon: Globe,
    iconColor: "text-yellow-600/80",
    cardColor: "bg-yellow-900/10",
    iconBg: "bg-yellow-900/30",
    titleColor: "text-yellow-300/90",
  },
];

export function Cards() {
  return (
    <div className="grid gap-6 px-4 py-8 sm:gap-8 md:grid-cols-3 md:gap-10">
      {cards.map(
        ({
          title,
          description,
          icon: Icon,
          iconColor,
          cardColor,
          iconBg,
          titleColor,
        }) => (
          <div key={title} className={`rounded-md ${cardColor} p-6`}>
            <div className="mb-4 flex items-center gap-2">
              <div className={`rounded-md ${iconBg} p-2`}>
                <Icon className={`h-5 w-5 ${iconColor}`} />
              </div>
              <h3 className={`text-lg font-medium ${titleColor}`}>{title}</h3>
            </div>
            <p className="text-sm text-neutral-500 sm:text-base">
              {description}
            </p>
          </div>
        ),
      )}
    </div>
  );
}
