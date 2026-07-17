export type Genre = { id: string; name: string };
export type Movie = {
  id: string;
  title: string;
  year: number;
  runtime: number;
  director: string;
  cast: string[];
  synopsis: string;
  genres: string[];
  rating: number;
  trailerUrl: string;
  releaseDate: string;
  featured?: boolean;
  trending?: boolean;
  comingSoon?: boolean;
};
export type User = {
  id: string;
  username: string;
  name: string;
  bio: string;
  avatar: string;
  favoriteGenres: string[];
  favoriteMovies: string[];
  ratedMovies: { movieId: string; rating: number }[];
  recentlyViewed: string[];
  stats: { reviews: number; comments: number; watched: number; hours: number };
};
export type Review = {
  id: string;
  userId: string;
  movieId: string;
  rating: number;
  title: string;
  body: string;
  likes: number;
  createdAt: string;
};
export type Comment = {
  id: string;
  reviewId: string;
  userId: string;
  body: string;
  createdAt: string;
};
export type Cinema = {
  id: string;
  name: string;
  city: string;
  address: string;
  rooms: number;
};
export type Session = {
  id: string;
  movieId: string;
  cinemaId: string;
  date: string;
  time: string;
  room: string;
  price: number;
};
export type Ticket = {
  id: string;
  userId: string;
  sessionId: string;
  seats: string[];
  total: number;
  status: "confirmed" | "pending";
};

export const genres: Genre[] = [
  { id: "g1", name: "Drama" },
  { id: "g2", name: "Sci-Fi" },
  { id: "g3", name: "Thriller" },
  { id: "g4", name: "Romance" },
  { id: "g5", name: "Action" },
  { id: "g6", name: "Documentary" },
  { id: "g7", name: "Animation" },
  { id: "g8", name: "Horror" },
  { id: "g9", name: "Comedy" },
  { id: "g10", name: "Mystery" },
];

export const movies: Movie[] = [
  { id: "m1", title: "Silent Horizon", year: 2024, runtime: 128, director: "Elena Vaux", cast: ["Ana Kerr", "Jonas Reid", "Mira Solveig"], synopsis: "A cartographer discovers a valley that erases sound, forcing her to confront the memory of a lost sister.", genres: ["Drama","Mystery"], rating: 4.6, trailerUrl: "#", releaseDate: "2024-09-14", featured: true, trending: true },
  { id: "m2", title: "Neon Cathedral", year: 2025, runtime: 142, director: "Kaito Mori", cast: ["Ruben Ito", "Sana Park"], synopsis: "In a rain-soaked megacity, an architect designs sanctuaries for people who no longer sleep.", genres: ["Sci-Fi","Drama"], rating: 4.8, trailerUrl: "#", releaseDate: "2025-01-10", featured: true, trending: true },
  { id: "m3", title: "The Last Ember", year: 2023, runtime: 116, director: "Aiden Rowe", cast: ["Nadia Faye", "Luc Barre"], synopsis: "A retired firefighter returns to a coastal town to rescue a legacy he never wanted.", genres: ["Drama","Thriller"], rating: 4.2, trailerUrl: "#", releaseDate: "2023-11-02", trending: true },
  { id: "m4", title: "Paper Astronauts", year: 2024, runtime: 98, director: "Iris Bloom", cast: ["Theo Han", "Milo Grey"], synopsis: "Two siblings turn their grandfather's attic into a mission to the moon.", genres: ["Drama","Animation"], rating: 4.4, trailerUrl: "#" , releaseDate: "2024-05-20", featured: true},
  { id: "m5", title: "Cold Signals", year: 2024, runtime: 121, director: "Marta Ilves", cast: ["Ben Hoyt", "Yuki Nara"], synopsis: "A radio operator in the Arctic intercepts a message from herself, twelve years in the future.", genres: ["Sci-Fi","Thriller"], rating: 4.5, trailerUrl: "#", releaseDate: "2024-08-01", trending: true },
  { id: "m6", title: "Gardens of Ash", year: 2022, runtime: 134, director: "Ravi Menon", cast: ["Ilse Kaur"], synopsis: "A landscape designer restores a burned estate and unearths its owners' secrets.", genres: ["Drama"], rating: 4.1, trailerUrl: "#", releaseDate: "2022-10-14" },
  { id: "m7", title: "Midnight Concierge", year: 2025, runtime: 104, director: "Sofía Vela", cast: ["Otis Lang", "Rina Ozawa"], synopsis: "The night shift at a boutique hotel becomes a stage for small, cinematic rescues.", genres: ["Comedy","Romance"], rating: 4.3, trailerUrl: "#", releaseDate: "2025-03-22", comingSoon: true },
  { id: "m8", title: "Voyager Nine", year: 2025, runtime: 152, director: "Kaito Mori", cast: ["Sana Park", "Devon Ash"], synopsis: "A generation ship reaches its destination and finds a message waiting.", genres: ["Sci-Fi"], rating: 4.7, trailerUrl: "#", releaseDate: "2025-06-13", comingSoon: true, featured: true },
  { id: "m9", title: "Blue Hour", year: 2025, runtime: 89, director: "Nora Beltran", cast: ["Cass West"], synopsis: "A documentary about the twenty minutes a day when everything looks like a memory.", genres: ["Documentary"], rating: 4.5, trailerUrl: "#", releaseDate: "2025-02-18", comingSoon: true },
  { id: "m10", title: "The Quiet Fold", year: 2024, runtime: 111, director: "Elena Vaux", cast: ["Ana Kerr"], synopsis: "A translator working on an impossible manuscript begins to hear it dream.", genres: ["Mystery","Drama"], rating: 4.6, trailerUrl: "#", releaseDate: "2024-12-01", trending: true },
  { id: "m11", title: "Northern Static", year: 2023, runtime: 127, director: "Petr Halas", cast: ["Ivo Marek", "Klara Novak"], synopsis: "Two rival meteorologists chase a storm that behaves like it's watching them back.", genres: ["Thriller","Sci-Fi"], rating: 4.0, trailerUrl: "#", releaseDate: "2023-04-04" },
  { id: "m12", title: "House of Small Hours", year: 2024, runtime: 96, director: "Lian Wu", cast: ["Mei Chen", "Aria Voss"], synopsis: "A pianist inherits a house whose rooms rearrange between rehearsals.", genres: ["Drama","Romance"], rating: 4.4, trailerUrl: "#", releaseDate: "2024-07-07" },
];

