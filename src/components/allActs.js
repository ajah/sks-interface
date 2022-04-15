import React, { Component } from "react";
import axios from "axios";
import "./orgPage.css";
import BackToEntButton from "./common/BackToEntButton";

function currencyFormat(amount) {
  return (
    "$" +
    Number.parseFloat(amount)
      .toFixed(2)
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
  );
}

const Row = (props) => (
  <tr>
    <td>
      <div className="">{props.date}</div>
    </td>
    <td>
      <div className="">
        <a
          href={`http://0.0.0.0:3000/activities/${props.act_sks_id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {props.grant_title}
        </a>
      </div>
    </td>
    <td>
      <div className="">{currencyFormat(props.funding_amount)}</div>
    </td>
    <td>
      <div className="">{props.grant_description}</div>
    </td>
  </tr>
);

export default class AllActs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activities: [],
    };
  }

  async componentDidMount() {
    const url = new URL(window.location.href);
    const ent_sks_id = url.pathname.split("/")[2];

    await axios
      // .get(`http://localhost:5000/activities/byentity/${ent_sks_id}`)
      .get(
        `https://sks-server-hbl9d.ondigitalocean.app/activities/byentity/${ent_sks_id}`
      )
      .then((response) => {
        this.setState({
          activities: response["data"],
        });
      })
      .then(console.log(this.state))
      .catch((error) => console.log(error));
  }

  tableRows() {
    return this.state.activities.map((activity) => {
      return (
        <Row
          grant_title={activity.grant_title}
          funding_amount={activity.funding_amount}
          act_sks_id={activity.act_sks_id}
          grant_description={activity.grant_description}
          date={activity.date}
        />
      );
    });
  }

  render() {
    return (
      <div className="container bg-light  mt-5 p-5 gap-2">
        <div className="row">
          <div className="pb-3 text-center">
            <h2 className="">Complete list of grants for organization</h2>
            <BackToEntButton />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="p-2">
              <table className="table">
                <thead className="">
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Grant Title</th>
                    <th scope="col">Funding Amount</th>
                    <th scope="col">Description</th>
                  </tr>
                </thead>
                <tbody>{this.tableRows()}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
