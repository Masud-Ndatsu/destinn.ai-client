import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface DashboardCardProps {
  title: string;
  value: string;
  description: string;
  subtext: string;
  trend: "up" | "down";
  percentage: string;
}

export function DashboardCard({
  title,
  value,
  description,
  subtext,
  trend,
  percentage,
}: DashboardCardProps) {
  const TrendIcon = trend === "up" ? ArrowUpRight : ArrowDownRight;
  const trendColor = trend === "up" ? "text-green-600" : "text-red-600";

  return (
    <Card className="w-full rounded-none shadow-sm">
      <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`flex items-center text-xs ${trendColor}`}>
          <TrendIcon className="h-4 w-4 mr-1" />
          {percentage}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-sm mt-1 text-muted-foreground">{description}</p>
        <p className="text-xs text-muted-foreground">{subtext}</p>
      </CardContent>
    </Card>
  );
}
