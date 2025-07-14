"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  DollarSign,
  GraduationCap,
  Briefcase,
  Award,
} from "lucide-react";
import Link from "next/link";

const opportunities = [
  {
    id: 1,
    title: "Google Summer of Code 2024",
    type: "Internship",
    category: "Technology",
    deadline: "March 15, 2024",
    location: "Remote",
    amount: "$6,000",
    icon: Briefcase,
    description:
      "Contribute to open source projects while getting mentored by industry experts.",
    tags: ["Programming", "Open Source", "Mentorship"],
  },
  {
    id: 2,
    title: "Rhodes Scholarship",
    type: "Scholarship",
    category: "Education",
    deadline: "October 1, 2024",
    location: "Oxford, UK",
    amount: "Full Funding",
    icon: GraduationCap,
    description:
      "Prestigious scholarship for outstanding students to study at the University of Oxford.",
    tags: ["Graduate Study", "Leadership", "International"],
  },
  {
    id: 3,
    title: "NASA Space Grant",
    type: "Grant",
    category: "STEM",
    deadline: "February 28, 2024",
    location: "USA",
    amount: "$15,000",
    icon: Award,
    description:
      "Support for students pursuing space-related research and career paths.",
    tags: ["Space", "Research", "STEM"],
  },
  {
    id: 4,
    title: "Y Combinator Startup School",
    type: "Program",
    category: "Entrepreneurship",
    deadline: "Rolling",
    location: "Remote",
    amount: "Free",
    icon: Briefcase,
    description:
      "Free online course for entrepreneurs looking to start a company.",
    tags: ["Startup", "Business", "Entrepreneurship"],
  },
];

export const FeaturedOpportunities = () => {
  return (
    <section id="opportunities" className="py-24 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Featured Opportunities
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover hand-picked opportunities that could change your career
            trajectory
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {opportunities.map((opportunity, index) => {
            const IconComponent = opportunity.icon;
            return (
              <Card
                key={opportunity.id}
                className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 shadow-lg animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
                        <IconComponent className="h-6 w-6 text-blue-600" />
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-blue-50 text-blue-700"
                      >
                        {opportunity.type}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-card-foreground group-hover:text-blue-600 transition-colors">
                    {opportunity.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {opportunity.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {opportunity.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center dark:text-gray-300">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground " />
                      Deadline: {opportunity.deadline}
                    </div>
                    <div className="flex items-center dark:text-gray-300">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      {opportunity.location}
                    </div>
                    <div className="flex items-center dark:text-gray-300">
                      <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                      {opportunity.amount}
                    </div>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-[#3498db]/100 hover:from-blue-700 hover:to-[#3498db]/700 text-white">
                    Learn More
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300"
            asChild
          >
            <Link href="/opportunities">View All Opportunities</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
