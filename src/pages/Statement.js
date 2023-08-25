import React from "react";
import { Row, Col, Button } from "react-bootstrap";

import { httpPost } from "../utils/http";
import { lightTheme } from "../utils/configs";

import SportsIcon from "../assets/img/sports.png";
import Loader from "../components/Loader";
import CasinoIcon from "../assets/img/casino-statement-icon.jpg";

import OldMatchesList from "./old-theme/Matches";
import { withTranslation } from "react-i18next";
import { isDotIn } from "../utils/configs";
import OldStatement from "./old-theme/OldStatement";

const TABS = (
  t = (key) => {
    return key;
  }
) => [t("Cricket"), t("Casino")];

class Statement extends React.Component {
  state = {
    matches: [],
    is_fetching: false,
    active_tab: TABS()[0],
    defaultPage: 1,
  };

  componentDidMount() {
    const { t } = this.props;

    this.setState({ active_tab: TABS(t)[0] });
    this.getStatement();
  }

  getStatement = async () => {
    this.setState({ is_fetching: true });

    try {
      const {defaultPage} = this.state;
      const isNet = window.location.hostname !== "sixpro.net";
      let response = await httpPost(`Statement?page_no=${defaultPage}`, {}, false);

      if (typeof response !== "object") {
        response = JSON.parse(response);
      }
      if (response.status === "success") {
        this.setState({ matches: response.data, is_fetching: false });
      }
    } catch (err) {
      console.error(err);
      this.setState({ is_fetching: false });
    }
  };

  openStatement = (market_id) => {
    window.location.href = `/view-statement?market_id=${market_id}`;
  };

  getCricketStatement = () => {
    const { matches } = this.state;

    const statement = matches.filter((match) => {
      return match.ledger_type === "" || match.ledger_type === undefined;
    });

    return statement;
  };

  getCasinoStatement = () => {
    const { matches } = this.state;

    const statement = matches.filter((match) => {
      return match.ledger_type !== "";
    });

    return statement;
  };

  toggleTabs = (active_tab) => {
    this.setState({ active_tab });
  };

  render() {
    const { matches, is_fetching, active_tab } = this.state;
    const { t } = this.props;

    const isOld = localStorage.getItem("is_old_theme") === "true";
    // if (isOld)
    //   return (
    //     <OldMatchesList
    //       matches={matches}
    //       is_fetching={is_fetching}
    //       openInplay={this.openStatement}
    //     />
    //   );

    return (
      <>
        {/* <div className="statement-tabs mb-2">
          <Button
            className={
              TABS(t)[0] == active_tab
                ? "bg-primary text-white"
                : "bg-white text-primary"
            }
            onClick={() => this.toggleTabs(TABS(t)[0])}
          >
            {TABS(t)[0]}
          </Button>
          {isDotIn() && (
            <Button
              className={
                TABS(t)[1] == active_tab
                  ? "bg-primary text-white"
                  : "bg-white text-primary"
              }
              onClick={() => this.toggleTabs(TABS(t)[1])}
            >
              {TABS(t)[1]}
            </Button>
          )}
        </div> */}
        <div className="container-fluid p-0">
          {is_fetching && <Loader />}

          {isOld && active_tab == TABS(t)[0] && (
            <OldStatement
              matches={this.getCricketStatement().reverse()}
              is_fetching={is_fetching}
              openInplay={this.openStatement}
              isStatement
            />
          )}

          {!isOld &&
            active_tab == TABS(t)[0] &&
            (matches.length > 0 ? (
              this.getCricketStatement()
                .reverse()
                .map((match) => {
                  return (
                    <Row
                      onClick={() => {
                        window.location.href = `/view-statement?market_id=${match.market_id}`;
                      }}
                      className="match-row"
                    >
                      <Col xs={12} sm={6} md={6} lg={6} className="match-meta">
                        <img
                          src={SportsIcon}
                          alt=""
                          style={{ width: "45px" }}
                          className="vibrate-1"
                        />
                        <div>
                          <h5 className="m-0">{match.match_name}</h5>
                          <p className="m-0">
                            <box-icon
                              color={lightTheme}
                              name="time-five"
                            ></box-icon>
                            <span>{match.s_date}</span>
                          </p>
                        </div>
                      </Col>
                      <Col xs={12} sm={6} md={6} lg={6} className="match-meta">
                        <span className="game-bet-data match-bets">
                          {/* Total Match Bets {match.match_count || "0"} */}
                        </span>
                        <span className="game-bet-data session-bets">
                          {/* Total Session Bets {match.session_count || "0"} */}
                        </span>
                      </Col>
                    </Row>
                  );
                })
            ) : (
              <p>No Data Available</p>
            ))}

          {active_tab == TABS(t)[1] &&
            this.getCasinoStatement()
              .reverse()
              .map((match) => {
                return (
                  <div className="container-fluid">
                    <Row
                      onClick={() => {
                        window.location.href = `/casino-statement?market_id=${match.market_id}&caisno_type=${match.ledger_type}`;
                      }}
                      className="match-row"
                    >
                      <Col xs={12} sm={6} md={6} lg={6} className="match-meta">
                        <img
                          src={CasinoIcon}
                          alt=""
                          style={{ width: "45px", borderRadius: "100%" }}
                          className=""
                        />
                        <div>
                          <h5 className="m-0 text-dark">{match.match_name}</h5>
                          {/* <p className="m-0">
                            <box-icon
                              color={lightTheme}
                              name="time-five"
                            ></box-icon>
                            <span>{match.match_date}</span>
                          </p> */}
                        </div>
                      </Col>
                    </Row>
                  </div>
                );
              })}
        </div>
      </>
    );
  }
}

export default withTranslation("rules")(Statement);
