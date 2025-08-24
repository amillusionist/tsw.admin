import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/ui/card";
import { Users, Calendar, Star, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description, icon: Icon, trend }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && (
          <div className="flex items-center mt-2">
            {trend.isPositive ? (
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
            )}
            <span className={`text-xs ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {trend.value}% from last month
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const SectionCards = () => {
  const stats = [
    {
      title: "Total Users",
      value: "1,234",
      description: "Active users this month",
      icon: Users,
      trend: { value: 12, isPositive: true },
    },
    {
      title: "Total Bookings",
      value: "567",
      description: "Bookings this month",
      icon: Calendar,
      trend: { value: 8, isPositive: true },
    },
    {
      title: "Average Rating",
      value: "4.8",
      description: "Customer satisfaction",
      icon: Star,
      trend: { value: 2, isPositive: false },
    },
    {
      title: "Revenue",
      value: "$12,345",
      description: "Total revenue this month",
      icon: TrendingUp,
      trend: { value: 15, isPositive: true },
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};
