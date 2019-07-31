import React from "react";
import styled from "styled-components";
import { Col, Row } from "react-bootstrap";
import { StaffPostings } from "../../../api/StaffPosting/StaffPostingClass";
import { withTracker } from "meteor/react-meteor-data";

const PostingStatisticsStyles = styled.div``;

class PostingStatistics extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postings: [],
      postingStats: []
    };
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.postings !== prevState.postings) {
      const postings = nextProps.postings;
      let postingStats = [];
      let postingObject = {};
      //loop through the posting array
      for (let i = 0; i < postings.length; i++) {
        const postingObject = postings[i];
        const leavingUnit = postings[i].unitFrom;
        const goingToUnit = postings[i].newUnit;
        if (postingObject.hasOwnProperty(leavingUnit)) {
          postingObject.leavingUnit.leaving.push(postingObject);
        } else {
          postingObject.leavingUnit.leaving = [postingObject];
        }

        if (postingObject.hasOwnProperty(goingToUnit)) {
          postingObject.goingToUnit.coming.push(postingObject);
        } else {
        }
      }
    } else return null;
  }

  render() {
    const { postings, loading } = this.props;

    return (
      <PostingStatisticsStyles>
        <Row>
          <Col md={12} />
        </Row>
      </PostingStatisticsStyles>
    );
  }
}

export default (PostingStatisticsContainer = withTracker(() => {
  let subscription;
  if (Meteor.isClient) {
    subscription = Meteor.subscribe(
      "staffposting.getApprovedPostingStatistics"
    );
  }
  let date = moment(new Date()).toISOString();
  let query = {
    status: "4",
    startingDate: {
      $gt: date
    }
  };

  return {
    loading: subscription && !subscription.ready(),
    postings: StaffPostings.find(query).fetch()
  };
})(PostingStatistics));
