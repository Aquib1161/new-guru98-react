import React from "react";
import { shape } from "prop-types";

import { get } from "lodash";

import { Table } from "react-bootstrap";
import { httpPost } from "../../utils/http";
import { t } from "i18next";
import Loader from "../../components/Loader";
import { withTranslation } from "react-i18next";

class CasinoStatement extends React.Component {
  state = {
    statement: [],
    won_team_selection_id: 0,
    is_fetching: false,
  };

  componentDidMount() {
    const urlParams = new URLSearchParams(window.location.search);
    const key = urlParams.get("market_id");
    const type = urlParams.get("caisno_type");

    this.getStatement(key, type);
  }

  getStatement = async (market_id, caisno_type) => {
    this.setState({ is_fetching: true });

    try {
      const response = await httpPost(
        "casino_bet_list",
        {
          market_id,
          game_type: caisno_type,
        },
        true
      );

      console.log(response);

      this.setState({
        statement: response.bet_data,
        is_fetching: false,
      });
    } catch (err) {
      console.error(err);
      this.setState({ is_fetching: false });
    }
  };

  getWinnerType = (bet) => {
    if (bet.casino_type === "TEENPATTI T20") {
      switch (bet.decision) {
        case "1":
          return <strong>Player A</strong>;
        case "2":
          return <strong>Player B</strong>;
        case "3":
          return <strong>T</strong>;
        default:
          return "";
      }
    } else if (bet.casino_type === "LUCKY7 A") {
      switch (bet.decision) {
        case "1":
          return <strong>Low Card</strong>;
        case "2":
          return <strong>High Card</strong>;
        case "0":
          return <strong>Lucky 7</strong>;
        default:
          return bet.decision;
      }
    } else {
      switch (bet.decision) {
        case "1":
          return <strong>Dragon</strong>;
        case "2":
          return <strong>Tiger</strong>;
        case "3":
          return <strong>TIE</strong>;
        default:
          return "";
      }
    }
  };

  isProfit = (bet) => {
    if (bet.bet_for == "low_high") {
      return bet.decision == bet.key;
    }

    return (
      bet.decision.trim().toLowerCase() == bet.player_name.trim().toLowerCase()
    );
  };

  render() {
    const { statement, is_fetching } = this.state;
    const { t } = this.props;

    let totalProfit = 0;
    return (
      <>
        {is_fetching && <Loader />}
        {statement && (
          <Table bordered className="table-responsive statement-tables mb-5">
            <thead>
              <tr>
                <th
                  colSpan={6}
                  className="text-center text-white bg-theme-dark"
                >
                  {t("Casino Bets")}
                </th>
              </tr>
              <tr className="bg-dark text-white">
                <th>{t("Player Name")}</th>
                <th>{t("Profit")}</th>
                <th>{t("Loss")}</th>
                <th>{t("Amount")}</th>
                <th>{t("Dec")}</th>
              </tr>
            </thead>
            <tbody>
              {statement.map((data, i) => {
                let isProfit = false;
                if (data.casino_type == "LUCKY7 A") {
                  isProfit = this.isProfit(data);

                  if (data.decision == "0") {
                    data.profit = Number(data.profit) / 2;
                    data.loss = Number(data.loss) / 2;
                  }
                } else {
                  isProfit = data.decision == data.key;
                }
                if (isProfit) {
                  totalProfit += Number(data.profit);
                } else {
                  totalProfit += Number(data.loss);
                }

                return (
                  <tr key={i}>
                    <td>{data.player_name}</td>
                    <td>{data.profit}</td>
                    <td>{data.loss}</td>
                    <td>{data.amount}</td>
                    <td>{this.getWinnerType(data)}</td>
                  </tr>
                );
              })}
              <tr>
                <td
                  colSpan={6}
                  className={`text-center ${
                    totalProfit >= 0 ? "text-primary" : "text-danger"
                  }`}
                >
                  {totalProfit >= 0 ? t("YOU WON") : t("YOU LOST")}{" "}
                  {totalProfit.toFixed(2)}/- {t("coins")}.
                </td>
              </tr>
            </tbody>
          </Table>
        )}

        <a className="btn btn-primary w-100 casino-back-btn" href="/statement">
          {t("Back to Statement")}
        </a>
      </>
    );
  }
}

CasinoStatement.propTypes = {
  router: shape({}),
};

export default withTranslation("rules")(CasinoStatement);
