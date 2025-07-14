import {
  X,
  Calendar,
  MapPin,
  ExternalLink,
  Share2,
  MessageCircle,
  Mail,
  Copy,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

interface OpportunityDetailModalProps {
  opportunity: {
    id: string;
    title: string;
    category: string;
    deadline: string;
    location: string;
    description: string;
    applicationInstructions: string;
    applyUrl: string;
    source_url?: string;
    featured?: boolean;
    created_at?: string;
  };
  relatedOpportunities: Array<{
    id: string;
    title: string;
    category: string;
    deadline: string;
  }>;
  isOpen: boolean;
  onClose: () => void;
}

export const OpportunityDetailModal = ({
  opportunity,
  relatedOpportunities,
  isOpen,
  onClose,
}: OpportunityDetailModalProps) => {
  const [isClient, setIsClient] = useState(false);
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    setIsClient(true);
    calculateDaysLeft();
  }, [opportunity.deadline]);

  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    if (dateString === "Rolling" || dateString === "Ongoing") return "Rolling";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Rolling";
    }
  };

  const calculateDaysLeft = () => {
    if (
      opportunity.deadline === "Rolling" ||
      opportunity.deadline === "Ongoing"
    ) {
      setDaysLeft(null);
      return;
    }

    try {
      const deadline = new Date(opportunity.deadline);
      const now = new Date();
      const diffTime = deadline.getTime() - now.getTime();
      setDaysLeft(Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    } catch {
      setDaysLeft(null);
    }
  };

  const getDeadlineStatus = () => {
    if (daysLeft === null) return "Rolling Deadline";
    if (daysLeft <= 0) return "Deadline Passed";
    if (daysLeft <= 7)
      return `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`;
    return `Deadline: ${formatDate(opportunity.deadline)}`;
  };

  const getDeadlineColor = () => {
    if (daysLeft === null) return "bg-blue-100 text-blue-800";
    if (daysLeft <= 0) return "bg-gray-100 text-gray-800";
    if (daysLeft <= 7) return "bg-red-100 text-red-800";
    return "bg-green-100 text-green-800";
  };

  const handleShare = (platform: string) => {
    if (!isClient) return;

    const title = encodeURIComponent(opportunity.title);
    const url = encodeURIComponent(
      `${window.location.origin}/opportunities/${opportunity.id}`
    );

    switch (platform) {
      case "whatsapp":
        window.open(`https://wa.me/?text=${title} - ${url}`, "_blank");
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${title}&url=${url}`,
          "_blank"
        );
        break;
      case "email":
        window.open(
          `mailto:?subject=${title}&body=Check out this opportunity: ${url}`,
          "_blank"
        );
        break;
      case "copy":
        navigator.clipboard.writeText(
          `${window.location.origin}/opportunities/${opportunity.id}`
        );
        toast({
          title: "Link copied!",
          description:
            "The opportunity link has been copied to your clipboard.",
          variant: "default",
        });
        break;
    }
  };

  const handleApplyClick = () => {
    window.open(opportunity.applyUrl, "_blank");
    // Optional: Track application event
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-background rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-background border-b p-4 sm:p-6 flex items-start justify-between z-10">
          <div className="flex-1 pr-4">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {opportunity.category}
              </Badge>

              {opportunity.featured && (
                <Badge
                  variant="default"
                  className="bg-yellow-100 text-yellow-800 flex items-center"
                >
                  <Award className="h-3.5 w-3.5 mr-1" />
                  Featured
                </Badge>
              )}

              <Badge className={`${getDeadlineColor()} flex items-center`}>
                <Calendar className="h-3.5 w-3.5 mr-1" />
                {getDeadlineStatus()}
              </Badge>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              {opportunity.title}
            </h2>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4 sm:p-6">
          {/* Quick Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 p-4 bg-muted/30 rounded-lg border">
            <div className="flex items-start">
              <MapPin className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Location
                </p>
                <p className="font-medium">
                  {opportunity.location || "Remote"}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <Calendar className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Deadline
                </p>
                <p className="font-medium">
                  {formatDate(opportunity.deadline)}
                </p>
              </div>
            </div>

            {opportunity.source_url && (
              <div className="flex items-start sm:col-span-2">
                <ExternalLink className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Source
                  </p>
                  <a
                    href={opportunity.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-blue-600 hover:underline"
                  >
                    View original source
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">
              About This Opportunity
            </h3>
            <div className="prose prose-sm text-muted-foreground">
              {opportunity.description.split("\n").map((paragraph, i) => (
                <p key={i} className="mb-3 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Application Instructions */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">How to Apply</h3>
            <div className="prose prose-sm text-muted-foreground">
              {opportunity.applicationInstructions
                .split("\n")
                .map((paragraph, i) => (
                  <p key={i} className="mb-3 last:mb-0">
                    {paragraph}
                  </p>
                ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button
              size="lg"
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
              onClick={handleApplyClick}
            >
              <ExternalLink className="h-5 w-5 mr-2" />
              Apply Now
            </Button>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => handleShare("copy")}
                className="flex-1"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleShare("whatsapp")}
                  title="Share via WhatsApp"
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleShare("twitter")}
                  title="Share on Twitter"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleShare("email")}
                  title="Share via Email"
                >
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Related Opportunities */}
          {relatedOpportunities.length > 0 && (
            <div className="mt-10">
              <Separator className="mb-6" />

              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Related Opportunities
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {relatedOpportunities.map((related) => (
                    <Card
                      key={related.id}
                      className="hover:shadow-md transition-shadow cursor-pointer group"
                      onClick={() => {
                        // This would typically trigger a modal refresh
                        // For now, we'll just scroll to top
                        document
                          .querySelector(".sticky")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      <CardHeader className="pb-3">
                        <Badge variant="secondary" className="w-fit mb-2">
                          {related.category}
                        </Badge>
                        <CardTitle className="text-base group-hover:text-blue-600 transition-colors">
                          {related.title}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(related.deadline)}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
