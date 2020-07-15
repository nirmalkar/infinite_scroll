import { useEffect, useState } from "react";
import axios from "axios";

function useBookSearch(query, pageNumber) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [books, setBooks] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setBooks([]);
  }, [query]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;
    axios({
      method: "GET",
      url: "http://openlibrary.org/search.json",
      params: { q: query, page: pageNumber },
      cancelToken: new axios.CancelToken(function executor(c) {
        cancel = c;
      }),
    })
      .then((res) => {
        setBooks((prevBooks) => {
          console.log([
            ...prevBooks,
            ...res.data.docs.map((book) => book.title),
          ]);
          return [
            ...new Set([...prevBooks, ...res.data.docs.map((b) => b.title)]),
          ];
        });
        setHasMore(res.data.docs.length > 0);
        setLoading(false);
      })
      .catch((e) => {
        if (axios.isCancel(e)) {
        }
        // setError(true);
      });
    return () => cancel();
  }, [query, pageNumber]);
  return { loading, error, books, hasMore };
}

export default useBookSearch;
