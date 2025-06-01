
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AdminStatsProps {
  stats: {
    visits: number;
    pageViews: number;
    bookings: number;
    topPage: string;
    conversionRate: string;
    growth: string;
  };
}

const AdminStats: React.FC<AdminStatsProps> = ({ stats }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistiques du site</CardTitle>
        <CardDescription>
          Performances et analytiques
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-lg">Visites</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 p-4">
              <p className="text-3xl font-bold">{stats.visits}</p>
              <p className="text-sm text-gray-500">{stats.growth}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-lg">Pages vues</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 p-4">
              <p className="text-3xl font-bold">{stats.pageViews}</p>
              <p className="text-sm text-gray-500">Page la plus visitée: {stats.topPage}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-lg">Réservations</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 p-4">
              <p className="text-3xl font-bold">{stats.bookings}</p>
              <p className="text-sm text-gray-500">Taux de conversion: {stats.conversionRate}</p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

interface CardDescriptionProps {
  children: React.ReactNode;
}

const CardDescription: React.FC<CardDescriptionProps> = ({ children }) => {
  return <p className="text-sm text-muted-foreground">{children}</p>;
};

export default AdminStats;
