import { Calendar, MapPin, DollarSign, ExternalLink } from "lucide-react";
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
    id: number;
    title: string;
    type: string;
    category: string;
    deadline: string;
    location: string;
    amount: string;
    description: string;
    tags: string[];
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
    if (dateString === "Rolling") return "Rolling";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isDeadlineSoon = (dateString: string) => {
    if (dateString === "Rolling") return false;
    const deadline = new Date(dateString);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  if (viewMode === "list") {
    return (
      <Card className="hover:shadow-lg transition-all duration-300">
        <div className="flex">
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    variant="secondary"
                    className="bg-blue-50 text-blue-700"
                  >
                    {opportunity.type}
                  </Badge>
                  {opportunity.featured && (
                    <Badge
                      variant="default"
                      className="bg-yellow-100 text-yellow-800"
                    >
                      Featured
                    </Badge>
                  )}
                  {isDeadlineSoon(opportunity.deadline) && (
                    <Badge variant="destructive">Deadline Soon</Badge>
                  )}
                </div>
                <CardTitle
                  className="text-xl mb-2 hover:text-blue-600 cursor-pointer"
                  onClick={onClick}
                >
                  {opportunity.title}
                </CardTitle>
                <CardDescription className="mb-4 line-clamp-2">
                  {opportunity.description}
                </CardDescription>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(opportunity.deadline)}
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {opportunity.location}
              </div>
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-1" />
                {opportunity.amount}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {opportunity.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-center p-6 border-l">
            <Button onClick={onClick} className="mb-2 w-32">
              View Details
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="bg-blue-50 text-blue-700">
            {opportunity.type}
          </Badge>
          {opportunity.featured && (
            <Badge variant="default" className="bg-yellow-100 text-yellow-800">
              Featured
            </Badge>
          )}
        </div>
        {isDeadlineSoon(opportunity.deadline) && (
          <Badge variant="destructive" className="w-fit mb-2">
            Deadline Soon
          </Badge>
        )}
        <CardTitle
          className="text-xl group-hover:text-blue-600 transition-colors cursor-pointer"
          onClick={onClick}
        >
          {opportunity.title}
        </CardTitle>
        <CardDescription className="line-clamp-3">
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
            <Calendar className="h-4 w-4 mr-2" />
            Deadline: {formatDate(opportunity.deadline)}
          </div>
          <div className="flex items-center dark:text-gray-300">
            <MapPin className="h-4 w-4 mr-2" />
            {opportunity.location}
          </div>
          <div className="flex items-center dark:text-gray-300">
            <DollarSign className="h-4 w-4 mr-2" />
            {opportunity.amount}
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button onClick={onClick} className="w-full">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};
