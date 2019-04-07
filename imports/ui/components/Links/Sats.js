import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const SatsStyles = styled.div`
  a {
    display: block;
  }

  a:hover {
    text-decoration: none;
  }
`;

const Sats = ({ history }) => (
  <SatsStyles>
    <ul className="list-group">
      <li className="list-group-item list-group-item-primary">
        <Link to="/auth/records/search">Search Staff Records</Link>
      </li>
      <li className="list-group-item list-group-item-primary">
        <Link to="/auth/dashboard/home">Home</Link>
      </li>
      <li className="list-group-item list-group-item-primary">
        <Link to="/auth/posting_list">Posting List</Link>
      </li>
      <li className="list-group-item list-group-item-primary">
        <Link to="/auth/due_for_promotion">Promotion List</Link>
      </li>
      <li className="list-group-item list-group-item-primary">
        <Link to="/auth/staff_posting">Staff Posting</Link>
      </li>
      <li className="list-group-item list-group-item-primary">
        <Link to="/auth/add_staff_documents">Add Documents</Link>
      </li>
    </ul>
  </SatsStyles>
);

export default Sats;
