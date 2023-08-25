import React from "react";
import { Row, Col } from "react-bootstrap";
import moment from "moment";

import { httpPost } from "../utils/http";

import UpcomingIcon from "../assets/img/upcoming-icon.png";
import Caution from "../assets/img/caution.gif";

import { lightTheme, GAMESTYPES } from "../utils/configs";
import Loader from "../components/Loader";
import OldMatchesList from "./old-theme/Matches";

class Matches extends React.Component {
  state = {
    matches: [],
    is_fetching: false,
  };

  componentDidMount() {
    this.getMatches();
  }

  getMatches = async () => {
    this.setState({ is_fetching: true });
    try {
      const { status } = this.props;
      const response = await httpPost("MatchList", { status });

      this.setState({ matches: response, is_fetching: false });
    } catch (err) {
      console.error(err);
    }
  };

  handleRedirectToInplay = (market_id) => {
    const { status } = this.props;

    if (status === "inplay") {
      window.location.href = `/play-match?id=${market_id}`;
    } else {
      return;
    }
  };

  render() {
    const { matches, is_fetching } = this.state;
    const { status } = this.props;
    const isOld = localStorage.getItem("is_old_theme") === "true";

    if (isOld)
      return (
        <OldMatchesList
          matches={matches}
          is_fetching={is_fetching}
          status={status}
          openInplay={this.handleRedirectToInplay}
        />
      );

    return (
      <div className="container-fluid">
        {is_fetching && <Loader />}

        {matches.length > 0 &&
          matches.map((match) => {
            return (
              <Row
                onClick={() => this.handleRedirectToInplay(match.market_id)}
                className="match-row"
              >
                <Col xs={12} sm={6} md={6} lg={6} className="match-meta">
                  {status === "inplay" ? (
                    <div className="date-height">
                      <div className="date-time in-play">
                        <div className="animation-box">
                          <ul className="flip-animation">
                            <li className="time_date">
                              <span className="time">Today</span>
                              <span className="date">
                                {moment(match.match_date).format("hh:mm")}
                              </span>
                            </li>
                            <li>
                              <span className="in-play-item">
                                <div className="icon-holder-small">
                                  <box-icon color="#fff" name="play"></box-icon>
                                </div>
                                In-Play
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <img src={UpcomingIcon} alt="" className="vibrate-1" />
                  )}
                  <div>
                    <h5 className="m-0">{match.match_name}</h5>
                    <p className="m-0">
                      <box-icon color={lightTheme} name="time-five"></box-icon>
                      <span>{match.match_date}</span>
                    </p>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={6} lg={6} className="match-meta">
                  <span className="game-bet-data match-bets">
                    Total Match Bets {match.match_bets || "0"}
                  </span>
                  <span className="game-bet-data session-bets">
                    Total Session Bets {match.session_bets || "0"}
                  </span>
                </Col>
              </Row>
            );
          })}
        {!is_fetching && !matches.length && (
          <div className="caution-warning">
            <img src={Caution} alt="" />
            <p>No Matches</p>
          </div>
        )}
      </div>
    );
  }
}

export default Matches;
