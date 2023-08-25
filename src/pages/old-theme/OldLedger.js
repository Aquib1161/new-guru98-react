import React from "react";
import { withTranslation } from "react-i18next";
import { get } from "lodash";

import Loader from "../../components/Loader";
import BackToMenu from "../../components/BackToMenu";

class OldLedger extends React.Component {
  calculatedBalance = (balance, type, amount, index) => {
    if (index === 0) {
      return balance;
    }

    if (type === "C") {
      return Number(balance) - Number(amount);
    } else {
      return Number(balance) + Number(amount);
    }
  };

  render() {
    const { ledger, is_fetching, t } = this.props;
    const team_data = get(ledger, "team_data", []);
    let ledgerBalance = ledger.total_balance;

    return (
      <>
        {is_fetching && <Loader />}
        <BackToMenu></BackToMenu>
        <main className="warp table-responsive statement-tables">
          {/*--- Content -----------*/}

          <table className="table-bordered text-center my-2 mx-auto" style={{ width: "98%" }}>
            <tbody>
              <tr
                className="pattiColor"
                style={{ color: "white", fontWeight: "bold", fontSize: "15px" }}
              >
              </tr>
              <tr>
                <td
                  width="40%"
                  height={35}
                  align="center"
                  valign="middle"
                  className="FontTextWhite10px pattiColor"
                  style={{
                    verticalAlign: "middle",
                    textAlign: "center",
                    paddingRight: 5,
                    color: "white",
                  }}
                >
                  {t("MATCH NAME")}
                </td>
                <td
                  width="15%"
                  align="center"
                  valign="middle"
                  className="FontTextWhite10px pattiColor"
                  style={{
                    verticalAlign: "middle",
                    textAlign: "center",
                    paddingRight: 5,
                    color: "white",
                  }}
                >
                  {t("Won By")}
                </td>
                <td
                  width="15%"
                  align="center"
                  valign="middle"
                  className="FontTextWhite10px pattiColor"
                  style={{
                    verticalAlign: "middle",
                    textAlign: "center",
                    color: "white",
                  }}
                >
                  {t("Credit")}
                </td>
                <td
                  width="15%"
                  align="center"
                  valign="middle"
                  className="FontTextWhite10px pattiColor"
                  style={{
                    verticalAlign: "middle",
                    textAlign: "center",
                    color: "white",
                  }}
                >
                  {t("Debit")}
                </td>
                <td
                  width="15%"
                  align="center"
                  valign="middle"
                  className="FontTextWhite10px pattiColor "
                  style={{
                    verticalAlign: "middle",
                    textAlign: "center",
                    color: "white",
                  }}
                >
                  {t("Balance")}
                </td>
              </tr>

              {team_data.map((row, i) => {
                ledgerBalance = this.calculatedBalance(
                  ledgerBalance,
                  team_data[i > 0 ? i - 1 : 0].payment_type,
                  team_data[i > 0 ? i - 1 : 0].amount,
                  i
                );
                return (
                  <tr>
                    <td>
                      {row.match_name} - {row.s_date}
                    </td>
                    <td>{row.won_team_name}</td>
                    <td>{(row.payment_type === "C" && row.amount) || 0}</td>
                    <td>{(row.payment_type !== "C" && row.amount) || 0}</td>
                    <td
                      className={
                        ledgerBalance < 0 ? "text-danger" : "text-success"
                      }
                    >
                      {Math.round(ledgerBalance)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </main>
      </>
    );
  }
}

export default withTranslation("rules")(OldLedger);
