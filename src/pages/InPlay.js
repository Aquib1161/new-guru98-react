import React from "react";
import { connect } from "react-redux";
import io from "socket.io-client";
import moment from "moment";
import { compose } from "redux";
import { func } from "prop-types";
import { useOutletContext, useOutlet } from "react-router-dom";
import {
  Table,
  Modal,
  Button,
  Container,
  Row,
  Col,
  FormControl,
  InputGroup,
} from "react-bootstrap";

import { withTranslation } from "react-i18next";
import { get, isNull } from "lodash";

import { betPrices } from "../utils/configs";
import { httpPost } from "../utils/http";

import Notification from "../components/Toast";

import Bat from "../assets/img/cricket-bat.png";
import Ball from "../assets/img/cricket-ball.png";
import { setUserBalance } from "../modules/user/actions";
import Loader from "../components/Loader";
import TVIcon from "../assets/img/tv.png";

import OldInplay from "./old-theme/OldInplay";
import axios from "axios";
import { SOCKET_URL } from "../utils/configs";

const SESSION_TYPE = {
  fancy: "FANCY",
  session: "SESSION",
  funting: "FUNTING",
  no_comission: "NO-COMISSION",
  match: "match",
};

const TABS = (t) => [t("Match Bets"), t("Session Bets")];
const THEMES = ["OLD", "NEW"];
const DEFAULT_TIME = 7;

