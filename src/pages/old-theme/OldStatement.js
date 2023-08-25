import React from "react";
import moment from "moment";
import { withTranslation } from "react-i18next";

import { GAMESTYPES } from "../../utils/configs";
import BackToMenu from "../../components/BackToMenu";
class OldStatment extends React.Component {
  state = {
    selectMatchType: GAMESTYPES[1].id,
  };

  toggleSportsId = (selectMatchType) => {
    this.setState({ selectMatchType });
  };

  render() {
    const { status, matches, is_fetching, openInplay, isStatement, t } =
      this.props;

    const inplayGames = matches;

    return (
      <>
        <main className="warp">
          {/*--- Content -----------*/}
          <BackToMenu></BackToMenu>

          <div>
            {inplayGames.map((match) => {
              const isLost = match.payment_type == "D";
              return (
                <div
                  className={`old-matches-list ${
                    match.status === "INPLAY" ? "live-match" : ""
                  }`}
                >
                  <div className="TeamName">
                    <a onClick={() => openInplay(match.market_id)}>
                      {match.match_name}

                      {match.status === "INPLAY" && (
                        <span className="d-inline-flex align-items-center float-left mx-2">
                          <div class="blink"></div> &nbsp;Live
                        </span>
                      )}
                    </a>
                  </div>
                  <div className="old-match-details">
                    <a onClick={() => openInplay(match.market_id)}>
                      <table
                        width="100%"
                        border={0}
                        cellSpacing={0}
                        cellPadding={0}
                      >
                        <tbody>
                          <tr>
                            <td width="1%">&nbsp;</td>
                            <td
                              className="GameList"
                              style={{ verticalAlign: "top" }}
                            >
                              <table
                                width="99%"
                                border={0}
                                cellSpacing={0}
                                cellPadding={0}
                              >
                                <tbody>
                                  <tr>
                                    <td className="GameList" align="center">
                                      {match.match_date}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="GameList" align="center">
                                      {t("Match Bets")} :{" "}
                                      <span>{match.match_count || "0"}</span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="GameList" align="center">
                                      {t("Session Bets")} :{" "}
                                      <span>{match.session_count || "0"}</span>
                                    </td>
                                  </tr>
                                  {/* <tr>
                                    <td className="GameList" align="center">
                                      {t("Declared")} :{" "}
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
                                        className={`GameList ${
                                          isLost
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
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
          {/*Content*/}
        </main>
      </>
    );
  }
}

export default withTranslation("rules")(OldStatment);
