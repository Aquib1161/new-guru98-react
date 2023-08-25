import React, { createRef } from "react";
import { Button, Row, Modal, Col } from "react-bootstrap";
import { withTranslation } from "react-i18next";
import Notification from "../../components/Toast";
import InPayMatchRule from "./matchRuleContentHindi";
import tv_img from "../../assets/img/live-tv.png";
import Footer from "../Footer";
import BackToMenu from "../../components/BackToMenu";

const SESSION_TYPE = {
  fancy: "FANCY",
  session: "SESSION",
  funting: "FUNTING",
  no_comission: "NO-COMISSION",
  match: "match",
};

class OldInplay extends React.Component {
  myRef = createRef(null);
  scrollToRef = () => {
    this.myRef.current.focus();
    this.myRef.current.scrollIntoView();
    document.getElementById("AmountList").focus();
  };

  formatPlayerName = (name) => {
    const nameArr = name.split(" ");

    const firstNamePrefix = nameArr[0][0] || "";
    const lastName = nameArr.length > 1 ? nameArr[1] || "" : "";
    const score = nameArr[nameArr.length - 1] || "";

    return `${firstNamePrefix} ${lastName} ${score}`;
  };

  getLastOver = (data) => {
    if (data) {
      const details = data.split(",");

      return details.filter((detail, i) => {
        if (i < 7) return detail;
      });
    }
  };


