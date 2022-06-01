import React, { Component } from "react";

import "./../assets/css/styles.css";

const Contact = () => {
    
    return (
        <main className="page landing-page">
        <section className="portfolio-block block-intro">
       <form className="col-6">
  <div class="form-group">
    <label for="exampleInputEmail1">Email address</label>
    <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"/>
  </div>
  <div class="form-group">
    <label for="exampleInputEmail1">Message</label>
    <textarea type="email" class="form-control" placeholder="Enter message"/>
  </div>
  <button type="submit" class="btn btn-primary">Submit</button>
</form>
        </section>
        </main>
    )

    

};




export default Contact;