export const users: User[] = [
  { id: "u1", username: "A'D", name: "Alisson Denis", bio: "DevOps Engineer", avatar: "AL", favoriteGenres: ["Drama","Sci-Fi"], favoriteMovies: ["m1","m2","m10"], ratedMovies: [{movieId:"m1",rating:5},{movieId:"m2",rating:5},{movieId:"m5",rating:4}], recentlyViewed: ["m2","m8","m1","m10"], stats: { reviews: 42, comments: 128, watched: 316, hours: 612 } },
  { id: "u2", username: "M3N4", name: "Eduardo Mena", bio: "Otaku Master", avatar: "KM", favoriteGenres: ["Sci-Fi"], favoriteMovies: ["m2","m8"], ratedMovies: [{movieId:"m2",rating:5}], recentlyViewed: ["m2"], stats: { reviews: 9, comments: 22, watched: 84, hours: 190 } },
  { id: "u3", username: "Comboio", name: "Danilson Comboio", bio: "Pirate", avatar: "RF", favoriteGenres: ["Mystery","Drama"], favoriteMovies: ["m10","m1"], ratedMovies: [{movieId:"m10",rating:5}], recentlyViewed: ["m10","m1"], stats: { reviews: 61, comments: 204, watched: 402, hours: 780 } },
];

export const reviews: Review[] = [
  { id: "r1", userId: "u1", movieId: "m1", rating: 5, title: "A hush that lingers", body: "Vaux composes silence like an orchestra. Every frame breathes.", likes: 214, createdAt: "2024-10-02" },
  { id: "r2", userId: "u3", movieId: "m2", rating: 5, title: "The city as cathedral", body: "It's rare for a film to make me want to live in its architecture.", likes: 342, createdAt: "2025-01-14" },
  { id: "r3", userId: "u2", movieId: "m5", rating: 4, title: "Elegant, cold, precise", body: "A thriller that trusts you to keep up. The last twenty minutes are staggering.", likes: 128, createdAt: "2024-08-18" },
  { id: "r4", userId: "u1", movieId: "m10", rating: 5, title: "Translations of the invisible", body: "A quiet marvel. Deserves to be seen alone, twice.", likes: 189, createdAt: "2024-12-05" },
  { id: "r5", userId: "u3", movieId: "m4", rating: 4, title: "Tender and precise", body: "Bloom draws childhood without sentimentality.", likes: 76, createdAt: "2024-06-01" },
];

export const comments: Comment[] = [
  { id: "c1", reviewId: "r1", userId: "u2", body: "Agreed — the sound design is a character.", createdAt: "2024-10-03" },
  { id: "c2", reviewId: "r2", userId: "u1", body: "The rooftop sequence, my god.", createdAt: "2025-01-15" },
  { id: "c3", reviewId: "r2", userId: "u2", body: "Best film of the year already.", createdAt: "2025-01-16" },
];

export const cinemas: Cinema[] = [
  { id: "cn1", name: "Aurora Grand", city: "Lisbon", address: "Rua das Estrelas 12", rooms: 6 },
  { id: "cn2", name: "The Meridian", city: "Porto", address: "Av. do Norte 88", rooms: 4 },
  { id: "cn3", name: "Nocturne 21", city: "Coimbra", address: "Praça da Lua 3", rooms: 3 },
];

export const sessions: Session[] = [
  { id: "s1", movieId: "m1", cinemaId: "cn1", date: "2026-07-20", time: "19:30", room: "A", price: 9.5 },
  { id: "s2", movieId: "m1", cinemaId: "cn1", date: "2026-07-20", time: "22:00", room: "B", price: 9.5 },
  { id: "s3", movieId: "m2", cinemaId: "cn2", date: "2026-07-21", time: "20:00", room: "1", price: 11 },
  { id: "s4", movieId: "m5", cinemaId: "cn3", date: "2026-07-22", time: "18:00", room: "C", price: 8 },
  { id: "s5", movieId: "m10", cinemaId: "cn1", date: "2026-07-23", time: "21:15", room: "D", price: 10 },
];

export const tickets: Ticket[] = [
  { id: "t1", userId: "u1", sessionId: "s1", seats: ["F5","F6"], total: 19, status: "confirmed" },
  { id: "t2", userId: "u1", sessionId: "s3", seats: ["C10"], total: 11, status: "confirmed" },
];

export const featuredMovies = movies.filter(m => m.featured);
export const trendingMovies = movies.filter(m => m.trending);
export const comingSoon = movies.filter(m => m.comingSoon);

export const currentUser = users[0];

export const getMovie = (id: string) => movies.find(m => m.id === id);
export const getUser = (id: string) => users.find(u => u.id === id);
export const getCinema = (id: string) => cinemas.find(c => c.id === id);
export const getSession = (id: string) => sessions.find(s => s.id === id);
export const reviewsForMovie = (id: string) => reviews.filter(r => r.movieId === id);
export const commentsForReview = (id: string) => comments.filter(c => c.reviewId === id);
