
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import ReviewForm from '../components/testimonials/ReviewForm';
import ReviewService from '../services/ReviewService';

const Testimonials = () => {
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    // Charger uniquement les avis publiés
    const publishedReviews = ReviewService.getPublishedReviews();
    setReviews(publishedReviews);
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <span key={index} className={index < rating ? "text-yellow-500" : "text-gray-300"}>★</span>
    ));
  };

  return (
    <main className="bg-white py-10">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">Témoignages clients</h1>
          <p className="text-gray-600">Découvrez ce que nos clients disent de nos services</p>
        </div>

        {/* Liste des témoignages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <Card key={review.id} className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {renderStars(review.rating)}
                  </div>
                  <p className="italic mb-4">"{review.message}"</p>
                  <div className="mt-auto pt-4 border-t">
                    <p className="font-medium">{review.name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="md:col-span-2 lg:col-span-3 text-center py-12">
              <p className="text-gray-500">Aucun témoignage pour le moment. Soyez le premier à partager votre expérience !</p>
            </div>
          )}
        </div>

        {/* Formulaire d'ajout de témoignage */}
        <ReviewForm />
      </div>
    </main>
  );
};

export default Testimonials;
