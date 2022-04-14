import React, { Component } from "react";
import "./../assets/css/styles.css";
import { MdVolunteerActivism, MdDescription, MdBusiness } from "react-icons/md";

class TypesSection extends Component {
  state = {};
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="intro mb-3">
              <h2 className="text-center">
                Types of records you can search for:
              </h2>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col mt-4">
            <div className="row features">
              <div className="col-4">
                <MdBusiness size="60px" className="feature-icon mb-3" />
                <h3 className="name">
                  <strong>Organizations</strong>
                </h3>
                <p className="description">
                   Information about individual organizations in the nonprofit
                  sector
                </p>
              </div>
              <div className="col-4">
                <MdVolunteerActivism
                  size="60px"
                  className="feature-icon mb-3"
                />
                <h3 className="name">
                  <strong>Activities</strong>
                </h3>
                <p className="description">
                  Grant data that provides information about the activities or
                  programs carried out by organizations
                  <br />
                </p>
              </div>
              <div className="col-4">
                <MdDescription size="60px" className="feature-icon mb-3" />
                <h3 className="name">
                  <strong>Documents</strong>
                </h3>
                <p className="description">
                  Additional information about the activities and organization
                  (eg. evaluation reports, activity reports)
                  <br />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TypesSection;
