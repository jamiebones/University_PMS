import React from "react";
import { year } from "@cleverbeagle/dates";
import { Link } from "react-router-dom";
import { Grid } from "react-bootstrap";
if (Meteor.isClient) import "./Footer.scss";

const copyrightYear = () => {
  const currentYear = year();
  return currentYear === "2019" ? "2019" : `2019-${currentYear}`;
};

const Footer = () => (
  <div className="Footer">
    <Grid>
      <p className="pull-left">
        &copy; {copyrightYear()} University Personnel Management System
      </p>
      <ul className="pull-right">
        {/*<li><Link to="/terms">Terms<span className="hidden-xs"> of Service</span></Link></li>
        <li><Link to="/privacy">Privacy<span className="hidden-xs"> Policy</span></Link></li>
        */}
      </ul>
    </Grid>
  </div>
);

Footer.propTypes = {};

export default Footer;
