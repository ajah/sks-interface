import React, { Component, useContext } from "react";
import "./../assets/css/styles.css";
import axios from "axios";
import queryString from "query-string";
import SearchBar from "./searchBar";
import { Link } from "react-router-dom";
import { SearchContext } from "../context/search-context";

// import { GoTriangleDown } from "react-icons/go";

function Badge(props) {
  const type = props.type;
  if (type === "activity") {
    return <span className="badge badge-primary">Activity</span>;
  } else if (type === "entity") {
    return <span className="badge bg-primary">Organization</span>;
  } else {
    return "";
  }
}

const Row = (props) => (
  <tr>
    <td>
      <div>
        {/* <a href={props.url}>{props.name}</a> */}

  
                <Link to={props.url} >{props.name}</Link>
          
      </div>
    </td>
    <td>
      <div>
        {props.municipality}
        {props.region ? `, ${props.region}` : ""}
      </div>
    </td>
    <td>
      <div>
        <Badge type={props.type} />
      </div>
    </td>
  </tr>
);

export default class ResultsPage extends Component {

  static contextType = SearchContext;

  constructor(props) {
    super(props);
    this.state = {
      total: "",
      results: [],
      // filterParams: ["activity", "entity"],
      act_total: "",
      ent_total: "",
      inc_activities: true,
      inc_entities: true, 
      contextState: '',
      filter: ['activity', 'entity'],
      globalQuery: '',
      queryProp: [],
      // query: "",
    };
  }


  

  
  
  componentDidMount() {
    const parsed = queryString.parse(this.props.location.search);
    let query = '';
    let filter = this.state.filter;
    let isRidirect = false;
    //console.log(filter)

    console.log("GOODBEY")

    if (!this.context.searchArray[0]) {
      console.log("HELLLLLLLLLOOOOOOOO")
     let queryArray = queryString.parse(window.location.search).q.split(" ");
     console.log(queryArray)
    //this.context.searchArrayHandler(queryArray)
    /*  this.setState({
      queryProp: queryArray
    }); */

    console.log(this.context.searchArray)
    
    }

    if (queryString.parse(window.location.search).filter === "entity") {



    isRidirect = true;
    filter = "entity";
    this.state.inc_activities = false;
    this.state.inc_entities = true;
    this.state.filter.splice(0,1)

    }


    if (this.context.searchArray.length > 1 && (isRidirect === false)) {
      query = this.context.searchArray.join('+')
      
    }
    else if (this.context.searchArray[0] && isRidirect === false) {
      query = this.context.searchArray[0]
    }

    else {
      query = queryString.parse(window.location.search).q;
      //console.log("hereasdfa", query)
    }
    //console.log("here", query)

    axios
      .all([
        axios.get(
          `https://sks-server-ajah-ttwto.ondigitalocean.app/search?q=${encodeURI(
            query
          )}&filter=${filter.toString()}`
        ),
        axios.get(
          `https://sks-server-ajah-ttwto.ondigitalocean.app/count?q=${encodeURI(
            query
          )}`
        ),
      ])
      .then(
        axios.spread((search, count) => {
          this.setState({
            results: search["data"]["hits"],
            total: count["data"]["new-activities,entities"],
            act_total: count["data"]["new-activities"],
            ent_total: count["data"]["entities"],
            contextState: this.context,
          });
          window.history.pushState('page2', 'Title', `/results?q=${query}&filter=${filter.toString()}`)
          this.setState({
            globalQuery: queryString.parse(window.location.search).q
           });
        })

      );

    

   /*  if (!filter.includes("activity")) {
      this.setState({
        inc_activities: false,
      });
    } else if (!filter.includes("entity")) {
      this.setState({
        inc_entities: false,
      });
    } */
  }

  componentDidUpdate() {
    // Typical usage (don't forget to compare props):
    if (this.state.contextState !== this.context) {

      console.log("herezzzzz", this.contextState)
      console.log("2222222",  this.context)
      
      this.componentDidMount()

      //console.log(this.context)
    }
  }

