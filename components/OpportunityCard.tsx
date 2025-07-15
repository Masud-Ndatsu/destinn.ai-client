import {
  Calendar,
  MapPin,
  DollarSign,
  ExternalLink,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface OpportunityCardProps {
  opportunity: {
    id: string;
    title: string;
    category: string;
    deadline: string;
    location: string;
    description: string;
    application_url: string;
    created_at: string;
    source_url?: string;
    featured?: boolean;
  };
  viewMode: "grid" | "list";
  onClick: () => void;
}

export const OpportunityCard = ({
  opportunity,
  viewMode,
  onClick,
}: OpportunityCardProps) => {
  const formatDate = (dateString: string) => {
    if (dateString === "Rolling" || dateString === "Ongoing") return "Rolling";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Rolling";
    }
  };

  const isDeadlineSoon = (dateString: string) => {
    if (dateString === "Rolling" || dateString === "Ongoing") return false;
    try {
      const deadline = new Date(dateString);
      const now = new Date();
      const diffTime = deadline.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 30 && diffDays > 0;
    } catch {
      return false;
    }
  };

  const daysUntilDeadline = (dateString: string) => {
    if (dateString === "Rolling" || dateString === "Ongoing") return null;
    try {
      const deadline = new Date(dateString);
      const now = new Date();
      const diffTime = deadline.getTime() - now.getTime();
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } catch {
      return null;
    }
  };

  const deadlineDays = daysUntilDeadline(opportunity.deadline);
  const deadlineSoon = isDeadlineSoon(opportunity.deadline);

  // Handle cases where location might be empty
  const location = opportunity.location || "Remote";

  // Truncate long descriptions
  const truncateDescription = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  if (viewMode === "list") {
    return (
      <Card className="hover:shadow-lg transition-all duration-300 group w-full">
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800"
                  >
                    {opportunity.category}
                  </Badge>
                  {opportunity.featured && (
                    <Badge
                      variant="default"
                      className="bg-yellow-100 text-yellow-800 flex items-center"
                    >
                      <Award className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                  {deadlineSoon && (
                    <Badge variant="destructive" className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {deadlineDays
                        ? `${deadlineDays} days left`
                        : "Deadline Soon"}
                    </Badge>
                  )}
                </div>
                <CardTitle
                  className="text-xl mb-2 group-hover:text-primary transition-colors cursor-pointer"
                  onClick={onClick}
                >
                  {opportunity.title}
                </CardTitle>
                <CardDescription className="mb-4 line-clamp-2">
                  {truncateDescription(opportunity.description, 120)}
                </CardDescription>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {opportunity.deadline === "Rolling"
                  ? "Rolling Deadline"
                  : `Deadline: ${formatDate(opportunity.deadline)}`}
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {location}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center p-6 border-t md:border-t-0 md:border-l gap-3">
            <Button
              onClick={onClick}
              variant="outline"
              className="w-full md:w-32"
            >
              Details
            </Button>
            {opportunity.application_url && (
              <Button asChild variant="secondary" className="w-full md:w-32">
                <a
                  href={opportunity.application_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  Apply <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="group h-full flex flex-col hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {opportunity.category}
          </Badge>
          {opportunity.featured && (
            <Badge
              variant="default"
              className="bg-yellow-100 text-yellow-800 flex items-center"
            >
              <Award className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          )}
          {deadlineSoon && (
            <Badge variant="destructive" className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {deadlineDays ? `${deadlineDays}d` : "Soon"}
            </Badge>
          )}
        </div>
        <CardTitle
          className="text-xl group-hover:text-primary transition-colors cursor-pointer"
          onClick={onClick}
        >
          {opportunity.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-grow">
        <CardDescription className="mb-4 line-clamp-3">
          {truncateDescription(opportunity.description, 150)}
        </CardDescription>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>
              {opportunity.deadline === "Rolling"
                ? "Rolling Deadline"
                : `Deadline: ${formatDate(opportunity.deadline)}`}
            </span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{location}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-2">
        <Button onClick={onClick} className="w-full">
          View Details
        </Button>
        {opportunity.application_url && (
          <Button asChild variant="secondary" className="w-full">
            <a
              href={opportunity.application_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              Apply Now <ExternalLink className="h-4 w-4 ml-1" />
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
