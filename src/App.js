import React, { useState } from "react";
import "./themes/original.scss";

import Search from "./components/Search/Search";
import IssuesContainer from "./containers/IssuesContainer";

const App = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [activeSearch, setActiveSearch] = useState(true);
  return (
    <div className="App">
      <Search
        dataCallback={setSearchResults}
        activeSearch={activeSearch}
        setActiveSearch={setActiveSearch}
      />
      <IssuesContainer
        issues={searchResults}
        reset={() => {
          setSearchResults([]);
          setActiveSearch(true);
        }}
      />
    </div>
  );
};

export default App;
