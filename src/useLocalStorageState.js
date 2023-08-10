import { useEffect, useState } from "react";

export function useLocalStorageState(initialState, key) {
  //  const [watched, setWatched] = useState([]);

  //   lower code is to fetch data from the local storage that we saved earlier
  const [value, setValue] = useState(function () {
    const storedValue = localStorage.getItem(key); // getting from local storage on initial render
    return storedValue ? JSON.parse(storedValue) : initialState;
  });

  useEffect(
    // storing data to local storage (in browser)
    function () {
      localStorage.setItem(key, JSON.stringify(value));
    },
    [value, key]
  );
  return [value, setValue];
}
