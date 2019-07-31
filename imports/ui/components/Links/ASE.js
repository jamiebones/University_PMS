import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const ASEStyles = styled.div`
  p {
    background: #ced8cc;
    padding: 10px;
  }

  p a {
    color: #465d67;
  }

  span {
    font-size: 12px;
    padding: 2px;
    background: #5772b3;
    float: right;
  }
  p a:hover {
    text-decoration: none;
  }
`;

const ASE = ({ history }) => (
  <ASEStyles>
    <p>
      <Link to="/auth/records/search">Search Staff Records</Link>
      <span>Link to search for staff records</span>
    </p>
    <p>
      <Link to="/auth/nominal_roll">Nominal Roll</Link>
      <span>List of staff and their current department</span>
    </p>
    <p>
      <Link to="/auth/dashboard/home">Home</Link>
      <span>Display page of data and statistics</span>
    </p>

    <p>
      <Link to="/auth/due_for_promotion">Promotion List</Link>
      <span>Promotion list of academic staff due</span>
    </p>

    <p>
      <Link to="/auth/promotion_list">Promotion List</Link>
      <span>Promotion list of staff promoted</span>
    </p>
  </ASEStyles>
);

export default ASE;
