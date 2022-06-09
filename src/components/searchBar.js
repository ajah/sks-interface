// import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimesCircle } from "@fortawesome/free-solid-svg-icons";


import { Link } from "react-router-dom";


import React, { Component, useState, useContext } from "react";
import { SearchContext } from "../context/search-context";
import "./searchBar.css";


const Search = (props) => {


  const searchContext = useContext(SearchContext);




  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchQuery1, setSearchQuery1] = React.useState("");
  const [searchQuery2, setSearchQuery2] = React.useState("");
  const [searchQuery3, setSearchQuery3] = React.useState("");
  const [totalQuery, setTotalQuery] = React.useState("");
  const [searchArray, setSearchArray] = React.useState([]);
  const [searchCounter, setSearchCounter] = React.useState(0)
  const [okArray, setOkArray] = React.useState([])

  let searchString = '';

  const searchQueryHandler = (e) => {


    if (!props.isHome) {

    e.preventDefault();


    }
    
    if (searchQuery && (searchQuery1 !== searchQuery2) /* && (searchQuery2 !== searchQuery3) */) {

      //console.log(searchQuery1, searchQuery2, searchQuery3)

    searchContext.searchHandler(searchQuery);

    if (searchCounter===0) {
    searchContext.searchArrayHandler(searchQuery1)
    //console.log("here[[1[")
    setSearchCounter(searchCounter + 1);
    
    }
    if (searchCounter===1 && (searchQuery1 !== searchQuery2) && searchQuery2) {
      searchContext.searchArrayHandler(searchQuery2)
     // console.log("here[[2[", searchQuery2)
      setSearchCounter(searchCounter + 1);
      }
      if (searchCounter===2 && (searchQuery2 !== searchQuery3) && searchQuery3) {
        searchContext.searchArrayHandler(searchQuery3)
        //console.log("here[[3[", searchQuery3)
        setSearchCounter(searchCounter + 1);
        }
      }

      setSearchQuery('');

      setOkArray(searchContext.searchArray)

     // console.log(okArray)
  };


  const setCurrentQuery = (e) => {

    e.preventDefault()

    let query = e.target.value
   

    setSearchQuery(query)

    if (searchCounter===0) {
      setSearchQuery1(query)
      
    }

    else if (searchCounter===1) {
      setSearchQuery2(query)
      //console.log("searchquery2", searchQuery2)
    }
    else if(searchCounter===2){
      setSearchQuery3(query)
    }
  

    handleTotalQuery(query)

    

    //console.log("totalquery", totalQuery)
   // console.log(searchCounter)

    
  }


 const handleTotalQuery = (query) => {

  if (searchQuery1 && searchQuery2 && searchQuery3) {
    setTotalQuery(searchQuery1+'+'+searchQuery2+'+'+query)

  }
  else if (searchQuery1 && searchQuery2) {
    setTotalQuery(searchQuery1+'+'+query)
  }
  else {
    setTotalQuery(query)
  } 

  
 }

  const removeQuery = (query, key) => {
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
  

  window.history.pushState('page2', 'Title', `/results?q=${searchContext.searchArray.join("+")}&filter=activity,entity`);

  setSearchCounter(searchCounter-1)

 // console.log("heres the array", searchContext)

  searchContext.searchHandler('');

  

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

  

  return (
    <div className="container pb-3 pt-1 mt-1">
      <form className="" onSubmit={e => searchQueryHandler(e)}>
        <div className="row">
        <div className="col-2"></div>
        <div className="col-5 inter-bar">
          
                 {okArray.map((query, key) => {
            return (
              <div className="search-query border col-2 ps-3 rounded-pill">
                {query}
               {/*  <Link  to={`/results?q=${totalQuery.replace(('+'+query),"")}&filter=activity,entity`}>
                <FontAwesomeIcon transform="right-15" onClick={() => removeQuery({query})} icon={faTimesCircle} />
                </Link> */}
                <div className="mx-auto" size="sm">
                <FontAwesomeIcon className="remove-query" onClick={() => removeQuery({query, key})} icon={faTimesCircle} />
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
          
          

          
          <div className="col-8 ">
         

            
            <div className="">
          </div>
            <div className="form-text">
              <input
                contenteditable="true"
                className="form-control ps-4 pe-4 rounded-pill"
                type="text"
                name="search"
                placeholder="Enter search terms here separated by commas"
                value={searchQuery}

                onInput={(e) => setCurrentQuery(e)}
              ></input>
                  

          
            </div>
          </div>
          <div className="col-2">
           
            <Link
              className="btn btn-primary ps-4 pe-4 rounded-pill mx-auto"
              onClick={searchQueryHandler}
              to={`/results?q=${searchContext.searchArray.join("+")}&filter=activity,entity`}
            >
              <FontAwesomeIcon icon={faSearch} />
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}


export default Search;
