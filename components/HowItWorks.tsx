import { Search, Target, Send, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Browse & Discover",
    description:
      "Explore thousands of opportunities across scholarships, internships, jobs, and programs tailored to your interests.",
  },
  {
    icon: Target,
    title: "Get AI Matches",
    description:
      "Our intelligent AI analyzes your profile and preferences to recommend the most relevant opportunities for you.",
  },
  {
    icon: Send,
    title: "Apply with Confidence",
    description:
      "Get personalized guidance on applications, essays, and interviews to maximize your chances of success.",
  },
  {
    icon: TrendingUp,
    title: "Track & Grow",
    description:
      "Monitor your applications and continue discovering new opportunities as you advance in your career journey.",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-24 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Four simple steps to unlock your potential and discover
            life-changing opportunities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div
                key={index}
                className="text-center group animate-fade-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="relative mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-[#3498db]/100 text-primary-foreground group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
