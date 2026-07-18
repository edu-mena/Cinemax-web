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
  poster: string;
  trailer: string;
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
  { id: "m1", title: "2 Mundos", year: 2024, runtime: 100, director: "A definir", cast: [], synopsis: "Sinopse a adicionar.", genres: ["Drama"], rating: 4.0, trailerUrl: "#", trailer: "", releaseDate: "2024-01-01", poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRf5fFWQa2bG-g7mTlTv3TFi4JA76AIpo4TKfi76Xdhzg&s=10", featured: true, trending: true },
  { id: "m2", title: "Filhos do Sol", year: 2024, runtime: 100, director: "A definir", cast: [], synopsis: "Sinopse a adicionar.", genres: ["Drama"], rating: 4.0, trailerUrl: "#", trailer: "", releaseDate: "2024-01-01", poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuvQxPINlFXM4YC_Iln_DZicl5Nt5NXKEDjGcO9pzngg&s=10", featured: true, trending: true },
  { id: "m3", title: "Kwando", year: 2024, runtime: 100, director: "A definir", cast: [], synopsis: "Sinopse a adicionar.", genres: ["Drama"], rating: 4.0, trailerUrl: "#", trailer: "", releaseDate: "2024-01-01", poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDUTA-10VBQqrQvSuPBGqLf8KdazCBesuRfrAnHeT4yQ&s=10", trending: true },
  { id: "m4", title: "Quem é o Pai da Criança", year: 2024, runtime: 100, director: "A definir", cast: [], synopsis: "Sinopse a adicionar.", genres: ["Comedy"], rating: 4.0, trailerUrl: "#", trailer: "", releaseDate: "2024-01-01", poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjOHucn3HzykJuoYQJwF0clzJprJ5mjZT-Z6tvlHzJow&s=10", featured: true },
  { id: "m5", title: "Perverso", year: 2024, runtime: 100, director: "A definir", cast: [], synopsis: "Sinopse a adicionar.", genres: ["Thriller"], rating: 4.0, trailerUrl: "#", trailer: "", releaseDate: "2024-01-01", poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-e4Yd8SPuKP8d1wI3CXVXOriWFduRLuk7FQM_AT-Xfg&s=10", trending: true },
  { id: "m6", title: "Njinga", year: 2024, runtime: 100, director: "A definir", cast: [], synopsis: "Sinopse a adicionar.", genres: ["Drama"], rating: 4.0, trailerUrl: "#", trailer: "", releaseDate: "2024-01-01", poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLxC9W5qO8DQ82LU1F0xHQBjtQe0ZMRzkKaPOgUoldew&s=10", featured: true },
  { id: "m7", title: "Santana", year: 2024, runtime: 100, director: "A definir", cast: [], synopsis: "Sinopse a adicionar.", genres: ["Drama"], rating: 4.0, trailerUrl: "#", trailer: "", releaseDate: "2024-01-01", poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaVDc43jV-gYwCDaMm46Xl2Vd69K_G3xHyunCJh9Yc5w&s=10", comingSoon: true },
  { id: "m8", title: "O Emigrante", year: 2024, runtime: 100, director: "A definir", cast: [], synopsis: "Sinopse a adicionar.", genres: ["Drama"], rating: 4.0, trailerUrl: "#", trailer: "", releaseDate: "2024-01-01", poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrDgeTGvoe24IWuV9arXhNdFGe6DS3XPLcCOLJTFUfWw&s=10", comingSoon: true },
  { id: "m9", title: "Plano B", year: 2024, runtime: 100, director: "A definir", cast: [], synopsis: "Sinopse a adicionar.", genres: ["Comedy"], rating: 4.0, trailerUrl: "#", trailer: "", releaseDate: "2024-01-01", poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqkaMrAYkPOvHVjMp8qSSwW15vKbqg-GXjuNo4mjx1Og&s=10", comingSoon: true },
  { id: "m10", title: "Masturbação", year: 2024, runtime: 100, director: "A definir", cast: [], synopsis: "Sinopse a adicionar.", genres: ["Drama"], rating: 4.0, trailerUrl: "#", trailer: "", releaseDate: "2024-01-01", poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEYWbDLeV4C_m8Db0T1_vcRhnZSTKJ2TOmsApxEose6A&s=10", trending: true },
  { id: "m11", title: "Falso Perfil", year: 2024, runtime: 100, director: "A definir", cast: [], synopsis: "Sinopse a adicionar.", genres: ["Thriller"], rating: 4.0, trailerUrl: "#", trailer: "", releaseDate: "2024-01-01", poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiU3DTaUXlBGjaAsPo4xw3mPzu4naM_B8nj9Xzm3qHlg&s=10" },
  { id: "m12", title: "Contra Todos", year: 2024, runtime: 100, director: "A definir", cast: [], synopsis: "Sinopse a adicionar.", genres: ["Drama"], rating: 4.0, trailerUrl: "#", trailer: "", releaseDate: "2024-01-01", poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwPFg2RMhKoXDFtAIzgjEcANUsvXwHqiblxzEis3gJLw&s=10" },
  { id: "m13", title: "Moça", year: 2024, runtime: 100, director: "A definir", cast: [], synopsis: "Sinopse a adicionar.", genres: ["Drama"], rating: 4.0, trailerUrl: "#", trailer: "", releaseDate: "2024-01-01", poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtJ_JOeQ9rw69rylEG_RBuqZOACEIgKCfqjya5uihFEw&s=10" },
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
  { id: "cn1", name: "Cinemax do Kilamba", city: "Luanda", address: "Kilamba, Luanda", rooms: 6 },
];

export const sessions: Session[] = [
  { id: "s1", movieId: "m1", cinemaId: "cn1", date: "2026-07-20", time: "19:30", room: "A", price: 9.5 },
  { id: "s2", movieId: "m1", cinemaId: "cn1", date: "2026-07-20", time: "22:00", room: "B", price: 9.5 },
  { id: "s3", movieId: "m2", cinemaId: "cn1", date: "2026-07-21", time: "20:00", room: "1", price: 11 },
  { id: "s4", movieId: "m5", cinemaId: "cn1", date: "2026-07-22", time: "18:00", room: "C", price: 8 },
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