class InPlay extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      is_fetching: false,
      is_no_commm: true,
      match_id: 0,
      team_data: [],
      session: [],
      selected_session: {},
      team_session: [],
      slip_modal: false,
      counter: DEFAULT_TIME,
      stake_configs: {},
      coin_options: betPrices,
      active_tab: TABS[0],
      match_bet_data: [],
      session_bet_data: [],
      api_hit_time: 3,
      notification: "",
      toast: false,
      inplayNotification: "",
      exposure: 0,
      plus_minus: 0,
      notification_type: "success",
      positions: [],
      socket_perm: 0,
      tv_url: false,
      is_tv_visible: false,
      bet_delay: 0,
      is_betting: false,
      is_api_calling: false,
      is_bet_in_process: false,
      api_hit_url: false,
      toss_data: [],
      iframe_score: null,
      score: {
        last_6_balls: "",
        balls_array: [],
        last_boll_result: "",
        p1_dtl: "",
        player1_array: [],
        player2_array: [],
        p2_dtl: "",
        b_dtl: "",
        t1_dtl: "",
        t2_dtl: "",
        img_path: "",
        score_msg: "",
        converted_cb: "",
        cb: "",
        run_rate: "",
        bowler: "",
        Status: "",
      },
      score_height: 135,
      fullScoreText: "Full Score",
      rules_modal: false,
      matchType: "Cricket",
      ruleTypes: "BookMaker",
    };

    this.interval = "";

    this.scoreSocket = "";
  }

  componentDidMount() {
    const urlParams = new URLSearchParams(window.location.search);
    const key = urlParams.get("id");
    this.setState({ match_id: key }, () => {
      this.getMatchConfigs(this.checkIfUserOpennedMatchBefore(key));
    });

    // this.scoreSocket = io("https://scoresocket.sixpro.in:8080");

    // this.scoreSocket.emit("join", key);
    // this.scoreSocket.on("score_update", (data) => {
    //   this.setState({ score: data });
    // });

    // this.scoreSocket.on("takeup_score", (data) => {
    //   this.setState({ score: data.board });
    // });

    // this.scoreSocket.on("disconnect", () => {
    //   this.scoreSocket = io("https://scoresocket.sixpro.in:8080");
    // });
  }

  componentDidUpdate(prevProps, prevState) {
    const { slip_modal } = this.state;

    if (prevState.slip_modal !== slip_modal) {
      this.setState({ is_betting: slip_modal });
    }
  }

  checkIfUserOpennedMatchBefore = (market_id) => {
    // let loggedMatches = localStorage.getItem("opened-matches");
    // loggedMatches = loggedMatches ? JSON.parse(loggedMatches) : [];

    const isOpened =
      localStorage.getItem(market_id) &&
      localStorage.getItem(market_id + "match_bets") &&
      localStorage.getItem(market_id + "session_bets");

    // const isOpened = loggedMatches.indexOf(market_id) !== -1;

    if (!isOpened) this.updateOppenedMatches(market_id);

    return isNull(isOpened) ? false : true;
  };

  updateOppenedMatches = (market_id) => {
    let loggedMatches = localStorage.getItem("opened-matches");
    loggedMatches = loggedMatches ? JSON.parse(loggedMatches) : [];

    loggedMatches = JSON.stringify([...loggedMatches, market_id]);

    localStorage.setItem("opened-matches", loggedMatches);
  };

  positions = (team_data) => {
    var a = 0;
    var array = new Array();
    while (a < team_data.length) {
      array[team_data[a].selection_id] = Math.round(team_data[a].total_profit);
      a++;
    }

    return array;
  };

  getMatchConfigs = async (already_logged) => {
    this.setState({ is_fetching: true });
    try {
      const result = await httpPost("bet_match_details", {
        market_id: this.state.match_id,
        already_logged,
      });

      if (result.status === "error") {
        this.setState({ is_fetching: false });
        return;
      }

      const stake_configs = JSON.parse(
        get(result, "match_data[0].coins_setting", "{}")
      );
      const team_data = get(result, "match_team_position", []);
      const coin_options = get(result, "coins_bet_array", []);
      const match_bet_data = get(result, "match_bet_data", []);
      const session_bet_data = get(result, "session_bet_data", []);
      const api_hit_time = get(result, "api_hit_time", 3);
      const exposure = get(result, "exposure", 0);
      await this.setExposureLocal();
      const plus_minus = get(result, "session_position", 0);
      const tv_url = get(result, "tv_url", 0);
      const socket_perm = Number(get(result, "match_data[0].socket_perm", "0"));
      const bet_delay = Number(
        get(result, "match_data[0].bet_delay_time", "0")
      );
      const status = get(result, "match_data[0].status", "0");
      const total_coins = get(result, "total_coins", "0");
      const inplayNotification = get(result, "notification", ""); //get(result, "notification", '');
      const api_hit_url = get(result, "api_hit_url", false);
      const api_data = get(result, "match_data[0].api_data", {});
      const iframe_score = get(result, "iframe_score", null);

      this.updateLocalStore(total_coins);

      // if (status !== "INPLAY") {
      //   window.location.href = "/in-play";
      // }

      this.setOddsOnLoad(api_data);

      if (socket_perm) {
        // this.socket = io("https://socket.sixpro.in:8080/");
        // this.socket.emit("join", this.state.match_id);
        this.connectSocket();
      }

      this.setState(
        {
          counter: result.counter,
          stake_configs,
          team_data,
          coin_options,
          match_bet_data,
          session_bet_data,
          api_hit_time,
          exposure,
          plus_minus,
          positions: this.positions(team_data),
          socket_perm,
          is_fetching: false,
          tv_url,
          bet_delay,
          inplayNotification,
          api_hit_url,
          iframe_score,
        },
        async () => {
          await this.getMatchData();
          const { match_id } = this.state;
          // if (this.checkIfUserOpennedMatchBefore(match_id)) {
          //   this.updateMatchPosition();

          //   const matchBets =
          //     localStorage.getItem(`${match_id}match_bets`) || "[]";
          //   const sessionBets =
          //     localStorage.getItem(`${match_id}session_bets`) || "[]";

          //   this.setState({
          //     match_bet_data: JSON.parse(matchBets),
          //     session_bet_data: JSON.parse(sessionBets),
          //   });
          // } else {
          // this.updateMatchPosition({ result: { position: { team_data } } });
          this.setState({
            match_bet_data,
            session_bet_data,
          });
          localStorage.setItem(
            `${match_id}match_bets`,
            JSON.stringify(match_bet_data)
          );
          localStorage.setItem(
            `${match_id}session_bets`,
            JSON.stringify(session_bet_data)
          );
          // }
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  setExposureLocal = async () => {
    localStorage.setItem("exposure", this.state.exposure);
    localStorage.setItem("plus_minus", this.state.plus_minus);
  };

  setOddsOnLoad = (api_data) => {
    const data = JSON.parse(api_data || "{}");
    const result = get(data, "result", {});

    this.setState({
      session: result.session,
      score: result.score,
      team_session: result.team_data.map(
        ({ lgaai, khaai, selectionid, team_name }) => {
          return { lgaai, khaai, selectionid, team_name };
        }
      ),
      toss_data: result.toss_data,
    });
  };

  connectSocket = () => {
    this.socket = io.connect(SOCKET_URL);
    this.socket.emit("JoinRoom", this.state.match_id);
  };

  getMatchData = async () => {
    const { match_id, socket_perm } = this.state;

    if (socket_perm) {
      this.socket.on(this.state.match_id, (msg) => {
        var SocketData = JSON.parse(msg);
        const result = get(SocketData, "result", {});
        this.setState({
          session: result.session,
          score: result.score,
          team_session: result.team_data.map(
            ({ lgaai, khaai, selectionid, team_name }) => {
              return { lgaai, khaai, selectionid, team_name };
            }
          ),
          toss_data: result.toss_data,
        });
      });
      this.socket.on("disconnect", this.connectSocket);
      return;
    } else {
      try {
        const { is_betting, is_api_calling, api_hit_time, api_hit_url } =
          this.state;

        // if (is_betting) return;

        const result = await (await axios.get(api_hit_url)).data;

        this.setState(
          {
            is_api_calling: false,
            session: result.result.session,
            score: result.result.score,
            team_session: result.result.team_data.map(
              ({ lgaai, khaai, selectionid, team_name }) => {
                return { lgaai, khaai, selectionid, team_name };
              }
            ),
            toss_data: result.result.toss_data,
          },
          () => {
            setTimeout(() => {
              this.getMatchData();
            }, (api_hit_time || 2) * 1000);
          }
        );

        return;
      } catch (e) {
        setTimeout(() => {
          this.getMatchData();
        }, 2000);

        console.error(e);
      }
    }
  };

  setSelectedSession = (session) => {
    clearInterval(this.interval);
    this.setState(
      {
        selected_session: session,
        slip_modal: true,
        counter: DEFAULT_TIME,
      },
      () => {
        this.interval = setInterval(() => {
          const { counter } = this.state;
          if (!counter) {
            this.setState({ selected_session: {}, slip_modal: false });
            return;
          }
          this.setState({ counter: counter - 1 });
        }, 1000);
      }
    );
  };

  updateBetAmount = (amount, max) => {
    amount = Number(amount);
    const { selected_session } = this.state;
    this.setState({ selected_session: { ...selected_session, amount } });
  };

  toggleSlipModal = () => {
    const { slip_modal } = this.state;

    this.setState({
      slip_modal: !slip_modal,
      counter: DEFAULT_TIME,
    });
  };

  lossSection = (value) => {
    return (
      <>
        <label>{this.props.t("Loss")}</label>
        <p className="text-danger">{value}</p>
      </>
    );
  };

  profitSection = (value) => {
    return (
      <>
        <label>Profit</label>
        <p className="text-success">{value}</p>
      </>
    );
  };

  toggleActiveTab = (tab) => {
    this.setState({ active_tab: tab });
  };

  transformMatchData = (session) => {
    const { match_id, stake_configs, match_bet_data } = this.state;

    if (session.amount > Number(stake_configs.maximum_match_bet)) {
      alert(`Maximum bet amount allowed is ${stake_configs.maximum_match_bet}`);
      this.setState({ is_bet_in_process: false });
      return;
    }

    const accessToken = localStorage.getItem("access-token");
    const data = {
      market_id: match_id,
      datatype: SESSION_TYPE.match,
      bhav: session.oddType === "L" ? session.lgaai : session.khaai,
      runnername: session.team_name,
      run: "0",
      type: session.oddType,
      team_name: session.team_name,
      amount: session.amount,
      selectionid: session.selectionid,
      user_id: accessToken,
      is_match_bet_placed: match_bet_data.length,
      is_toss: session.is_toss,
    };

    return data;
  };

  transformSessionData = (session) => {
    const { match_id, stake_configs, session_bet_data } = this.state;

    const maxBet = session.max || stake_configs.maximum_session_bet;

    if (session.amount > Number(maxBet)) {
      alert(`Maximum bet amount allowed is ${session.max}`);

      this.setState({ is_bet_in_process: false });
      return false;
    }

    const accessToken = localStorage.getItem("access-token");
    const data = {
      market_id: match_id,
      datatype: SESSION_TYPE.session,
      bhav: session.oddType === "Y" ? session.oddsYes : session.oddsNo,
      runnername: session.session_name,
      run: session.oddType === "Y" ? session.runsYes : session.runsNo,
      type: session.oddType,
      team_name: session.session_name,
      amount: session.amount,
      selectionid: session.Selection_id,
      user_id: accessToken,
      is_session_bet_placed: session_bet_data.length,
      comm_perm: session.comm_perm,
    };

    return data;
  };

  transformAddMatchBet = (bet) => {
    return {
      amount: bet.amount,
      bhav: bet.oddType === "L" ? bet.lgaai : bet.khaai,
      client_name: "",
      team_name: bet.team_name,
      time_inserted: moment().format("DD-MM-yyyy hh:mm:ss"),
      type: bet.oddType,
    };
  };

  transformAddSessionBet = (bet) => {
    return {
      amount: bet.amount,
      bhav: bet.oddType === "N" ? bet.oddsNo : bet.oddsYes,
      decision_run: "",
      runner_name: bet.session_name,
      bet_run: bet.oddType === "N" ? bet.runsNo : bet.runsYes,
      type: bet.oddType,
    };
  };

  transformAddSessionBetToss = (bet) => {
    return {
      amount: bet.amount,
      bhav: bet.oddType === "L" ? "1" : "1",
      decision_run: "",
      runner_name: bet.team_name,
      bet_run: bet.oddType === "L" ? bet.lgaai : 0,
      type: "Y",
    };
  };

  placeBet = async () => {
    const { balance } = this.props;

    if (balance < 0) {
      this.setState({
        toast: true,
        notification: "Invalid Coins",
        slip_modal: false,
        notification_type: "danger",
      });
      return;
    }

    const { selected_session, match_id } = this.state;
    let { session_bet_data, match_bet_data } = this.state;

    this.setState({ is_bet_in_process: true });

    let postData = {};
    if (selected_session.sessionType === SESSION_TYPE.fancy) {
      postData = this.transformMatchData({ ...selected_session });
    } else if (selected_session.sessionType === SESSION_TYPE.session) {
      postData = this.transformSessionData({ ...selected_session });
    }

    console.log(postData);

    if (!postData) {
      return;
    }

    if (postData.amount === undefined) {
      alert("Please Insert Amount");
      this.setState({
        is_bet_in_process: false,
      });
      return false;
    }

    const result = await httpPost("SaveBet", postData);

    if (result.result.status === "OK") {
      let is_toss = false;
      if (result.result.is_toss) {
        is_toss = result.result.is_toss;
      }
      if (selected_session.sessionType === SESSION_TYPE.fancy && !is_toss) {
        const newMatchSessions = [
          this.transformAddMatchBet(selected_session),
        ].concat(match_bet_data);

        this.setState(
          {
            match_bet_data: newMatchSessions,
            selected_session: {},
          },
          () => {
            localStorage.setItem(
              `${match_id}match_bets`,
              JSON.stringify(newMatchSessions)
            );
          }
        );

        this.updateMatchPosition(result);
        // Navigator.vibrate(200);
      }

      if (selected_session.sessionType === SESSION_TYPE.session || is_toss) {
        let newSessions;
        if (is_toss) {
          newSessions = [
            this.transformAddSessionBetToss(selected_session),
          ].concat(session_bet_data);
        } else {
          newSessions = [this.transformAddSessionBet(selected_session)].concat(
            session_bet_data
          );
        }

        this.setState(
          {
            session_bet_data: newSessions,
            selected_session: {},
          },
          () => {
            localStorage.setItem(
              `${match_id}session_bets`,
              JSON.stringify(newSessions)
            );
          }
        );
      }

      this.setState({
        toast: true,
        notification: result.result.msg,
        slip_modal: false,
        exposure: result.result.exposure,
        notification_type: "success",
        is_bet_in_process: false,
      });

      // setUserBalance(result.result.total_coins);
      this.updateLocalStore(result.result.total_coins);
    } else {
      this.setState({
        toast: true,
        notification: result.result.msg,
        slip_modal: false,
        notification_type: "danger",
        is_bet_in_process: false,
      });
    }

    // setTimeout(() => {
    //   this.setState({ slip_modal: false });
    // }, 1000);
  };

  getLastOver = (data) => {
    const details = data.split(",");

    return details.filter((detail, i) => {
      if (i < 7) return detail;
    });
  };

  updateLocalStore = (coins) => {
    const userDetails = JSON.parse(localStorage.getItem("user-data"));

    userDetails.data.total_coins = coins;
    this.props.setUserBalance(coins);
    localStorage.setItem("user-data", JSON.stringify(userDetails));
  };

  getValueInitials = (value) => {
    if (parseInt(value) || parseInt(value) == 0) return value;
    let rgx = new RegExp(/(\p{L}{1})\p{L}+/, "gu");

    let initials = [...value.matchAll(rgx)] || [];

    return (
      (initials.shift()?.[1] || "") + (initials.pop()?.[1] || "")
    ).toUpperCase();
  };

  formatPlayerName = (name) => {
    const nameArr = name.split(" ");

    const firstNamePrefix = nameArr[0][0] || "";
    const lastName = nameArr.length > 1 ? nameArr[1] || "" : "";
    const score = nameArr[nameArr.length - 1] || "";

    return `${firstNamePrefix} ${lastName} ${score}`;
  };

  getLast6Formatter = (value, key) => {
    // value = this.getValueInitials(value);
    switch (value) {
      case "NB":
      case "W":
      case "WW":
        return (
          <span key={key} className="bg-danger">
            {value}
          </span>
        );

      case 4:
      case 6:
        return (
          <span key={key} className="bg-success">
            {value}
          </span>
        );

      case "wd":
      case "WD":
      case "wd1":
      case "wd4":
        return (
          <span key={key} className="bg-warning">
            {value}
          </span>
        );

      case 0:
      case 1:
      case 2:
      case 3:
        return (
          <span key={key} className="bg-primary">
            {value}
          </span>
        );

      default:
        return (
          <span key={key} className="bg-primary">
            {value}
          </span>
        );
    }
  };

  updateMatchPosition = async (betResponse = null) => {
    try {
      const { match_id } = this.state;
      let matchData = localStorage.getItem(match_id);
      matchData = matchData ? JSON.parse(matchData) : {};

      const newPosition = betResponse
        ? betResponse.result.position
        : matchData.position.team_data;

      this.setState(
        { positions: this.positions(newPosition), team_data: newPosition },
        () => {
          localStorage.setItem(
            match_id,
            JSON.stringify({
              ...matchData,
              position: newPosition,
            })
          );
        }
      );
    } catch (err) {
      console.error("Error", err);
    }
  };

  toggleTv = () => {
    const { is_tv_visible } = this.state;

    this.setState({ is_tv_visible: !is_tv_visible });
  };
  toggleSession = () => {
    const { is_session_visible } = this.state;

    this.setState({ is_session_visible: !is_session_visible });
  };
  toggleMatchStatement = () => {
    const { is_matchStatement_visible } = this.state;

    this.setState({ is_matchStatement_visible: !is_matchStatement_visible });
  };

  hideNotification = () => {
    this.setState({ toast: false });
  };

  setOldTheme = () => {
    localStorage.setItem("is_old_theme", true);
  };

  setNewTheme = () => {
    localStorage.setItem("is_old_theme", false);
  };

  /*
   *@Auther: Birendra
   *Description: The function use hide & show for iframe full screen.
   */
  iframeToggle = () => {
    if (this.state.score_height == 135) {
      this.setState({ score_height: 250 });
      this.setState({ fullScoreText: "Half Score" });
    } else {
      this.setState({ score_height: 135 });
      this.setState({ fullScoreText: "Full Score" });
    }
  };

  matchRuleModal = (e) => {
    const matchTypeButton = e.target.id;
    const { rules_modal } = this.state;
    const { ruleTypes } = this.state;
    this.setState({ ruleTypes: matchTypeButton });
    this.setState({ rules_modal: !rules_modal });
  };

  closeMatchRuleModal = () => {
    const { rules_modal } = this.state;
    this.setState({ rules_modal: !rules_modal });
  };

  render() {
    const {
      session,
      slip_modal,
      selected_session,
      counter,
      stake_configs,
      coin_options,
      active_tab,
      match_bet_data,
      session_bet_data,
      toast,
      notification,
      inplayNotification,
      score,
      exposure,
      plus_minus,
      team_session,
      notification_type,
      positions,
      is_fetching,
      tv_url,
      is_tv_visible,
      is_session_visible,
      is_matchStatement_visible,
      is_bet_in_process,
      iframe_score,
    } = this.state;
    const { t } = this.props;

    const isOld = localStorage.getItem("is_old_theme") === "true";
    return (
      <>
        {/* <div className="exposure" style={{ marginTop: "-65px" }}>
          <center>
            <b>Used Coins : {exposure}</b>
          </center>
          <b>
            P/M:{" "}
            <span className={plus_minus >= 0 ? "text-white" : "text-danger"}>
              {plus_minus}/-
            </span>
          </b>
        </div> */}

        {/* <div className="statement-tabs inplay">
          <Button
            className={
              !isOld ? "bg-primary text-white" : "bg-white text-primary"
            }
            onClick={this.setNewTheme}
          >
            {t("New Theme")}
          </Button>
          <Button
            className={
              isOld ? "bg-primary text-white" : "bg-white text-primary"
            }
            onClick={this.setOldTheme}
          >
            {t("Old Theme")}
          </Button>
        </div> */}

        {selected_session.sessionType === SESSION_TYPE.session && (
          <Modal
            show={slip_modal}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onHide={() => this.setState({ slip_modal: !slip_modal })}
            className="bet-modal"
            style={{ backgroundCOlor: "black", }}
          >
            {is_bet_in_process && <Loader />}
            {/* <a
              className="close-modal"
              onClick={() => this.setState({ slip_modal: !slip_modal })}
            >
              {t("CLOSE")}
            </a> */}
            <Modal.Body>
              <Container className={`${selected_session.oddType == "N" ? "bet-strip-session-blue" : "bet-strip-session-pink"}`}>
                {/* <Row className="bet-strip text-white">
                  <Col xs={12}>
                    <h6>Placed Betddddddd</h6>
                  </Col>
                </Row> */}

                <Row >
                  <Col xs={12}>
                    {/* <label>Session</label> */}
                    <p>{selected_session.session_name == "N"
                      ? selected_session.oddsNo
                      : selected_session.oddsYes}</p>
                  </Col>
                  {/* <Col xs={3}>
                    <label>Rate</label>
                    <p>
                      {selected_session.oddType == "N"
                        ? selected_session.oddsNo
                        : selected_session.oddsYes}
                    </p>
                  </Col>
                  <Col xs={3}>
                    <label>Mode</label>
                    <p>{selected_session.oddType}</p>
                  </Col> */}
                </Row>
                <Row>
                  <Col xs={12}>
                    <InputGroup className="mt-3 px-2">
                      <FormControl
                        type="Number"
                        placeholder="COINS"
                        onChange={(e) => {
                          this.updateBetAmount(
                            e.target.value,
                            selected_session.max ||
                            stake_configs.maximum_session_bet
                          );
                        }}
                        max={
                          selected_session.max ||
                          stake_configs.maximum_session_bet
                        }
                        value={selected_session.amount || ""}
                      />
                      <InputGroup.Text
                        id="basic-addon3"
                        className="bg-danger text-white"
                      >
                        <p>{counter}</p>
                      </InputGroup.Text>
                    </InputGroup>
                  </Col>
                </Row>
                <Row className="my-3">
                  <Col
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    className="bet-price-btns"
                  >
                    {coin_options.map((price, i) => {
                      return (
                        <Button
                          key={i}
                          className="bet-price-btn"
                          onClick={() =>
                            this.updateBetAmount(
                              price.value,
                              selected_session.max ||
                              stake_configs.maximum_match_bet
                            )
                          }
                        >
                          {price.label.replace("k", "000").replace("K", "000")}
                        </Button>
                      );
                    })}
                  </Col>
                </Row>
                <div className="row m-2">
                  <div className="col-6">
                    <Button style={{ background: "#ff0000", color: "white", height: 60 }}
                      className="w-100 m-0"
                      variant="contained"
                      onClick={this.placeBet}
                    >
                      Cencel
                    </Button>
                  </div>

                  <div className="col-6">
                    <Button style={{ background: "#008000", color: "white", height: 60 }}
                      className="w-100 m-0"
                      variant="contained"
                      onClick={this.placeBet}
                    >
                      Place Bet
                    </Button>
                  </div>
                </div>
              </Container>
            </Modal.Body>
          </Modal>
        )}

        {selected_session.sessionType === SESSION_TYPE.fancy && (
          <>
            <Modal
              show={slip_modal}
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered
              onHide={() => this.setState({ slip_modal: !slip_modal })}
              className="bet-modal" style={{}}
            >
              {is_bet_in_process && <Loader />}
              {/* <a
                className="close-modal"
                onClick={() => this.setState({ slip_modal: !slip_modal })}
              >
                {t("Cancel")}
              </a> */}
              <Modal.Body>
                <Container className={`${selected_session.oddType == "L" ? "bet-strip-session-blue" : "bet-strip-session-pink"}`}>
                  {/* <Row className="bet-strip text-white">
                    <Col xs={12}>
                      <h6>Placed Bet121212</h6>
                    </Col>
                  </Row> */}
                  <Row >
                    <Col xs={12}>
                      {/* <label>Team</label> */}
                      <p>{selected_session.team_name == "L"
                        ? selected_session.lgaai
                        : selected_session.khaai}</p>
                    </Col>
                    {/* <Col xs={3}>
                      <label>Rate</label>
                      <p>
                        {selected_session.oddType == "L"
                          ? selected_session.lgaai
                          : selected_session.khaai}
                      </p>
                    </Col>
                    <Col xs={3}>
                      <label>Mode</label>
                      <p>{selected_session.oddType}</p>
                    </Col> */}
                  </Row>
                  <Row>
                    <Col xs={12}>
                      <InputGroup className="mt-3 mx-2">
                        <FormControl
                          type="Number"
                          placeholder="Amount"
                          onChange={(e) => {
                            this.updateBetAmount(
                              e.target.value,
                              stake_configs.maximum_match_bet
                            );
                          }}
                          max={stake_configs.maximum_match_bet}
                          value={selected_session.amount || ""}
                        />
                        <InputGroup.Text
                          id="basic-addon3"
                          className="bg-danger text-white"
                        >
                          <p>{counter}</p>
                        </InputGroup.Text>
                      </InputGroup>
                    </Col>
                  </Row>
                  <Row className="my-3">
                    <Col
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      className="bet-price-btns"
                    >
                      {coin_options.map((price, i) => {
                        return (
                          <Button
                            key={i}
                            className="bet-price-btn"
                            onClick={() =>
                              this.updateBetAmount(
                                price.value,
                                selected_session.max
                              )
                            }
                          >
                            {price.label
                              .replace("k", "000")
                              .replace("K", "000")}
                          </Button>
                        );
                      })}
                    </Col>
                  </Row>
                  <div className="row m-2">
                    <div className="col-6">
                      <Button style={{ background: "#ff0000", color: "white", height: 60 }}
                        className="w-100 m-0"
                        variant="contained"
                        onClick={this.placeBet}
                      >
                        Cencel
                      </Button>
                    </div>

                    <div className="col-6">
                      <Button style={{ background: "#008000", color: "white", height: 60 }}
                        className="w-100 m-0"
                        variant="contained"
                        onClick={this.placeBet}
                      >
                        Place Bet
                      </Button>
                    </div>
                  </div>
                </Container>
              </Modal.Body>
            </Modal>
          </>
        )}

        {isOld && (
          <OldInplay
            state={this.state}
            setSelectedSession={this.setSelectedSession}
            t={t}
            updateBetAmount={this.updateBetAmount}
            placeBet={this.placeBet}
            toggleTv={this.toggleTv}
            toggleSession={this.toggleSession}
            toggleMatchStatement={this.toggleMatchStatement}
            hideNotification={this.hideNotification}
            toggleSlipModal={this.toggleSlipModal}
            iframeToggle={this.iframeToggle}
            score_height={this.state.score_height}
            fullScoreText={this.state.fullScoreText}
            matchRuleModal={this.matchRuleModal}
            rules_modal={this.state.rules_modal}
            ruleTypes={this.state.ruleTypes}
            matchType={this.state.matchType}
            closeMatchRuleModal={this.closeMatchRuleModal}
          />
        )}

        {!isOld && (
          <>
            <Notification
              isVisible={toast}
              type={notification_type || "success"}
              title="Bet Placed"
              message={notification}
              onClose={() => this.hideNotification()}
            />

            <div>
              {is_fetching && <Loader />}

              {inplayNotification && (
                <marquee className="inplay-notification">
                  <span>{inplayNotification}</span>
                </marquee>
              )}

              {iframe_score ? (
                <iframe
                  src={iframe_score}
                  title="Live Match"
                  className="match-tv"
                />
              ) : (
                <>
                  <div className="scoreboard">
                    <span>
                      <img src={Bat} alt="" />
                    </span>
                    <div className="team1">{score?.t1_dtl}</div>

                    <div className="live-status">
                      <b>{score?.Status}</b>
                    </div>

                    <div className="team2">{score?.t2_dtl}</div>
                    <span>
                      <img src={Ball} alt="" />
                    </span>
                  </div>
                  <div className="w-100 text-white mb-0 text-center score-msg">
                    <span style={{ fontSize: "11px" }}>
                      {score.score_msg
                        .replace("Current", "Batting")
                        .replace("CURRENT", "Batting")}
                    </span>
                  </div>
                  <div className="players px-2">
                    <div>{score.p1_dtl}</div>
                    <div className="text-center">
                      <span className="last-over">
                        {this.getLastOver(score.last_6_balls).map((ball, i) => {
                          return this.getLast6Formatter(ball, i);
                        })}
                      </span>
                      <span>{score.bowler}</span>
                    </div>
                    <div className="text-right">{score.p2_dtl} </div>
                  </div>
                </>
              )}

              {is_tv_visible && (
                <iframe src={tv_url} title="Live Match" className="match-tv" />
              )}

              <Table>
                <thead>
                  <tr>
                    <th>
                      {"{"}
                      {t("Max")}: {stake_configs.maximum_match_bet}/-
                      {"}"}
                    </th>
                    <th className="text-center">{t("Lagai")}</th>
                    <th className="text-center">{t("Khai")}</th>
                  </tr>
                </thead>
                <tbody>
                  {team_session.map((data, i) => {
                    return (
                      <tr key={i}>
                        <th className="session-team d-flex justify-content-between">
                          {data.team_name}{" "}
                          <b
                            className={`mx-2 ${positions[data.selectionid] < 0
                              ? "text-danger"
                              : "text-primary"
                              }`}
                          >
                            {String(positions[data.selectionid] || 0)}
                          </b>
                        </th>
                        <td className="lgaai">
                          <Button
                            variant="transparent"
                            className="w-100 box-shadow-0"
                            onClick={() => {
                              Number(data.lgaai) &&
                                this.setSelectedSession({
                                  ...data,
                                  oddType: "L",
                                  sessionType: SESSION_TYPE.fancy,
                                });
                            }}
                          >
                            {data.lgaai}
                          </Button>
                        </td>
                        <td className="khaai">
                          <Button
                            variant="transparent"
                            className="w-100 box-shadow-0"
                            onClick={() => {
                              Number(data.khaai) &&
                                this.setSelectedSession({
                                  ...data,
                                  oddType: "K",
                                  sessionType: SESSION_TYPE.fancy,
                                });
                            }}
                          >
                            {data.khaai}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>

              {Boolean(plus_minus) && (
                <div className="session-plus-minus">
                  <p>
                    {t("SESSION PLUS/MINUS")}
                    <span
                      className={
                        plus_minus >= 0 ? "text-success" : "text-danger"
                      }
                    >
                      {plus_minus}/-
                    </span>
                  </p>
                </div>
              )}

              <Table>
                <thead>
                  <tr>
                    <th>
                      {"{"}
                      {t("Max")}: {stake_configs.maximum_session_bet}/-{"}"}
                    </th>
                    <th className="text-center">{t("No")}</th>
                    <th className="text-center">{t("Yes")}</th>
                  </tr>
                </thead>
                <tbody>
                  {session.map((data, key) => {
                    if (data.com_perm === "NO") return;
                    return (
                      <tr key={key}>
                        <th>
                          {data.session_name}
                          <br />
                          <span className="text-success">
                            ({t("Max: ")}
                            {data.max || stake_configs.maximum_session_bet}/-)
                          </span>
                        </th>
                        {Number(data.oddsNo) && Number(data.oddsYes) ? (
                          <>
                            <td
                              className="khaai"
                              onClick={() => {
                                Number(data.oddsNo) &&
                                  this.setSelectedSession({
                                    ...data,
                                    oddType: "N",
                                    sessionType: SESSION_TYPE.session,
                                  });
                              }}
                            >
                              <Button className="bg-transparent border-0">
                                {data.runsNo}
                                <span>{data.oddsNo}</span>
                              </Button>
                            </td>
                            <td
                              className="lgaai"
                              onClick={() => {
                                Number(data.oddsYes) &&
                                  this.setSelectedSession({
                                    ...data,
                                    oddType: "Y",
                                    sessionType: SESSION_TYPE.session,
                                  });
                              }}
                            >
                              <Button className="bg-transparent border-0">
                                {data.runsYes}
                                <span>{data.oddsYes}</span>
                              </Button>
                            </td>
                          </>
                        ) : (
                          <td colSpan={2} className="p-0">
                            <div className="suspended-bg">
                              <span>{data.remarks || t("SUSPENDED")}</span>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </Table>

              <Table>
                <thead>
                  <tr style={{ backgroundColor: "#C1185B" }}>
                    <th>
                      {t("No Commission Session")}
                      {"{"}
                      {t("Max")}: {stake_configs.maximum_session_bet}/-{"}"}
                    </th>
                    <th className="text-center">{t("No")}</th>
                    <th className="text-center">{t("Yes")}</th>
                  </tr>
                </thead>
                <tbody>
                  {session.map((data, key) => {
                    if (data.com_perm === "YES") return;
                    return (
                      <tr key={key}>
                        <th>
                          {data.session_name}
                          <br />
                          <span className="text-success">
                            ({t("Max: ")}
                            {data.max || stake_configs.maximum_session_bet}/-)
                          </span>
                        </th>
                        {Number(data.oddsNo) && Number(data.oddsYes) ? (
                          <>
                            <td
                              className="khaai"
                              onClick={() => {
                                Number(data.oddsNo) &&
                                  this.setSelectedSession({
                                    ...data,
                                    oddType: "N",
                                    sessionType: SESSION_TYPE.session,
                                  });
                              }}
                            >
                              <Button className="bg-transparent border-0">
                                {data.runsNo}
                                <span>{data.oddsNo}</span>
                              </Button>
                            </td>
                            <td
                              className="lgaai"
                              onClick={() => {
                                Number(data.oddsYes) &&
                                  this.setSelectedSession({
                                    ...data,
                                    oddType: "Y",
                                    sessionType: SESSION_TYPE.session,
                                  });
                              }}
                            >
                              <Button className="bg-transparent border-0">
                                {data.runsYes}
                                <span>{data.oddsYes}</span>
                              </Button>
                            </td>
                          </>
                        ) : (
                          <td colSpan={2} className="p-0">
                            <div className="suspended-bg">
                              <span>{data.remarks || t("SUSPENDED")}</span>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </Table>

              <div className="d-flex">
                <Button
                  className="w-100 tab-button match-bets"
                  onClick={() => this.toggleActiveTab(TABS(t)[0])}
                >
                  {t("Match Bets")} ({match_bet_data.length})
                </Button>
                <Button
                  className="w-100 tab-button session-bets"
                  onClick={() => this.toggleActiveTab(TABS(t)[1])}
                >
                  {t("Session Bets")} ({session_bet_data.length})
                </Button>
              </div>

              <div className="table-responsive inplay-session-bets">
                {active_tab === TABS(t)[0] && (
                  <Table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>{t("Team Name")}</th>
                        <th>{t("Odds")}</th>
                        <th>{t("Amount")}</th>
                        <th>{t("Bet Type")}</th>
                        <th>{t("Time")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {match_bet_data.map((bet, i) => {
                        return (
                          <tr>
                            <td>{i + 1}</td>
                            <td>{bet.team_name}</td>
                            <td>{bet.bhav}</td>
                            <td>{bet.amount}</td>
                            <td>{bet.type}</td>
                            <td>{bet.time_inserted}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                )}

                {active_tab === TABS(t)[1] && (
                  <Table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>{t("Fancy Name")}</th>
                        <th>{t("Bet Type")}</th>
                        <th>{t("Runs")}</th>
                        <th>{t("Bhav")}</th>
                        <th>{t("Amount")}</th>
                        <th>{t("Decision Run")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {session_bet_data.map((bet, i) => {
                        return (
                          <tr>
                            <td>{i + 1}</td>
                            <td>{bet.runner_name}</td>
                            <td>{bet.type}</td>
                            <td>{bet.bet_run}</td>
                            <td>{bet.bhav}</td>
                            <td>{bet.amount}</td>
                            <td>{bet.decision_run || t("Not Declared")}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                )}
              </div>

              <div className="tv-toggle">
                <Button onClick={this.toggleTv}>
                  <img src={TVIcon} alt="" />
                </Button>
              </div>
            </div>
          </>
        )}
      </>
    );
  }
}

InPlay.propTypes = {
  t: func,
};

const mapStateToProps = (state) => {
  return {
    balance: state.user.balance,
  };
};

export default compose(
  withTranslation("rules"),
  connect(mapStateToProps, { setUserBalance })
)(InPlay);
