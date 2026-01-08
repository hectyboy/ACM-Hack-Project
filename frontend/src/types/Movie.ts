export type Movie = {
  id: string; // MongoDB _id becomes a string
  title: string;
  category: string;
  year: string;
  posterUrl: string;
  trailerUrl: string;
  description: string;
  reviewInfo: string;
};
