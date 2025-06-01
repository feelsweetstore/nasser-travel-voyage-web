
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MessageSquare } from 'lucide-react';

interface AdminReviewsProps {
  reviews: any[];
  onViewReview: (review: any) => void;
  onPublishReview: (id: number, shouldPublish: boolean) => void;
}

const AdminReviews: React.FC<AdminReviewsProps> = ({
  reviews,
  onViewReview,
  onPublishReview
}) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <span key={index} className={index < rating ? "text-yellow-500" : "text-gray-300"}>★</span>
    ));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Avis clients</CardTitle>
          <CardDescription>
            Gérez les avis clients laissés sur le site
          </CardDescription>
        </div>
        <p className="text-sm text-muted-foreground">
          {reviews.filter(r => r.published).length} avis publiés / {reviews.length} total
        </p>
      </CardHeader>
      <CardContent>
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>Aucun avis client pour le moment</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>{review.id}</TableCell>
                  <TableCell>{review.name}</TableCell>
                  <TableCell>{review.email}</TableCell>
                  <TableCell>
                    <div className="flex">{renderStars(review.rating)}</div>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">{review.message}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      review.published ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}>
                      {review.published ? "Publié" : "Non publié"}
                    </span>
                  </TableCell>
                  <TableCell className="space-x-2">
                    <button 
                      className="text-sm text-blue-600 hover:underline"
                      onClick={() => onViewReview(review)}
                    >
                      Voir
                    </button>
                    <button 
                      className="text-sm text-green-600 hover:underline ml-2"
                      onClick={() => onPublishReview(review.id, !review.published)}
                    >
                      {review.published ? "Masquer" : "Publier"}
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminReviews;
