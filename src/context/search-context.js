import React, { useState } from 'react';

// query is the state
// SearchHandler is a function for changing the state.
export const SearchContext = React.createContext({
  query: '',
  searchHandler: () => {},
});

// Defining a simple HOC component
const SearchContextProvider = (props) => {
  const [query, setQuery] = useState('');
  const [searchArray, setSearchArray] = useState([]);
  const [loading, setLoading] = useState('false');
  const [orFunctionality, setOrFunctionality] = useState(false);

  const searchHandler = (query) => {
    setQuery(query);
  };

  const searchArrayHandler = (query) => {
    searchArray.push(query);
    setSearchArray(searchArray);
  };

  const loadingHandler = (item) => {
    setLoading(item);
  };

  const orHandler = (item) => {
    setOrFunctionality(item);
  };

  return (
    <SearchContext.Provider
      value={{
        query: query,
        searchHandler: searchHandler,
        searchArray: searchArray,
        searchArrayHandler: searchArrayHandler,
        loading: loading,
        loadingHandler: loadingHandler,
        orFunctionality: orFunctionality,
        orHandler: orHandler,
      }}
    >
      {props.children}
    </SearchContext.Provider>
  );
};

export default SearchContextProvider;
