import React, { useState, useRef, useCallback } from "react";
import useBookSearch from "./hooks/useBookSearch";

const App = () => {
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const handleSearch = (query) => {
    setQuery(query);
    setPageNumber(1);
  };
  const { loading, error, books, hasMore } = useBookSearch(query, pageNumber);

  const observer = useRef();
  const lestBookElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((previousPageNumber) => previousPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <div>
      <input
        value={query}
        type="text"
        onChange={(e) => handleSearch(e.target.value)}
      />
      {books.map((book, i) => {
        if (books.length === i + 1) {
          return (
            <div key={book} ref={lestBookElementRef}>
              {book}
            </div>
          );
        } else {
          return <div key={book}>{book}</div>;
        }
      })}
      <div>{loading ? "Loading..." : ""}</div>
      <div>{error ? "Error" : ""}</div>
    </div>
  );
};

export default App;