  tableRows() {
    return this.state.results.map((hit) => {
      let name, municipality, region, type, url;
      // if (hit._index === "activities") {
      if (hit._index === "new-activities") {
        name = hit._source.grant_title;
        municipality = hit._source.grant_municipality;
        region = hit._source.grant_region;
        type = "activity";
        url = `/activities/${hit._source.act_sks_id}`;
      } else if (hit._index === "entities") {
        name = hit._source.name;
        municipality = hit._source.location_municipality;
        region = hit._source.location_region;
        type = "entity";
        url = `/entities/${hit._source.ent_sks_id}`;
      }
      return (
        <Row
          name={name}
          municipality={municipality}
          region={region}
          type={type}
          url={url}
          key={hit._id}
        />
      );
    });
  }

  handleFilters = (e) => {
    if (!this.state.filter.includes(e.target.name)) {
      this.state.filter.push(e.target.name)
      window.history.pushState('page2', 'Title', `/results?q=${this.state.globalQuery}&filter=${this.state.filter.join(",")}`)
    }

    
    /* console.log("hello", this.context.query)

    const parsed = queryString.parse(this.props.location.search);
    const query =  this.context.query;
    const filter = parsed.filter;
  


    axios
      .all([
        axios.get(
          `https://sks-server-hbl9d.ondigitalocean.app/search?q=${encodeURI(
            query
          )}&filter=${filter}`
        ),
        axios.get(
          `https://sks-server-hbl9d.ondigitalocean.app/count?q=${encodeURI(
            query
          )}`
        ),
      ])
      .then(
        axios.spread((search, count) => {
          this.setState({
            results: search["data"]["hits"],
            total: count["data"]["new-activities,entities"],
            act_total: count["data"]["new-activities"],
            ent_total: count["data"]["entities"],
          });
        })
      ); */
    const value =
e.target.type === "checkbox" ? e.target.checked : e.target.value;
    const name = e.target.name;

    console.log(value)

    const queryParams = queryString.parse(window.location.search);
    const filters = this.state.filter

    if (value === true) {
     filters.push(name)
     this.setState({
      filter: filters
    })
    //this.componentDidMount()
    console.log(filters, value)
     
    }

    const index = filters.indexOf(name);

    

    

    this.setState({
      filter: filters
    })
    
    
    if (index > -1) {
      
      filters.splice(index, 1); // 2nd parameter means remove one item only
      this.setState({
        filter: filters
      })
    }


    this.componentDidMount();
  /*   this.setState({
      queryParams: filters,
    });

    this.setState({
      queryParams: name,
    }); */
  };
  

  handleButton = (e) => {
    e.preventDefault();
    console.log("Activities:", this.state.inc_activities);
    console.log("Entities:", this.state.inc_entities);

    let filter = [];
    if (this.state.inc_activities) {
      filter.push("activity");
    } else if (this.state.inc_entities) {
      filter.push("entity");
    } else if (!this.state.inc_activities & !this.state.inc_entities) {
      filter.push("activity,entity"); //.push("entity"); //
    } else if (this.state.inc_activities & this.state.inc_entities) {
      filter.push("activity,entity"); //.push("entity"); //
    }

  /*   const queryParams = queryString.parse(window.location.search);
    // const newQueries = { ...queryParams, filter: filter.toString() };
    const orig_q = queryParams["q"];
    console.log(queryParams["q"]);

    const { history } = this.props;

    if (filter) {
      history.push(`/results?q=${orig_q}&filter=${filter.toString()}`);
      window.location.reload(false);
      setFilter(filter.toString)
    }

    history.push(`/results?q=${encodeURI(orig_q)}&filter=${filter.toString()}`);
    window.location.reload(false);
    // console.log(queryString.stringify(newQueries)); */
  };

