import React from "react";
import { withTranslation } from "react-i18next";

class PlacedBets extends React.Component {
  isTeenPatti = () => {
    const { game_type } = this.props;

    if (game_type == "TEENPATTI T20") {
      return true;
    }

    return false;
  };

  decision = (winner) => {
    if (this.isTeenPatti()) {
      switch (winner) {
        case "1":
          return <strong>A</strong>;
        case "2":
          return <strong>B</strong>;
        case "3":
          return <strong>T</strong>;
        default:
          return "";
      }
    } else {
      switch (winner) {
        case "1":
          return <strong>D</strong>;
        case "2":
          return <strong>T</strong>;
        case "3":
          return <strong>TIE</strong>;
        default:
          return "";
      }
    }
  };

  render() {
    const { bets_list, t } = this.props;

    if (!bets_list.length)
      return (
        <center className="mt-3">
          <b>{t("No Bets Yet")}</b>
        </center>
      );

    return (
      <>
        <ul className="casino-bets-list mt-3">
          {bets_list.map((bet, i) => {
            return (
              <li key={i}>
                <h4>
                  {bet.player_name} - ({bet.market_id})
                </h4>
                <div className="d-flex justify-content-between bet">
                  <div>
                    <h4>{t("Profit")}</h4>
                    <p>{bet.profit}</p>
                  </div>
                  <div>
                    <h4>{t("Loss")}</h4>
                    <p>{bet.loss}</p>
                  </div>
                  <div>
                    <h4>{t("Amount")}</h4>
                    <p>{bet.amount}</p>
                  </div>
                  <div>
                    <h4>{t("Decision")}</h4>
                    <p>{this.decision(bet.decision)}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </>
    );
  }
}

export default withTranslation("rules")(PlacedBets);
