import React from "react";
import { shape } from "prop-types";

import { get } from "lodash";

import { Table } from "react-bootstrap";
import { httpPost } from "../utils/http";
import { t } from "i18next";
import Loader from "../components/Loader";
import { withTranslation } from "react-i18next";

class ViewStatement extends React.Component {
  state = {
    statement: {},
    won_team_selection_id: 0,
    is_fetching: false,
  };

  componentDidMount() {
    const urlParams = new URLSearchParams(window.location.search);
    const key = urlParams.get("market_id");

    this.getStatement(key);
  }

  getStatement = async (market_id) => {
    this.setState({ is_fetching: true });

    try {
      const response = await httpPost("Statement", { market_id });

      console.log(response)
      const won_team_selection_id = get(
        response.data,
        "completegame.match_data.won_team_selection_id",
        0
      );

      this.setState({
        statement: response.data,
        won_team_selection_id,
        is_fetching: false,
      });
    } catch (err) {
      console.error(err);
      this.setState({ is_fetching: false });
    }
  };

  render() {
    const { statement, won_team_selection_id, is_fetching } = this.state;
    const { t } = this.props;

    const matchData = get(statement, "completegame.match_data", {});
    const teamData = get(statement, "completegame.team_data", {});



    const match_bet_data = get(statement, "completegame.match_bet_data", []);
    const session_bet_data = get(
      statement,
      "completegame.session_bet_data",
      []
    );

    // const winningTeam = get(matchData, "[0].won_team_selection_id", 1);

    const totalMatchBetProfit = get(statement, "total_match_coins", 0);

    const totalSessionBetProfit = get(statement, "total_session_coins", 0);

    const myTotalCommission =
      parseFloat(get(statement, "total_match_commission", "0")) +
      parseFloat(get(statement, "total_session_commission", "0"));

    const totalProfits = totalMatchBetProfit + totalSessionBetProfit;

    const amountAfterComission =
      totalProfits >= 0
        ? totalProfits + myTotalCommission
        : totalProfits + myTotalCommission;
    // console.log(myTotalCommission);

    const matchSessionPlus = totalMatchBetProfit + totalSessionBetProfit;

    const team1Selection_id = get(teamData, "[0].selection_id");
    const team2Selection_id = get(teamData, "[1].selection_id");
    const team3Selection_id = get(teamData, "[2].selection_id");

    const total_profit = get(statement, "total_profit");

    const wonTeamName=matchData.won_team_name

    
    return (
      <>
        {is_fetching && <Loader />}
        <a style={{ backgroundColor: '#52b5e1',color:'white',fontWeight:'bold' }} className="btn btn-primary w-100 back-btn" href="/statement">
          {t("Back to Statement")}
        </a>

        

        <div className="table-responsive">
          <Table bordered className="statement-tables">
            <thead>
              <tr>
                <th colSpan={7} className="bg-theme-dark text-center">
                  {("Match Won By")}: {get(matchData, "won_team_name", "")}
                </th>
              </tr>
              <tr className="bg-dark text-white">
                <th>{t("Rate")}</th>
                <th>{t("Amount")}</th>
                <th>{t("Mode")}</th>
                <th>{t("Team")}</th>
                <th>{get(teamData, "[0].runner_name", "")}</th>
                <th>{get(teamData, "[1].runner_name", "")}</th>
                <td>{get(teamData, "[2].runner_name", "")}</td>
                {/* {team3Selection_id==0?"":"<th>"get(teamData, "[2].runner_name", "")} */}
                {/* <th>{t("P/L")}</th> */}
              </tr>
            </thead>
            <tbody>
              {match_bet_data.map((data, i) => {
               
                let position_array=data.position_array
                console.log(position_array)
                console.log(data.selection_id)
              
                const p1 =get(position_array, "["+team1Selection_id+"].show_amount", "")
                const p2 =get(position_array, "["+team2Selection_id+"].show_amount", "")
                const p3 =get(position_array, "["+team3Selection_id+"].show_amount", "")
                return (
                  <tr key={i}>
                    <td>{data.bhav}</td>
                    <td>{data.amount}</td>
                    <td>{data.type}</td>
                    <td>{data.team_name}</td>
                    <td className={p1 < 0 ? "text-danger" : "text-primary"}>
                      {p1}
                    </td>
                    <td className={p2 < 0 ? "text-danger" : "text-primary"}>
                      {p2}
                    </td> 
                    <td className={p3 < 0 ? "text-danger" : "text-primary"}>
                    {p3}
                    </td> 
                    {/* <td className={Math.round(data.final_bet_amount) < 0 ? "text-danger" : "text-primary"}>
                      {  Math.round(data.final_bet_amount)    }
                    </td> */}
                  </tr>
                );
              })}
              <td
                colSpan={7}
                className={`text-center ${
                  totalMatchBetProfit >= 0 ? "text-primary" : "text-danger"
                }`}
              >
                {totalMatchBetProfit >= 0 ? t("YOU WON") : t("YOU LOST")}{" "}
                {totalMatchBetProfit}/- {t("coins")}.
              </td>
            </tbody>
          </Table>
        </div>

        <Table bordered className="table-responsive statement-tables">
          <thead>
            <tr>
              <th colSpan={7} className="text-center text-white bg-theme-dark">
                {t("Session Bets")}
              </th>
            </tr>
            <tr className="text-white bg-dark">
              <th>{t("Session")}</th>
              <th>{t("Rate")}</th>
              <th>{t("Amount")}</th>
              <th>{t("Runs")}</th>
              <th>{t("Mode")}</th>
              <th>{t("Dec")}</th>
              {/* <th>{t("P/L")}</th> */}
            </tr>
          </thead>
          <tbody>
            {session_bet_data.map((data, i) => {
              return (
                <tr key={i}>
                  <td>{data.runner_name}  <span className="text-danger">{data.comm_perm==0?'(No Comm)':''}</span>   </td>
                  <td>{data.bhav}</td>
                  <td>{data.amount}</td>
                  <td>{data.bet_run}</td>
                  <td>{data.type}</td>
                  <td>{data.decision_run}</td>
                  {/* <td className={data.final_bet_amount  < 0 ? "text-danger" : "text-primary"}>
                      {Math.round(data.final_bet_amount)}
                    </td> */}
                </tr>
              );
            })}
            <td
              colSpan={7}
              className={`text-center ${
                totalSessionBetProfit >= 0 ? "text-primary" : "text-danger"
              }`}
            >
              {totalSessionBetProfit >= 0 ? t("YOU WON") : t("YOU LOST")}{" "}
              {totalSessionBetProfit}/- {t("coins")}.
            </td>
          </tbody>
        </Table>

        <Table className="table-responsive statement-tables">
          <thead>
            <tr>
              <th className="bg-theme-dark text-center text-white">
                {t("Match Session Plus Minus")}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                className={`text-center ${
                  matchSessionPlus > 0 ? "text-primary" : "text-danger"
                }`}
              >
                {matchSessionPlus > 0 ? t("YOU WON") : t("YOU LOST")}{" "}
                {matchSessionPlus}/-
                {t("coins")}
              </td>
            </tr>
          </tbody>
        </Table>

        <Table className="table-responsive statement-tables">
          <thead>
            <tr>
              <th className="bg-theme-dark text-center text-white">
                {t("My Commission")}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-center text-primary">
                {myTotalCommission}/- {t("coins")}
              </td>
            </tr>
          </tbody>
        </Table>

        <Table className="table-responsive statement-tables">
          <thead>
            <tr>
              <th className="bg-theme-dark text-white text-center">
                {t("Amount After Comm.")}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                className={`text-center ${
                  amountAfterComission > 0 ? "text-primary" : "text-danger"
                }`}
              >
                {amountAfterComission > 0 ? t("YOU WON") : t("YOU LOST")}{" "}
                {amountAfterComission}/- {t("coins")}.
              </td>
              {/* Match Session Plus Minus - My Commission */}
            </tr>
          </tbody>
        </Table>

        <Table className="table-responsive statement-tables">
          <thead>
            <tr>
              <th className="bg-theme-dark text-white text-center">
                {t("Mob. App. Charges")}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-center text-danger">
                {t("YOU WON")}
                {get(statement, "completegame.mobileApp", 0)}/- {t("coins")}
              </td>
            </tr>
          </tbody>
        </Table>

        <Table className="table-responsive statement-tables">
          <thead>
            <tr>
              <th className="text-center bg-theme-dark text-whit">
                {t("Net Plus Minus")}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                className={`text-center ${
                  total_profit < 0 ? "text-danger" : "text-primary"
                }`}
              >
                {total_profit < 0 ? t("YOU LOST") : t("YOU WON")} {total_profit}
                /- {t("coins")}
              </td>
            </tr>
          </tbody>
        </Table>
      </>
    );
  }
}

ViewStatement.propTypes = {
  router: shape({}),
};

export default withTranslation("rules")(ViewStatement);