  render() {
    return (
      <main className="page projects-page mt-5">
        <div className="container ">
          <div className="row mt-5" id="SearchBar">
            <SearchBar queryProp={this.state.queryProp}/>
          </div>
          <div className="row">
            <div className="col-2 border border-3">
              {/* <div className="col-2"> */}
              <div className="row">
                <div className="col">
                  <h4 className="mt-3">Filter Your Search</h4>
                  <div className="">
                    <form>
                      <hr />
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={this.state.filter.includes('entity')}
                          id="defaultCheck1"
                          name="entity"
                          onChange={this.handleFilters}
                        />
                        <label className="form-check-label">
                          Organizations
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={this.state.filter.includes('activity')}
                          id="defaultCheck2"
                          name="activity"
                          onChange={this.handleFilters}
                        />
                        <label className="form-check-label">Activities</label>
                      </div>
                    </form>
                    <hr />
                    <p className="text-secondary">More filters coming soon!</p>
                  </div>
                  <div className="">
                    <button
                      className="btn btn-primary"
                      onClick={this.handleButton}
                    >
                      Update
                    </button>
                  </div>
                </div>
                {/* <div className="row mt-4">
                  <div className="col">
                    <h4>Terms</h4>
                    <div className="mt-3" id="FFBC">
                      <strong>
                        <GoTriangleDown />
                        {"   "}FFBC
                      </strong>
                      <div class="form-check mt-1">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          value=""
                          id="defaultCheck1"
                        />
                        <label class="form-check-label" for="defaultCheck1">
                          Black-Led
                        </label>
                      </div>
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          value=""
                          id="defaultCheck2"
                        />
                        <label class="form-check-label" for="defaultCheck2">
                          Black-Serving
                        </label>
                      </div>
                    </div>
                    <div className="mt-3" id="EFC">
                      <strong>
                        <GoTriangleDown />
                        {"   "}EFC
                      </strong>
                      <div class="form-check mt-1">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          value=""
                          id="defaultCheck1"
                        />
                        <label class="form-check-label" for="defaultCheck1">
                          Sustainability
                        </label>
                      </div>
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          value=""
                          id="defaultCheck2"
                        />
                        <label class="form-check-label" for="defaultCheck2">
                          Climate Change
                        </label>
                      </div>
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          value=""
                          id="defaultCheck2"
                        />
                        <label class="form-check-label" for="defaultCheck2">
                          Climate Education
                        </label>
                      </div>
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          value=""
                          id="defaultCheck2"
                        />
                        <label class="form-check-label" for="defaultCheck2">
                          Water & Oceans
                        </label>
                      </div>
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          value=""
                          id="defaultCheck2"
                        />
                        <label class="form-check-label" for="defaultCheck2">
                          Renewable Energy
                        </label>
                      </div>
                    </div>
                    <div className="p-2">
                      <button className="btn btn-primary">Update</button>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
            <div className="col-10">
              <div className="p-3">
                <div className="row ">
                  <div className="col">
                    <div className="bg-light p-3">
                      <span>Total Results: </span>
                      <span class="badge rounded-pill bg-primary ms-2">
                        {this.state.total}
                      </span>
                    </div>
                  </div>
                  <div className="col">
                    <div className="bg-light p-3">
                      <span>Organizations: </span>
                      <span class="badge rounded-pill bg-secondary ms-2">
                        {this.state.ent_total}
                      </span>
                    </div>
                  </div>
                  <div className="col">
                    <div className="bg-light p-3">
                      <span>Activities: </span>
                      <span class="badge rounded-pill bg-secondary ms-2">
                        {this.state.act_total}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="row" id="searchResults">
                  <div className="col">
                    <div className="mt-2">
                      <h4>Search Results</h4>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    {/* <div>{this.tableRows()}</div> */}
                    <table className="table table-striped">
                      <thead className="thead-light">
                        <tr>
                          <th style={{ width: "55%" }} scope="col">
                            Name
                          </th>
                          <th scope="col">Location</th>
                          <th scope="col">Record Type</th>
                        </tr>
                      </thead>
                      <tbody>{this.tableRows()}</tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}
