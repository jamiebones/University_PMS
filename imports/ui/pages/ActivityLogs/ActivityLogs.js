import React from "react";
import { Meteor } from "meteor/meteor";
import Loading from "../../components/Loading/Loading";
import { Row, Col, Button } from "react-bootstrap";
import styled from "styled-components";
import { _ } from "meteor/underscore";
import autoBind from "react-autobind";
import moment from "moment";

const ActivityLogStyle = styled.div`
  .activity {
    padding: 10px;
    background: #75efe6cc;
    margin-top: 10px;
    margin-bottom: 5px;
  }

  .activity:nth-child(even) {
    background: #d08a3e;
  }

  .activity:last-child {
    margin-bottom: 10px;
  }
  span {
    font-size: 13px;
    font-style: italic;
    color: black;
  }
`;

class ActivityLogPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logType: [],
      activities: [],
      totalActivities: 0,
      loading: false,
      skip: 2,
      limit: 2,
      type: ""
    };
    autoBind(this);
  }

  componentDidMount() {
    Meteor.call("activitylog.getType", (err, res) => {
      if (!err) {
        this.setState({ logType: res });
      } else {
        this.setState({ loading: false });
        console.log(err);
      }
    });
  }

  onActivityChange(e) {
    if (e.target.value == "0") return;
    const type = e.target.value;
    let context = this;
    this.setState({ loading: true, type });
    this.GetDataFromDatabase(type, this.state.limit, 0, context);
  }

  GetDataFromDatabase(type, limit, skip, context) {
    Meteor.call(
      "activitylog.getActivityByLog",
      type,
      limit,
      skip,
      (err, res) => {
        if (!err) {
          context.setState({
            activities: _.uniq([...this.state.activities, ...res[0]]),
            totalActivities: res[1],
            loading: false
          });
        } else {
          console.log(err);
        }
      }
    );
  }

  loadMoreData() {
    this.setState({ skip: parseInt(2 + this.state.skip) });
    const { skip, limit, type } = this.state;
    console.log(skip);
    const context = this;
    this.GetDataFromDatabase(type, limit, skip, context);
  }

  render() {
    const { loading, activities, logType, totalActivities } = this.state;
    return (
      <ActivityLogStyle>
        <Row>
          <Col md={4} mdOffset={2}>
            <p className="lead">
              <b>View Log By Action Type</b>
            </p>
            <div>
              <select className="form-control" onChange={this.onActivityChange}>
                <option value="0">select activity</option>
                {logType.length &&
                  logType.map(({ _id }) => {
                    return (
                      <option key={_id} value={_id}>
                        {_id.toUpperCase()}
                      </option>
                    );
                  })}
              </select>
            </div>
          </Col>

          <Col md={8} mdOffset={2}>
            {!loading ? (
              <div>
                {activities.length &&
                  activities.map(
                    ({ name, activityTime, actionTaken }, index) => {
                      return (
                        <div className="activity" key={index}>
                          <p>
                            Action : <span>{actionTaken}</span>
                          </p>

                          <p>
                            Action date:{" "}
                            <span>
                              {moment(activityTime).format("DD MMMM YYYY")}
                            </span>
                          </p>

                          <p>
                            Officer: <span>{name.toUpperCase()}</span>
                          </p>
                        </div>
                      );
                    }
                  )}

                {totalActivities > activities.length ? (
                  <Button bsStyle="success" onClick={this.loadMoreData}>
                    Load More
                  </Button>
                ) : null}
              </div>
            ) : (
              <Loading />
            )}
          </Col>
        </Row>
      </ActivityLogStyle>
    );
  }
}

export default ActivityLogPage;
