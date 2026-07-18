// fetch-posters.mjs
// Uso: TMDB_API_KEY=xxxxx node fetch-posters.mjs
//
// Precisas de uma "API Read Access Token" (v4 auth) ou API Key (v3) do TMDB:
// https://www.themoviedb.org/settings/api  (é grátis, aprovação instantânea)
//
// O script pesquisa cada filme por título (em inglês, quando é o título original
// do filme real) + ano, e escreve um ficheiro poster-results.json com:
//   { id, title, found: true/false, poster, tmdbId, tmdbTitle }
// Também imprime no terminal um bloco pronto a colar, tipo:
//   m18: "https://image.tmdb.org/t/p/w500/xxxxx.jpg"

const API_KEY = process.env.TMDB_API_KEY;
if (!API_KEY) {
  console.error("Falta a variável de ambiente TMDB_API_KEY.");
  console.error("Uso: TMDB_API_KEY=xxxxx node fetch-posters.mjs");
  process.exit(1);
}

// título usado na pesquisa (título original/inglês, mais fiável no TMDB) + ano
const movies = [
  { id: "m16", title: "Left for Dead: The Ashley Reeves Story", year: 2021 },
  { id: "m17", title: "Iron Lung", year: null }, // pode não existir como filme (é um jogo)
  { id: "m18", title: "The Island", year: 2005 },
  { id: "m19", title: "The Truman Show", year: 1998 },
  { id: "m20", title: "The Matrix", year: 1999 },
  { id: "m21", title: "Fight Club", year: 1999 },
  { id: "m22", title: "V for Vendetta", year: 2005 },
  { id: "m23", title: "In Time", year: 2011 },
  { id: "m24", title: "Real Steel", year: 2011 },
  { id: "m25", title: "Eyes Wide Shut", year: 1999 },
  { id: "m26", title: "Pelé: Birth of a Legend", year: 2016 },
  { id: "m27", title: "Inception", year: 2010 },
  { id: "m28", title: "Parasite", year: 2019 },
  { id: "m29", title: "The Godfather", year: 1972 },
  { id: "m30", title: "Interstellar", year: 2014 },
  { id: "m31", title: "Avengers: Endgame", year: 2019 },
  { id: "m32", title: "Spirited Away", year: 2001 },
  { id: "m33", title: "Get Out", year: 2017 },
  { id: "m34", title: "The Hangover", year: 2009 },
  { id: "m35", title: "Se7en", year: 1995 },
  { id: "m36", title: "The Social Dilemma", year: 2020 },
  { id: "m37", title: "Spider-Man: Into the Spider-Verse", year: 2018 },
  { id: "m38", title: "La La Land", year: 2016 },
  { id: "m39", title: "The Silence of the Lambs", year: 1991 },
  { id: "m40", title: "Titanic", year: 1997 },
  { id: "m41", title: "Gladiator", year: 2000 },
  { id: "m42", title: "Joker", year: 2019 },
  { id: "m43", title: "The Passion of the Christ", year: 2004 },
  { id: "m44", title: "The Lord of the Rings: The Return of the King", year: 2003 },
  { id: "m45", title: "Toy Story", year: 1995 },
  { id: "m46", title: "Hereditary", year: 2018 },
  { id: "m47", title: "Mad Max: Fury Road", year: 2015 },
  { id: "m48", title: "March of the Penguins", year: 2005 },
  { id: "m49", title: "Pulp Fiction", year: 1994 },
  { id: "m50", title: "Up", year: 2009 },
  { id: "m51", title: "The Wolf of Wall Street", year: 2013 },
  { id: "m52", title: "Whiplash", year: 2014 },
  { id: "m53", title: "A Quiet Place", year: 2018 },
  { id: "m54", title: "Before Sunrise", year: 1995 },
  { id: "m55", title: "Memento", year: 2000 },
  { id: "m56", title: "The Departed", year: 2006 },
  { id: "m57", title: "The Matrix Reloaded", year: 2003 },
  { id: "m58", title: "WALL·E", year: 2008 },
  { id: "m59", title: "City of God", year: 2002 },
  { id: "m60", title: "The Shining", year: 1980 },
  { id: "m61", title: "Superbad", year: 2007 },
  { id: "m62", title: "Jaws", year: 1975 },
  { id: "m63", title: "Icarus", year: 2017 },
  { id: "m64", title: "The Good, the Bad and the Ugly", year: 1966 },
  { id: "m65", title: "The Sixth Sense", year: 1999 },
  { id: "m66", title: "The Lion King", year: 1994 },
  { id: "m67", title: "Casablanca", year: 1942 },
  { id: "m68", title: "Django Unchained", year: 2012 },
  { id: "m69", title: "Zootopia", year: 2016 },
  { id: "m70", title: "Avengers: Infinity War", year: 2018 },
  { id: "m71", title: "Groundhog Day", year: 1993 },
  { id: "m72", title: "Ex Machina", year: 2014 },
  { id: "m73", title: "Free Solo", year: 2018 },
  { id: "m74", title: "Psycho", year: 1960 },
  { id: "m75", title: "Spider-Man", year: 2002 },
  { id: "m76", title: "The Shape of Water", year: 2017 },
];

const isBearer = API_KEY.startsWith("eyJ"); // tokens v4 costumam ser JWT

async function searchMovie({ title, year }) {
  const params = new URLSearchParams({
    query: title,
    include_adult: "false",
    language: "en-US",
  });
  if (year) params.set("year", String(year));
  if (!isBearer) params.set("api_key", API_KEY);

  const url = `https://api.themoviedb.org/3/search/movie?${params.toString()}`;
  const res = await fetch(url, {
    headers: isBearer ? { Authorization: `Bearer ${API_KEY}` } : {},
  });
  if (!res.ok) throw new Error(`TMDB error ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.results?.[0] ?? null;
}

const results = [];

for (const movie of movies) {
  try {
    const match = await searchMovie(movie);
    if (match && match.poster_path) {
      results.push({
        id: movie.id,
        title: movie.title,
        found: true,
        poster: `https://image.tmdb.org/t/p/w500${match.poster_path}`,
        tmdbId: match.id,
        tmdbTitle: match.title,
      });
    } else {
      results.push({ id: movie.id, title: movie.title, found: false });
    }
  } catch (err) {
    results.push({ id: movie.id, title: movie.title, found: false, error: String(err) });
  }
  // pequena pausa para não bater no rate limit
  await new Promise((r) => setTimeout(r, 150));
}

const fs = await import("node:fs/promises");
await fs.writeFile("poster-results.json", JSON.stringify(results, null, 2));

console.log("\n--- Resultado (copia isto e envia de volta) ---\n");
for (const r of results) {
  if (r.found) {
    console.log(`${r.id}: "${r.poster}"  // ${r.tmdbTitle}`);
  } else {
    console.log(`${r.id}: NÃO ENCONTRADO  // ${r.title}${r.error ? " — erro: " + r.error : ""}`);
  }
}
console.log("\n--- Fim. Também gravei tudo em poster-results.json ---");
