// import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import queryString from "query-string";
import { useHistory } from "react-router-dom";


import { Link } from "react-router-dom";


import React, { Component, useState, useContext } from "react";
import { SearchContext } from "../context/search-context";
import "./searchBar.css";
import context from 'react-bootstrap/esm/AccordionContext';


const Search = (props) => {

  const history = useHistory();


  const searchContext = useContext(SearchContext);





  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchQuery1, setSearchQuery1] = React.useState("");
  const [searchQuery2, setSearchQuery2] = React.useState("");
  const [searchQuery3, setSearchQuery3] = React.useState("");
  const [searchQuery4, setSearchQuery4] = React.useState("");
  const [searchQuery5, setSearchQuery5] = React.useState("");
  const [totalQuery, setTotalQuery] = React.useState("");
  const [searchArray, setSearchArray] = React.useState([]);
  // const [counter, setcounter] = React.useState(0)
  const [okArray, setOkArray] = React.useState([])
  let counter = 0;

  let searchString = '';

  const searchQueryHandler = (e) => {

    //e.preventDefault();
    
    

    searchContext.loadingHandler('true');

  /*   if (props.isHome) {

      e.preventDefault();
      console.log("here", e.key)

    } */

  

    if (searchQuery && (searchQuery1 !== searchQuery2) /* && (searchQuery2 !== searchQuery3) */) {

      //console.log(searchQuery1, searchQuery2, searchQuery3)

      searchContext.searchHandler(searchQuery);

      if (counter === 0) {
        searchContext.searchArrayHandler(searchQuery1)


        counter++
        console.log("counter set to 1", counter)

      }
      if (counter === 1 && (searchQuery1 !== searchQuery2) && searchQuery2) {
        searchContext.searchArrayHandler(searchQuery2)
        // console.log("here[[2[", searchQuery2)
        counter++
        console.log("counter set to 2", counter)
      }
      if (counter === 2 && (searchQuery2 !== searchQuery3) && searchQuery3) {
        searchContext.searchArrayHandler(searchQuery3)
        //console.log("here[[3[", searchQuery3)
        counter++
        console.log("counter set to 3", counter)
      }
    }
    if (counter === 3 && (searchQuery3 !== searchQuery4) && searchQuery4) {
      searchContext.searchArrayHandler(searchQuery4)
      //console.log("here[[3[", searchQuery3)
      counter++
    }
    if (counter === 4 && (searchQuery4 !== searchQuery5) && searchQuery5) {
      searchContext.searchArrayHandler(searchQuery5)
      //console.log("here[[3[", searchQuery3)
      counter++
    }



    setSearchQuery('');

    setOkArray(searchContext.searchArray)


    // console.log(okArray)

  };


  const enterHandler = (e) => {

    console.log(e.key)


    if (e.key === "Enter") {
      e.preventDefault()
      console.log("hello", e)
      setCurrentQuery(e)
      history.push(`/results?q=${e.target.value}&doctype=activity,entity`);
    }

  }


  const setCurrentQuery = (e) => {

    e.preventDefault()

    console.log(searchContext.searchArray)
    //console.log(queryString.parse(window.location.search).q.split(" "))

    let query = e.target.value


    setSearchQuery(query)

    if (counter === 0) {
      setSearchQuery1(query)


    }

    else if (counter === 1) {
      setSearchQuery2(query)
      //console.log("searchquery2", searchQuery2)
    }
    else if (counter === 2) {
      setSearchQuery3(query)
    }
    else if (counter === 3) {
      setSearchQuery4(query)
    }
    else if (counter === 4) {
      setSearchQuery5(query)
    }





    //handleTotalQuery(query)



    //console.log("totalquery", totalQuery)
    // console.log(counter)


  }


  /*  const handleTotalQuery = (query) => {
  
    if (searchQuery1 && searchQuery2 && searchQuery3 && searchQuery4 && searchQuery5) {
      setTotalQuery(searchQuery1+'+'+searchQuery2+'+'+searchQuery3+'+'+searchQuery4+'+'+query)
  
    }
  
    else if (searchQuery1 && searchQuery2 && searchQuery3 && searchQuery4) {
      setTotalQuery(searchQuery1+'+'+searchQuery2+'+'+searchQuery3+'+'+query)
  
    }
  
    else if (searchQuery1 && searchQuery2 && searchQuery3) {
      setTotalQuery(searchQuery1+'+'+searchQuery2+'+'+query)
  
    }
    else if (searchQuery1 && searchQuery2) {
      setTotalQuery(searchQuery1+'+'+query)
    }
    else {
      setTotalQuery(query)
    } 
  
    
   }
   */
  const removeQuery = (query, key) => {



    searchContext.loadingHandler('true');


    /* const newArray = searchArray.splice(key, 1)
    console.log(searchArray)
    setSearchArray(newArray) */

    //console.log('okarray', okArray, query)

    if (searchQuery1 === query.query) {
      setSearchQuery1('')
    }
    else if (searchQuery2 === query.query) {
      setSearchQuery2('')
    }
    else if (searchQuery3 === query.query) {
      setSearchQuery3('')
    }




    searchContext.searchArray.splice(query.key, 1)


    setOkArray(searchContext.searchArray)


    if (!searchContext.searchArray) {

      setSearchQuery('')
    }

    //handleTotalQuery(query)


    counter--;

    // console.log("heres the array", searchContext)

    searchContext.searchHandler('');



    console.log('removing', searchContext.searchArray, counter)






  }


  /* 
    setCurrentQuery = (query) => {
      localStorage.setItem('query', query);
      this.setState({ currentQuery: query });
    }
  
    handleSubmit = (e) => {
      e.preventDefault();
      const { history } = this.props;
      console.log(history);
  
      if (this.state.query && this.state.query.length > 1) {
        this.getInfo();
           history.push(
             `/results?q=${encodeURI(this.state.query)}&filter=activity,entity`
           );
           this.props.history.push({
             pathname: '/results',
             search:  `q=${encodeURI(this.state.query)}&filter=activity,entity`,
             state: { detail: "test" }
           })
           window.location.reload(false);
      }
  
      if (this.state.query) {
        localStorage.setItem('query', this.state.query);
        this.setState({ currentQuery: this.state.query });
        console.log(localStorage)
        console.log(this.state.query)
  
      }
  
  
    }; */

  const orCheckHandler = async (e) => {

    console.log("here at least", e.target.checked)

    console.log(searchContext.orFunctionality)

    await searchContext.orHandler(e.target.checked);


    console.log(searchContext.orFunctionality)


  }



  return (
    <div className="container pb-3 pt-1 mt-1">
      <form className="" onSubmit={searchQueryHandler}>
        <div className="row">
          <div className="col-2">


          </div>
          <div className="col-5 inter-bar">

            {searchContext.searchArray.map((query, key) => {
              return (
                <div className="search-query border col-2 ps-3 rounded-pill">
                  {query}
                  {/*  <Link  to={`/results?q=${totalQuery.replace(('+'+query),"")}&filter=activity,entity`}>
                  <FontAwesomeIcon transform="right-15" onClick={() => removeQuery({query})} icon={faTimesCircle} />
                  </Link> */}
                  <div className="mx-auto" size="sm">
                    <FontAwesomeIcon className="remove-query" onClick={() => removeQuery({ query, key })} icon={faTimesCircle} />
                  </div>
                </div>
              )


            })}
          </div>

        </div>
        <div className="row">

          <div className="col-2 ">

            <h2 className="text-end">Search</h2>

          </div>




          <div className="col-7 ">



            <div className="">
            </div>
            <div className="form-text">
              <input
                contenteditable="true"
                className="form-control ps-4 pe-4 rounded-pill"
                type="text"
                name="search"
                placeholder="Enter search terms here"
                value={searchQuery}
                data-toggle="tooltip" title="To complete your search enter a keyword or phrase and hit the enter key or click the search button. Enter one keyword at a time. Your results will update automatically as more keywords are added. The maximum keywords you can search for is 5."
                onInput={(e) => setCurrentQuery(e)}
                onKeyPress={(e) => enterHandler(e)}
              ></input>



            </div>
          </div>
          <div className="col-3">
            <div className="inter-bar">
              <div className="mt-2 or-box">
                <input
                  className="form-check-input"
                  type="checkbox"

                  id="defaultCheck1"
                  name="entity"
                  onChange={(e) => orCheckHandler(e)}
                />
                <label className="form-check-label">
                  'Or'
                </label>
              </div>


              <div className="">


                {searchContext.orFunctionality ?

                  (<Link
                    className="btn btn-primary ps-4 pe-4 rounded-pill mx-auto"
                    onClick={searchQueryHandler}
                    to={`/results?q=${searchContext.searchArray.join("$")}&doctype=activity,entity&operator=Or`}
                  >
                    Or Search <FontAwesomeIcon icon={faSearch} />
                  </Link>)



                  : <Link
                    className="btn btn-primary ps-4 pe-4 rounded-pill mx-auto"
                    onClick={searchQueryHandler}
                    to={`/results?q=${searchContext.searchArray.join("+")}&doctype=activity,entity&operator=And`}
                  >
                    And Search<FontAwesomeIcon icon={faSearch} />
                  </Link>
                }
              </div>

            </div>
          </div>

        </div>
      </form>
    </div>
  );
}


export default Search;
