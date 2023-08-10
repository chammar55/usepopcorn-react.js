// Custom hook
// Rule: custom hook must have atleat one react hook otherwise its a simple function

import { useEffect, useState } from "react";

const key = "6ce95c0e";

export function useMovies(query, callback) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      const controller = new AbortController(); // ths is to cancel the extra http request that slow down our app (Remember its not a part of react but browser)

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError(""); // reseting error
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${key}&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok)
            throw new Error("Something went wrong with fetching movies");

          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found"); // If user enter wrong name of movie and response from API is false

          setMovies(data.Search);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            console.log(err.message);
            setError(err.message);
          }
        } finally {
          // this part alway run
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        // we have to write more then 3 letters in search bar for result
        setMovies([]);
        setError("");
        return;
      }

      callback?.();

      //   handleCloseMovie(); // it is closing the previous search movie when we search for new one
      fetchMovies();
      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return { movies, isLoading, error };
}