  render() {
    const {
      state,
      setSelectedSession,
      t,
      updateBetAmount,
      placeBet,
      toggleTv,
      toggleSession,
      toggleMatchStatement,
      hideNotification,
      iframeToggle,
      score_height,
      fullScoreText,
      matchRuleModal,
      rules_modal,
      ruleTypes,
      matchType,
      closeMatchRuleModal,
    } = this.props;
    const {
      is_bet_in_process,
      session,
      selected_session,
      counter,
      stake_configs,
      match_bet_data,
      session_bet_data,
      toast,
      notification,
      score,
      plus_minus,
      team_session,
      notification_type,
      positions,
      tv_url,
      is_tv_visible,
      is_session_visible,
      is_matchStatement_visible,
      inplayNotification,
      toss_data,
      iframe_score,
    } = state;

    const ruleStyle = {
      float: "right",
      height: "24px",
      fontSize: "10px",
      cursor: "pointer",
    };



    return (
      <>
        <Notification
          isVisible={toast}
          type={notification_type || "success"}
          title="Bet Placed"
          message={notification}
          onClose={hideNotification}
        />

        <Modal
          show={rules_modal}
          onHide={closeMatchRuleModal}
          className="modal-lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {" "}
              <h2 style={{ fontWeight: "Bold", fontSize: "25px" }}>
                {" "}
                {t("Rules")}{" "}
                <span style={{ color: "red" }}>({ruleTypes}) </span>
              </h2>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <InPayMatchRule
              ruleTypes={ruleTypes}
              matchType={matchType}
            ></InPayMatchRule>
          </Modal.Body>
        </Modal>

        <main className="warp m-0">
          <table className="w-100 " style={{ marginBottom: "-4px" }}>
            {/* <marquee className="notification" style={{ marginBottom: "-8px" }}>
              Welcome To Guru98
            </marquee> */}
            <tbody className="tv ">

              <tr style={{ cursor: "pointer", background: "#03334A" }}>
                <th width="50%">
                  <div className="toggle-tv-old tv" style={{ padding: "6px" }} onClick={toggleTv}>
                    <p style={{ color: "white" }}>Dambulla Aura v Jaffna Kings 01/08/2023 15:00</p>
                    <p className="active text-left text-light m-0" id="tvBtn">
                      <img
                        src={tv_img}
                        alt=""
                        width={40}
                        height={40}
                        style={{ marginTop: "-5px" }}
                      />
                      {t("Show Tv")}
                    </p>
                  </div>
                </th>
              </tr>
            </tbody>
          </table>

          {is_tv_visible && (
            <iframe src={tv_url} title="Live Match" className="match-tv" />
          )}

          {inplayNotification && (
            <marquee className="notification" style={{ marginBottom: "-8px" }}>
              {inplayNotification}
            </marquee>
          )}

          {iframe_score ? (
            <iframe
              style={{ width: "100%" }}
              src={iframe_score}
              title="Live Match"
              className="m-0"
              height={score_height}
            />
          ) : (
            <div className="container-fluid">
              <div className="row">
                <div className="w-100 mb-0 text-center score-msg-old">
                  <span>{score?.score_msg}</span>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-5 col-5 text-center p-2">
                  <div className="scoreboard-old">
                    <strong className="m-0">{score?.p1_dtl}</strong>
                    <strong className="m-0">{score?.p2_dtl}</strong>
                    <strong className="m-0">{score?.bowler}</strong>
                  </div>
                </div>
                <div className="col-sm-7 col-7 text-center p-2">
                  <div className="scoreboard-old">
                    <strong className="m-0">{score?.t1_dtl}</strong>
                    <strong className="m-0">{score?.t2_dtl}</strong>
                    <strong className="m-0">
                      {this.getLastOver(score.last_6_balls)}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          <table className="match-bets-old table table-bordered mx-auto" style={{ padding: "6px", width: "98%" }}>
            <thead className="lgaai">
              <tr>
                <th width="40%" style={{ background: "#262436" }}>

                  <p className="m-0" style={{ fontSize: "12px", fontWeight: 700 }}>
                    {t("Team")}  Max : {stake_configs.maximum_match_bet / 1000}K
                  </p>
                </th>
                <th
                  width="20%"
                  align="center"
                  valign="middle"
                  className="FontTextWhite10px"
                  style={{ verticalAlign: "middle", background: "#262436", fontSize: "12px", fontWeight: 700 }}
                >
                  {t("stand")}
                </th>
                <th
                  width="20%"
                  align="center"
                  valign="middle"
                  className="FontTextWhite10px"
                  style={{ verticalAlign: "middle", background: "#262436", fontSize: "12px", fontWeight: 700 }}
                >
                  {t("Lagai")}
                </th>
                <th
                  width="20%"
                  align="center"
                  valign="middle"
                  className="FontTextWhite10px"
                  style={{ verticalAlign: "middle", background: "#262436", fontSize: "12px", fontWeight: 700 }}
                >
                  {t("Khai")}
                </th>
              </tr>
            </thead>
            <tbody>
              {team_session.map((data, i) => {
                return (
                  <tr>
                    <th
                      style={{ fontSize: "12px", fontWeight: 700 }}
                      className="d-flex justify-content-center align-items-center"
                    >
                      {data.team_name}
                    </th>
                    <th
                      className="text-dark text-center font-11"
                      onClick={() => {
                        Number(data.lgaai) &&
                          setSelectedSession({
                            ...data,
                            oddType: "L",
                            sessionType: SESSION_TYPE.fancy,
                          });
                        // this.scrollToRef(this.myRef);
                      }}
                    >
                      <span style={{ color: "green", fontSize: "12px", fontWeight: 700 }}> <b
                        className={`mx-2 ${positions[data.selectionid] < 0
                          ? "text-danger"
                          : ""
                          }`}
                      >
                        {String(positions[data.selectionid] || 0)}
                      </b></span>
                    </th>
                    <th style={{ background: "#6AB1F1", fontSize: "12px", fontWeight: 700 }}
                      className="text-dark text-center font-11"
                      onClick={() => {
                        Number(data.lgaai) &&
                          setSelectedSession({
                            ...data,
                            oddType: "L",
                            sessionType: SESSION_TYPE.fancy,
                          });
                        // this.scrollToRef(this.myRef);
                      }}
                    >
                      <span style={{ color: "black" }}>{data.lgaai}</span>
                    </th>
                    <th style={{ background: "#E26F7E", fontSize: "12px", fontWeight: 700 }}
                      className="text-dark font-11"
                      onClick={() => {
                        Number(data.khaai) &&
                          setSelectedSession({
                            ...data,
                            oddType: "K",
                            sessionType: SESSION_TYPE.fancy,
                          });
                        // this.scrollToRef(this.myRef);
                      }}
                    >
                      <span style={{ color: "black" }}>{data.khaai}</span>
                    </th>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {Boolean(toss_data.length) && (
            <table
              className="match-bets-old table table-bordered mx-auto"
              style={{ marginTop: "20px", width: "98%" }}
            >
              <thead className="lgaai">
                <tr>
                  <th width="46%" className="" style={{ background: "#262436", fontSize: "12px", fontWeight: 700 }}>

                    <p className="m-0">{t("Toss Book")} {stake_configs.maximum_match_bet}</p>
                  </th>
                  {toss_data.map((data) => {
                    return (
                      <th
                        width="22%"
                        align="center"
                        valign="middle"
                        bgcolor="#002D5B"
                        className="FontTextWhite10px"
                        style={{ verticalAlign: "middle", background: "#262436", fontSize: "12px", fontWeight: 700 }}
                      >
                        {data.team_name}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th className="d-flex justify-content-center align-items-center" style={{ fontSize: "12px", fontWeight: 700 }}>
                    Who Will Win The Toss
                  </th>
                  {toss_data.map((data, i) => {
                    return (
                      <th
                        className=" text-center font-11" style={{ background: "#E26F7E", fontSize: "12px", fontWeight: 700 }}
                        onClick={() => {
                          Number(data.lgaai) &&
                            setSelectedSession({
                              ...data,
                              oddType: "L",
                              sessionType: SESSION_TYPE.fancy,
                            });
                          // this.scrollToRef();
                        }}
                      >
                        <span style={{ color: "black" }}>{data.lgaai}</span>
                      </th>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          )}

          <table
            className="match-bets-old table table-bordered mx-auto"
            style={{ marginTop: "20px", width: "98%" }}
          >
            <thead className="lgaai">
              <tr>
                <th
                  width="46%"
                  height={35}
                  align="center"
                  valign="middle"
                  className="FontTextWhite10px"
                  style={{ verticalAlign: "middle", background: "#262436", fontSize: "12px", fontWeight: 700 }}
                >
                  {t("Session")}&nbsp;&nbsp;&nbsp;
                </th>
                <th
                  width="22%"
                  align="center"
                  valign="middle"
                  className="FontTextWhite10px"
                  style={{ verticalAlign: "middle", background: "#262436", fontSize: "12px", fontWeight: 700 }}
                >
                  {t("NoT")}
                </th>
                <th
                  width="22%"
                  align="center"
                  valign="middle"
                  className="FontTextWhite10px "
                  style={{ verticalAlign: "middle", background: "#262436", fontSize: "12px", fontWeight: 700 }}
                >
                  {t("Yes")}
                </th>
              </tr>
            </thead>
            <tbody style={{ padding: "0.1 rem !important" }}>
              {session.map((data, key) => {
                if (data.com_perm === "NO") return;
                return (
                  <>
                    <tr key={key} style={{ padding: "-100px" }}>
                      <th style={{ fontSize: "10px", fontWeight: 700 }}>
                        {data.session_name}
                        <br />
                        <p className="textColor m-0" style={{ fontSize: "8px", fontWeight: 700, color: "#DC143C" }}>
                          Session Limit :{" "}
                          {data.max / 1000 + "K" ||
                            stake_configs.maximum_session_bet / 1000 + "K"}
                        </p>
                      </th>
                      <>
                        <th
                          className="text-dark font-11" style={{ background: "#6AB1F1", fontSize: "12px", fontWeight: 700 }}
                          onClick={() => {
                            Number(data.oddsNo) &&
                              setSelectedSession({
                                ...data,
                                oddType: "N",
                                sessionType: SESSION_TYPE.session,
                              });
                            // this.scrollToRef(this.myRef);
                          }}
                        >
                          <span style={{ color: "black" }}>{data.runsNo}</span>
                          <br />
                          <small style={{ color: "black" }}>{data.oddsNo}</small>
                        </th>
                        <th
                          className="text-dark font-11" style={{ background: "#E26F7E", fontSize: "12px", fontWeight: 700 }}
                          onClick={() => {
                            Number(data.oddsYes) &&
                              setSelectedSession({
                                ...data,
                                oddType: "Y",
                                sessionType: SESSION_TYPE.session,
                              });
                            // this.scrollToRef(this.myRef);
                          }}
                        >
                          <span style={{ color: "black" }}>{data.runsYes}</span>
                          <br />
                          <small style={{ color: "black" }}>
                            {data.oddsYes}
                          </small>
                        </th>
                      </>
                    </tr>
                    {data.remark && (
                      <>
                        <tr
                          style={{
                            color: "red",
                            fontWeight: "bold",
                            textAlign: "left",
                            border: "none",
                          }}
                        >
                          <th colSpan={12}>{data.remark}</th>
                        </tr>
                      </>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>

          {/* <table
            className="match-bets-old table table-bordered"
            style={{ marginTop: "-20px" }}
          >
            <thead className="lgaai">
              <tr>
                <th
                  width="46%"
                  height={35}
                  align="center"
                  valign="middle"
                  className="FontTextWhite10px"
                  style={{ verticalAlign: "middle" }}
                >
                  {t("No Comm Session")}&nbsp;&nbsp;&nbsp;
                </th>
                <th
                  width="22%"
                  align="center"
                  valign="middle"
                  className="FontTextWhite10px"
                  style={{ verticalAlign: "middle" }}
                >
                  {t("NoT")}
                </th>
                <th
                  width="22%"
                  align="center"
                  valign="middle"
                  className="FontTextWhite10px "
                  style={{ verticalAlign: "middle" }}
                >
                  {t("Yes")}
                </th>
              </tr>
            </thead>
            <tbody style={{ padding: "0.1 rem !important" }}>
              {session.map((data, key) => {
                if (data.com_perm === "YES") return;
                return (
                  <>
                    <tr key={key} style={{ padding: "-100px" }}>
                      <th style={{ fontSize: "11px" }}>
                        {data.session_name}
                        <br />
                        <p className="textColor m-0">
                          Session Limit :{" "}
                          {data.max / 1000 + "K" ||
                            stake_configs.maximum_session_bet / 1000 + "K"}
                        </p>
                      </th>
                      <>
                        <th
                          className="text-dark font-11"
                          onClick={() => {
                            Number(data.oddsNo) &&
                              setSelectedSession({
                                ...data,
                                oddType: "N",
                                sessionType: SESSION_TYPE.session,
                              });
                            // this.scrollToRef(this.myRef);
                          }}
                        >
                          <span style={{ color: "red" }}>{data.runsNo}</span>
                          <br />
                          <small style={{ color: "red" }}>{data.oddsNo}</small>
                        </th>
                        <th
                          className="text-dark font-11"
                          onClick={() => {
                            Number(data.oddsYes) &&
                              setSelectedSession({
                                ...data,
                                oddType: "Y",
                                sessionType: SESSION_TYPE.session,
                              });
                            // this.scrollToRef(this.myRef);
                          }}
                        >
                          <span style={{ color: "blue" }}>{data.runsYes}</span>
                          <br />
                          <small style={{ color: "blue" }}>
                            {data.oddsYes}
                          </small>
                        </th>
                      </>
                    </tr>
                    {data.remark && (
                      <>
                        <tr
                          style={{
                            color: "red",
                            fontWeight: "bold",
                            textAlign: "left",
                            border: "none",
                          }}
                        >
                          <th colSpan={12}>{data.remark}</th>
                        </tr>
                      </>
                    )}
                  </>
                );
              })}
            </tbody>
          </table> */}

          {/* <table
            className="table-bordered score-msg-old text-dark table text-center"
            style={{ marginTop: "-10px" }}
          >
            <tbody>
              <tr>
                <th ref={this.myRef} id="amount">
                  AMOUNT
                </th>
                <th>
                  <input
                    id="AmountList"
                    value={selected_session.amount || ""}
                    style={{
                      width: "120px",
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: "15px",
                    }}
                    onChange={(e) =>
                      updateBetAmount(e.target.value, selected_session.max)
                    }
                    type="number"
                  />
                </th>
                <th>{!Object.keys(selected_session).length ? 0 : counter}</th>
                <th>
                  <button
                    disabled={
                      is_bet_in_process || !Object.keys(selected_session).length
                    }
                    onClick={placeBet}
                    className={`btn btn-transparent font-weight-bold ${
                      is_bet_in_process || !Object.keys(selected_session).length
                        ? "text-light"
                        : "text-dark"
                    }`}
                    style={{ fontWeight: 800, fontSize: "11px" }}
                  >
                    Done
                  </button>
                </th>
              </tr>
            </tbody>
          </table> */}


          <div style={{ width: "98%", }} className="p-0 text-center mt-4 mx-auto" onClick={toggleSession}>
            <h5 style={{ borderTopRightRadius: 10, borderTopLeftRadius: 10 }} className=" profile-title">{t("SESSION STATEMENT")}</h5>
          </div>

          {is_session_visible && (
            <div className=" mx-auto mt-3" style={{ width: "98%", borderBottomRightRadius: 10, borderBottomLeftRadius: 10 }}>
              <table
                style={{ marginTop: "-20px" }}
                width="100%"
                border={0}
                cellPadding={2}
                cellSpacing={2}
                className="old-match-bets text-center"
              >
                <tbody>
                  <tr className="text-white table-bordered ">
                    <th
                      height={25}
                      align="center"
                      valign="middle"
                      className="FontTextWhite10px lgaai"
                    >
                      {t("Sr")}.
                    </th>
                    <th
                      align="right"
                      valign="middle"
                      className="FontTextWhite10px lgaai"
                    >
                      {" "}
                      {t("Rate")}
                    </th>
                    <th
                      align="right"
                      valign="middle"
                      className="FontTextWhite10px lgaai"
                    >
                      {t("Amount")}
                    </th>
                    <th
                      align="center"
                      valign="middle"
                      className="FontTextWhite10px lgaai"
                    >
                      {" "}
                      {t("Mode")}
                    </th>
                    <th
                      align="left"
                      valign="middle"
                      className="FontTextWhite10px lgaai"
                    >
                      {t("Team")}
                    </th>
                  </tr>
                  {match_bet_data.map((bet, i) => {
                    return (
                      <tr
                        class="text-black table-bordered "
                        style={{
                          border: "1px solid black",
                          borderCollapse: "collapse",
                        }}
                      >
                        <th>{i + 1}</th>
                        <th>{bet.bhav}</th>
                        <th>{bet.amount}</th>
                        <th>{bet.type}</th>
                        {/* <th>{bet.time_inserted}</th> */}
                        <th>{bet.team_name}</th>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}


          <div style={{ width: "98%", }} className="p-0 text-center mt-4 mx-auto" onClick={toggleMatchStatement}>
            <h5 style={{ borderTopRightRadius: 10, borderTopLeftRadius: 10 }} className=" profile-title">{t("Match STATEMENT")}</h5>
          </div>
          {is_matchStatement_visible && (
            <div className="table-responsive mx-auto mt-2" style={{ width: "98%", borderBottomRightRadius: 10, borderBottomLeftRadius: 10 }}>
              <table
                width="100%"
                className="old-match-bets"
                border={0}
                cellSpacing={2}
                cellPadding={2}
              >
                <thead>
                  <tr className="text-white">
                    <th
                      height={25}
                      align="center"
                      className="FontTextWhite10px lgaai"
                    >
                      {t("Sr")}.
                    </th>
                    <th align="left" className="FontTextWhite10px lgaai">
                      {t("Session")}
                    </th>
                    <th
                      align="right"
                      valign="middle"
                      className="FontTextWhite10px lgaai"
                    >
                      {t("Rate")}
                    </th>
                    <th
                      align="right"
                      valign="middle"
                      className="FontTextWhite10px lgaai"
                    >
                      {t("Amount")}
                    </th>
                    <th align="right" className="FontTextWhite10px lgaai">
                      {t("Run")}
                    </th>
                    <th align="center" className="FontTextWhite10px lgaai">
                      {t("Mode")}
                    </th>
                    <th align="center" className="FontTextWhite10px lgaai">
                      {t("Dec")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {session_bet_data.map((bet, i) => {
                    return (
                      <tr
                        class="text-black table-bordered "
                        style={{
                          border: "1px solid black",
                          borderCollapse: "collapse",
                        }}
                      >
                        <th>{i + 1}</th>
                        <th>{bet.runner_name}</th>
                        <th>{bet.bhav}</th>
                        <th>{bet.amount}</th>
                        <th>{bet.bet_run}</th>
                        <th>{bet.type}</th>
                        <th>{bet.decision_run || t("No")}</th>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </main>

        <BackToMenu buttonClass="mt-4 btn  w-100 back-btn"></BackToMenu>

        <Footer></Footer>
      </>
    );
  }
}

export default withTranslation("rules")(OldInplay);
