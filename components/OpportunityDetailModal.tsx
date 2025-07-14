import {
  X,
  Calendar,
  MapPin,
  DollarSign,
  ExternalLink,
  Share2,
  MessageCircle,
  Mail,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

interface OpportunityDetailModalProps {
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
    applicationInstructions: string;
    applyUrl: string;
    featured?: boolean;
  };
  relatedOpportunities: Array<{
    id: number;
    title: string;
    type: string;
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
  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    if (dateString === "Rolling") return "Rolling";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const shareUrl = `${window.location.origin}/opportunities/${opportunity.id}`;

  const handleShare = (platform: string) => {
    const title = encodeURIComponent(opportunity.title);
    const url = encodeURIComponent(shareUrl);

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
        navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link copied!",
          description:
            "The opportunity link has been copied to your clipboard.",
        });
        break;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b p-6 flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="bg-blue-50 text-blue-700">
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
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              {opportunity.title}
            </h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6">
          {/* Quick Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center ">
              <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
              <div>
                <p className="font-medium dark:text-gray-300">Deadline</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(opportunity.deadline)}
                </p>
              </div>
            </div>
            <div className="flex items-center dark:text-gray-300">
              <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
              <div>
                <p className="font-medium dark:text-gray-300">Location</p>
                <p className="text-sm text-muted-foreground">
                  {opportunity.location}
                </p>
              </div>
            </div>
            <div className="flex items-center ">
              <DollarSign className="h-5 w-5 mr-2 text-muted-foreground" />
              <div>
                <p className="font-medium dark:text-gray-300">Amount</p>
                <p className="text-sm text-muted-foreground">
                  {opportunity.amount}
                </p>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {opportunity.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 dark:text-gray-300">
              About This Opportunity
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {opportunity.description}
            </p>
          </div>

          {/* Application Instructions */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 dark:text-gray-300">
              How to Apply
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {opportunity.applicationInstructions}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button
              size="lg"
              className="flex-1 bg-gradient-to-r from-blue-600 to-[#3498db]/100 hover:from-blue-700 hover:to-[#3498db]/700"
              onClick={() => window.open(opportunity.applyUrl, "_blank")}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Apply Now
            </Button>

            {/* Share Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleShare("whatsapp")}
                className="flex-1 sm:flex-none dark:text-gray-300"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
              <Button
                variant="outline"
                onClick={() => handleShare("twitter")}
                className="flex-1 sm:flex-none dark:text-gray-300"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Twitter
              </Button>
              <Button
                variant="outline"
                onClick={() => handleShare("email")}
                className="flex-1 sm:flex-none "
              >
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
              <Button
                variant="outline"
                onClick={() => handleShare("copy")}
                className="flex-1 sm:flex-none dark:text-gray-300"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
            </div>
          </div>

          {/* Related Opportunities */}
          {relatedOpportunities.length > 0 && (
            <>
              <Separator className="mb-6" />
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Related Opportunities
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {relatedOpportunities.map((related) => (
                    <Card
                      key={related.id}
                      className="hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <CardHeader className="pb-2">
                        <Badge variant="secondary" className="w-fit mb-2">
                          {related.type}
                        </Badge>
                        <CardTitle className="text-sm">
                          {related.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground">
                          Deadline: {formatDate(related.deadline)}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
