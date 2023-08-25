import React from "react";
import moment from "moment";
import { withTranslation } from "react-i18next";
import { GAMESTYPES } from "../../utils/configs";
import Loader from "../../components/Loader";
import BackToMenu from "../../components/BackToMenu";
import Footer from "../Footer";

class OldMatchesList extends React.Component {
  state = {
    selectMatchType: GAMESTYPES[0].id,
  };

  toggleSportsId = (selectMatchType) => {
    this.setState({ selectMatchType });
  };

  render() {
    const { status, matches, is_fetching, openInplay, isStatement, t } =
      this.props;
    const { selectMatchType } = this.state;
    const inplayGames =
      (selectMatchType || !isStatement) && selectMatchType != 0
        ? matches.filter((match) => match.sports_id == selectMatchType)
        : matches;
    return (
      <>
        <main className="warp">
          {is_fetching && <Loader />}
          <BackToMenu></BackToMenu>
          <div style={{ marginTop: "15px" }}>
            {inplayGames &&
              inplayGames.map((match) => {
                const isLost = match.payment_type == "D";
                return (
                  <div
                    className={`old-matches-list ${match.status === "INPLAY" ? "live-match" : ""
                      }`}
                    style={{
                      marginBottom: "3px",
                    }}
                  >
                    <div className="old-match-details" style={{ padding: "10px", }}>
                      <a onClick={() => openInplay(match.market_id)}>
                        <div className="TeamName" style={{ borderRadius: 4 }}>
                          <a onClick={() => openInplay(match.market_id)}>
                            {match.match_name} ({match.match_type})
                          </a>
                          <table style={{ backgroundColor: "white", }}
                            width="100%"
                            border={0}
                            cellSpacing={0}
                            cellPadding={10}
                          >
                            <tbody>
                              <tr>
                                <td width="1%">&nbsp;</td>
                                <td
                                  className="GameList"
                                  style={{ verticalAlign: "top" }}
                                >
                                  <table
                                    width="100%"
                                    border={0}
                                    cellSpacing={0}
                                    cellPadding={0}
                                  >
                                    <tbody>
                                      <tr>
                                        <td align="center" style={{ fontSize: "14px", fontWeight: 600 }}>
                                          {match.match_date}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td style={{ color: "#06b80c", fontSize: "12px" }}>
                                          Running
                                        </td>
                                      </tr>
                                      {/* <tr>
                                      <td className="GameList" align="center">
                                        {t("Match Bets")} :{" "}
                                        <span>{match.match_count || "0"}</span>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="GameList" align="center">
                                        {t("Session Bets")} :{" "}
                                        <span>
                                          {match.session_count || "0"}
                                        </span>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="GameList" align="center">
                                        {t("Declared")} :{"No"}
                                        <span>{match.desicion_status}</span>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="GameList" align="center">
                                        {t("Won By")} :{" "}
                                        <span>{match.won_team_name}</span>
                                      </td>
                                    </tr> */}
                                      {isStatement && (
                                        <tr>
                                          <td
                                            className={`GameList ${isLost
                                              ? "text-danger"
                                              : "text-primary"
                                              }`}
                                            align="center"
                                          >
                                            {isLost ? t("Loss") : t("Won")}{" "}
                                            {t("coins")} :{" "}
                                            <span>{match.amount}</span>
                                          </td>
                                        </tr>
                                      )}
                                    </tbody>
                                  </table>
                                </td>
                                <td width="1%">&nbsp;</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                      </a>
                    </div>
                  </div>
                );
              })}
          </div>
        </main>
        <Footer buttonClass="casino-back-btn"></Footer>
      </>
    );
  }
}

export default withTranslation("rules")(OldMatchesList);
