import React from "react";

import { Table } from "react-bootstrap";
import { get } from "lodash";

import { httpPost } from "../utils/http";
import Loader from "../components/Loader";
import OldLedger from "./old-theme/OldLedger";
import { withTranslation } from "react-i18next";

class Ledger extends React.Component {
  state = {
    ledger: [],
    is_fetching: false,
  };

  componentDidMount() {
    this.getLedger();
  }

  getLedger = async () => {
    this.setState({ is_fetching: true });
    try {
      const response = await httpPost("Ledger", {});

      this.setState({ ledger: response.data, is_fetching: false });
    } catch (err) {
      console.error(err);
      this.setState({ is_fetching: false });
    }
  };

  render() {
    const { ledger, is_fetching } = this.state;
    const { t } = this.props;
    const team_data = get(ledger, "team_data", []);

    const isOld = localStorage.getItem("is_old_theme") === "true";

    if (isOld) return <OldLedger ledger={ledger} is_fetching={is_fetching} />;

    return (
      <div className="container-fluid table-responsive">
        {is_fetching && <Loader />}
        <Table bordered hover>
          <thead>
            <tr>
              <th className="bg-success text-white">#</th>
              <th className="bg-success text-white">{t("Total Credit")}</th>
              <th className="bg-success text-white">
                {ledger.total_debit || 0}
              </th>
              <th className="bg-danger text-white">{t("Total Debit")}</th>
              <th className="bg-danger text-white">
                {ledger.total_credit || 0}
              </th>
              <th className="bg-success text-white">{t("Balance")}</th>
              <th
                className={
                  ledger.total_balance < 0
                    ? "bg-danger text-white"
                    : "bg-success text-white"
                }
              >
                {Math.round(ledger.total_balance) || 0}
              </th>
            </tr>
            <tr>
              <th>{t("Date")}</th>
              <th>{t("Entry")}</th>
              <th>{t("Team Name")}</th>
              <th>{t("Won Team Name")}</th>
              <th>{t("Credit")}</th>
              <th>{t("Debit")}</th>
              <th>{t("Balance")}</th>
            </tr>
          </thead>
          <tbody>
            {team_data.map((row, i) => {
              let rowClasses = "bg-success text-white";

              if (row.payment_type === "C" && row.amount != 0) {
                rowClasses = "bg-success text-white";
              } else if (row.payment_type !== "C" && row.amount != 0) {
                rowClasses = "bg-danger text-white";
              } else {
                rowClasses = "bg-white";
              }
              return (
                <tr key={i} className={rowClasses}>
                  <td>{row.s_date}</td>
                  <td></td>
                  <td>{row.match_name}</td>
                  <td>{row.won_team_name}</td>
                  <td>{row.payment_type === "C" && row.amount}</td>
                  <td>{row.payment_type !== "C" && row.amount}</td>
                  <td>{Math.round(row.balance) || 0}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default withTranslation("rules")(Ledger);
