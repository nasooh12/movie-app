// src/api/tmdb.ts
import axios from "axios";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY as string;

if (!TMDB_API_KEY) {
  console.warn(
    "[TMDB] VITE_TMDB_API_KEY가 설정되지 않았습니다. .env 파일을 확인해주세요."
  );
}

export type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
};

type TMDBListResponse = {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
};

const tmdbClient = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    language: "ko-KR",
  },
});

async function getMovieList(path: string, page = 1): Promise<TMDBListResponse> {
  const res = await tmdbClient.get<TMDBListResponse>(path, {
    params: {
      api_key: TMDB_API_KEY,
      page,
    },
  });
  return res.data;
}

export function getPopularMovies(page = 1) {
  return getMovieList("/movie/popular", page);
}

export function getNowPlayingMovies(page = 1) {
  return getMovieList("/movie/now_playing", page);
}

export function getTopRatedMovies(page = 1) {
  return getMovieList("/movie/top_rated", page);
}

export function getUpcomingMovies(page = 1) {
  return getMovieList("/movie/upcoming", page);
}

/**
 * 영화 검색
 * @param query 검색어
 * @param page  페이지 번호 (기본값 1)
 */
export async function searchMovies(query: string, page = 1) {
  const trimmed = query.trim();
  if (!trimmed) {
    // 검색어가 비어 있으면 API 호출하지 않고 빈 결과 반환
    return {
      page: 1,
      total_pages: 1,
      results: [] as Movie[],
      total_results: 0,
    };
  }

  const res = await tmdbClient.get<TMDBListResponse>("/search/movie", {
    params: {
      api_key: TMDB_API_KEY,
      query: trimmed,
      page,
      include_adult: false,
    },
  });

  return res.data;
}
