import React from "react";
import { Button, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { compose } from "redux";
import io from "socket.io-client";

import { httpGet, httpPost } from "../../utils/http";

import { setUserBalance } from "../../modules/user/actions";

import cardImages from "./lucky7cards";
import iframeCards from "./helpers";
import PlaceBetModal from "./PlaceBetModal";

import Rules from "../../assets/img/lucky7-rules.jpg";
import Lucky7Card from "../../assets/img/lucky7.jpg";

import "./style.scss";
import BetResultData from "./BetResultData";
import { LUCKY7_CARD_TYPE } from "./helper";
import { withTranslation } from "react-i18next";
import { SOCKET_URL, LUCKY7A_URL } from "../../utils/configs";

import Notification from "../../components/Toast";
import axios from "axios";
import BackToMenu from "../../components/BackToMenu";

const TABS = ["Game", "Placed Bets"];
const DEFAULT_SECS = 1000;

class Lucky7 extends React.Component {
  state = {
    odds_data: [],
    real_time_card_array: {
      playerA_card: [],
      playerB_card: [],
    },
    result: [],
    last_team_win: "",
    market_id: "",
    timer: 0,
    counter: 0,
    max_limit: 0,
    min_limit: 0,
    iframe_url: false,
    position: [],
    socket_perm: 0,
    slip_modal: false,
    selected_odd: {},
    active_tab: TABS[0],
    api_hit_time: DEFAULT_SECS,
    rules_modal: false,
    is_bet_result: false,
    bet_result_market_id: null,
    bets_list: [],
    winner: "",
    positions: {},
    is_notification: false,
  };

  componentDidMount() {
    this.getGameConfig();

    this.getBetsList();

    // setInterval(() => {
    //   this.getCoins();
    // }, 30000);
  }

  componentWillUnmount() {
    const { socket_perm } = this.state;

    if (socket_perm) {
      this.socket.emit("leave-room");
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.timer !== this.state.timer) {
      this.setState({ counter: this.state.timer });
      return;
    }

    if (prevState.timer != this.state.timer || this.state.counter === 0) {
      this.resetCounter();
    }

    if (prevState.market_id != this.state.market_id) {
      this.setState({ positions: {}, slip_modal: false });
    }
  }

  getCoins = async () => {
    try {
      // const response = await httpPost("lucky7_a_position", {}, true);
      // if (response.status === "success") {
      //   const { data } = response;
      //   this.updateLocalStore(data);
      // }
    } catch (e) {
      console.log(e);
    }
  };

  getPlayersPosition = async (market_id) => {
    try {
      const response = await httpPost("total_coins", { market_id }, true);

      if (response.status === "success") {
        const { data } = response;

        // this.setState({ position });
        this.updateLocalStore(data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  getGameConfig = async () => {
    try {
      const result = await httpGet("lucky7_a_data", {}, true);
      if (result.data.status === "success") {
        const {
          data: {
            data: {
              position,
              min_limit,
              max_limit,
              api_hit_time,
              url,
              socket_perm,
            },
          },
        } = result;

        if (Number(socket_perm)) {
          // this.socket = io(`${SOCKET_URL}?marketId=lucky7_a&type=lucky7_a`);
          // this.socket.on("joinedroom", function(){console.log('fff');}
          // );
          // this.socket.emit("joined", 'lucky7_a');

          this.socket = io.connect(SOCKET_URL);
          this.socket.emit("JoinRoom", "lucky7a");
        }

        this.setState(
          {
            position,
            min_limit,
            max_limit,
            api_hit_time: api_hit_time || DEFAULT_SECS,
            iframe_url: url,
            socket_perm: Number(socket_perm),
          },
          () => {
            this.getGameRecurringData(true);
          }
        );
      } else {
        console.error("Game Not active yet");
      }
    } catch (e) {
      console.log(e);
    }
  };

  getGameRecurringData = async (hit_player_position = false) => {
    const { active_tab, api_hit_time, socket_perm } = this.state;
    if (socket_perm) {
      let isFirst = true;
      this.socket.on("lucky7a", (msg) => {
        msg = JSON.parse(msg);

        const {
          last_team_win,
          market_id,
          odds_data,
          real_time_card_array,
          result,
          timer,
        } = msg.data.lucky7_a || {};

        if (hit_player_position && isFirst) this.getPlayersPosition(market_id);
        isFirst = false;
        this.setState({
          last_team_win,
          market_id,
          odds_data: odds_data.t2 || [],
          real_time_card_array,
          result: result,
          timer: Number(timer),
          counter: Number(timer),
        });
      });

      return;
    }

    //const response = await httpGet("lucky7_a_api", null, true);
    const response = await await axios.get(LUCKY7A_URL);

    const {
      last_team_win,
      market_id,
      odds_data,
      real_time_card_array,
      result,
      timer,
    } = response.data.data.lucky7_a || {};

    if (hit_player_position) this.getPlayersPosition(market_id);

    this.setState(
      {
        last_team_win,
        market_id,
        odds_data: odds_data.t2 || [],
        real_time_card_array,
        result: result,
        timer: Number(timer),
        counter: Number(timer),
      },
      () => {
        setTimeout(() => {
          this.getGameRecurringData();
        }, api_hit_time);
      }
    );
  };

  getBetsList = async () => {
    try {
      const params = { game_type: "LUCKY7 A" };
      const response = await httpPost("casino_bet_list", params, true);

      this.setState({ bets_list: response.bet_data });
    } catch (err) {
      console.log(err);
    }
  };

  getPlayAlbhapet = (team) => {
    switch (team) {
      case "0":
        return <span className="text-danger">T</span>;
      case "1":
        return <span style={{ color: "#002D5B" }}>L</span>;
      case "2":
        return <span style={{ color: "#E8FF22" }}>H</span>;
      default:
        return "";
    }
  };

  selectBetPlayer = (selected_odd) => {
    this.setState({ selected_odd, slip_modal: true });
  };

  /*The function notifiy */
  showNotifiyAlert = (obj) => {
    this.setState({
      noti_type: obj.noti_type,
      noti_msg: obj.noti_msg,
      is_notification: obj.is_notification,
      amount: "",
      is_bet_in_progress: obj.is_bet_in_progress,
    });
  };

  closeModal = (params = false) => {
    this.setState({ slip_modal: false, selected_odd: {} });

    if (params) {
      let { bets_list, positions } = this.state;
      if (params.bet_for === "series") params.rate += 1;

      const newBet = [
        {
          player_name: params.nation,
          market_id: params.mid,
          profit: (Number(params.rate) - 1) * params.amount,
          loss: "-" + params.amount,
          amount: params.amount,
          decision: "",
        },
      ].concat(bets_list);

      let totalPosition = Number(params.amount);
      if (positions[params.nation]) {
        positions[params.nation] =
          Number(positions[params.nation]) + totalPosition;
      } else {
        positions[params.nation] = totalPosition;
      }

      this.setState({ bets_list: newBet, positions });
    }
  };

  resetCounter = () => {
    const { counter, timer } = this.state;

    if (timer == 0) {
      return;
    }

    setInterval(() => {
      this.setState({ counter: counter - 1 || 0 });
    }, 1000);
  };

  toggleActiveTab = (active_tab) => {
    this.setState({ active_tab });
  };

  toggleRulesModal = () => {
    const { rules_modal } = this.state;

    this.setState({ rules_modal: !rules_modal });
  };

  updateLocalStore = (coins) => {
    const userDetails = JSON.parse(localStorage.getItem("user-data"));

    userDetails.data.total_coins = coins;
    this.props.setUserBalance(coins);
    localStorage.setItem("user-data", JSON.stringify(userDetails));
  };

  openBetResultModal = (market_id, winner) => {
    this.setState({
      is_bet_result: true,
      bet_result_market_id: market_id,
      winner,
    });
  };

  closeResultModal = () => {
    this.setState({ is_bet_result: false });
  };

  filterCards = (cardType) => {
    const { odds_data } = this.state;
    // switch()

    const filteredCards = odds_data.filter((odd) => {
      let card = odd;
      card.game_type = cardType;
      if (odd.nat.matches(LUCKY7_CARD_TYPE[cardType].regex)) return card;
    });
  };

  hideNotification = () => {
    this.setState({ is_notification: false });
  };

  render() {
    const {
      result,
      position,
      min_limit,
      max_limit,
      iframe_url,
      real_time_card_array,
      slip_modal,
      selected_odd,
      market_id,
      active_tab,
      rules_modal,
      is_bet_result,
      bet_result_market_id,
      last_team_win,
      counter,
      bets_list,
      winner,
      positions,
    } = this.state;

    let { odds_data } = this.state;

    if (!odds_data) odds_data = [];

    const { t } = this.props;

    return (
      <>
        <Notification
          isVisible={this.state.is_notification}
          type={this.state.noti_type || "success"}
          title=""
          message={this.state.noti_msg}
          onClose={this.hideNotification}
        />
        {/* 
        <a href="/casino" className="casino-back-btn">
          {t("Back")}
        </a> */}

        <Modal show={rules_modal} centered>
          <Modal.Header closeButton onHide={() => this.toggleRulesModal()}>
            <Modal.Title>{t("Rules")}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img src={Rules} alt="" width="100%" />
          </Modal.Body>
        </Modal>

        <div
          className="d-flex align-items-center justify-content-between"
          style={{ background: "#2c3e50", color: "#fff" }}
        >
          <div className="d-flex">
            <Button
              style={{ backgroundColor: "#2c3e50", border: "white" }}
              className={`tab-button casino-tabs ${
                active_tab === TABS[0] ? "active" : ""
              }`}
              onClick={() => this.toggleActiveTab(TABS[0])}
            >
              {t(TABS[0])}
            </Button>
            <Button
              style={{ backgroundColor: "#2c3e50", border: "white" }}
              className={`tab-button casino-tabs ${
                active_tab === TABS[1] ? "active" : ""
              }`}
              onClick={() => this.toggleActiveTab(TABS[1])}
            >
              {t(TABS[1])}
            </Button>
            <Button
              style={{ backgroundColor: "#2c3e50", border: "white" }}
              className="tab-button casino-tabs"
              onClick={this.toggleRulesModal}
            >
              {t("Rules")}
            </Button>
          </div>
          <div>{market_id && market_id.split(".")[1]}</div>
        </div>

        {slip_modal && (
          <PlaceBetModal
            is_visible={slip_modal}
            odd={selected_odd}
            game_type="LUCKY7 A"
            closeModal={this.closeModal}
            max={max_limit}
            min={min_limit}
            updatePosition={this.getPlayersPosition}
            setAlert={this.showNotifiyAlert}
          />
        )}

        {is_bet_result && (
          <BetResultData
            market_id={bet_result_market_id}
            casino_type="lucky7_a"
            is_visible={is_bet_result}
            closeModal={this.closeResultModal}
            winner={winner}
          />
        )}

        {active_tab === TABS[0] && (
          <>
            <div className="position-relative">
              <span className="counter lucky7">
                <b className="counter-number">{counter}</b>
              </span>

              <div className="cards">
                <div>
                  <b>Card</b>
                  <ul className="player-cards">
                    <li>
                      <img
                        src={`${
                          iframeCards[real_time_card_array.playerA_card[0] || 1]
                        }`}
                        alt=""
                      />
                    </li>
                  </ul>
                </div>
              </div>

              {iframe_url && (
                <iframe
                  src={iframe_url}
                  title="Live Casino"
                  width="100%"
                  height="210px"
                />
              )}
            </div>

            <>
              <div className="row casino-cards">
                {odds_data.map((odd, i) => {
                  if (odd.nat.includes("LOW") || odd.nat.includes("HIGH")) {
                    return (
                      <>
                        <div className="col-5" key={i}>
                          <div className="casino-card w-100">
                            {odd.gstatus == 0 && (
                              <div className="locked">
                                <box-icon
                                  type="solid"
                                  color="#fff"
                                  name="lock-alt"
                                ></box-icon>
                              </div>
                            )}
                            <p>{odd.rate}</p>
                            <p
                              className="card-strip"
                              onClick={() =>
                                this.selectBetPlayer({
                                  ...odd,
                                  game_type: "LUCKY7 A",
                                  bet_for: "low_high",
                                })
                              }
                            >
                              {odd.nat}
                            </p>
                            <p className="text-danger">
                              {positions[odd.nat] || 0}
                            </p>
                          </div>
                        </div>

                        {i == 0 && (
                          <div className="col-2 d-flex">
                            <img
                              src={Lucky7Card}
                              className="lucky7-cards"
                              alt=""
                            />
                          </div>
                        )}
                      </>
                    );
                  }
                })}
              </div>

              <div className="row casino-cards mt-2">
                <div className="col-6">
                  <div className="row">
                    {odds_data.map((odd, i) => {
                      if (odd.nat.includes("Even") || odd.nat.includes("Odd")) {
                        return (
                          <div className="casino-card col-6">
                            {odd.gstatus == 0 && (
                              <div className="locked">
                                <box-icon
                                  type="solid"
                                  color="#fff"
                                  name="lock-alt"
                                ></box-icon>
                              </div>
                            )}
                            <p>{odd.rate}</p>
                            <p
                              className="card-strip"
                              onClick={() =>
                                this.selectBetPlayer({
                                  ...odd,
                                  game_type: "LUCKY7 A",
                                  bet_for: "odd_even",
                                })
                              }
                            >
                              {odd.nat}
                            </p>
                            <p className="text-danger">
                              {positions[odd.nat] || 0}
                            </p>
                          </div>
                        );
                      }
                    })}
                  </div>
                </div>

                <div className="col-6">
                  <div className="row">
                    {odds_data.map((odd, i) => {
                      if (
                        odd.nat.includes("Red") ||
                        odd.nat.includes("Black")
                      ) {
                        return (
                          <div className="casino-card col-6">
                            {odd.gstatus == 0 && (
                              <div className="locked">
                                <box-icon
                                  type="solid"
                                  color="#fff"
                                  name="lock-alt"
                                ></box-icon>
                              </div>
                            )}
                            <p>{odd.rate}</p>
                            <p
                              className="card-strip"
                              onClick={() =>
                                this.selectBetPlayer({
                                  ...odd,
                                  game_type: "LUCKY7 A",
                                  bet_for: "color",
                                })
                              }
                            >
                              {odd.nat}
                            </p>
                            <p className="text-danger">
                              {positions[odd.nat] || 0}
                            </p>
                          </div>
                        );
                      }
                    })}
                  </div>
                </div>
              </div>

              <div className="row lucky7-cards-lower mt-2 position-relative">
                {odds_data.map((odd) => {
                  if (odd.nat.match(/(?:Card)/i)) {
                    const number = odd.nat.split(" ")[1];

                    if (cardImages[number]) {
                      return (
                        <>
                          {odd.nat == "Card 1" && (
                            <span
                              className="position-absolute text-center"
                              style={{ top: "-4px", marginBottom: "5px" }}
                            >
                              {/* {odd.rate} */} 10
                            </span>
                          )}

                          <span className="position-relative lucky7-cards-img-lower">
                            {odd.gstatus == 0 && (
                              <div className="locked">
                                <box-icon
                                  type="solid"
                                  color="#fff"
                                  name="lock-alt"
                                ></box-icon>
                              </div>
                            )}

                            <img
                              onClick={() =>
                                odd.gstatus != 0 &&
                                this.selectBetPlayer({
                                  ...odd,
                                  rate: 10,
                                  game_type: "LUCKY7 A",
                                  bet_for: "series",
                                })
                              }
                              src={cardImages[number]}
                              alt=""
                            />
                            <p className="m-0 text-center h6 text-danger">
                              {positions[odd.nat] || 0}
                            </p>
                          </span>
                        </>
                      );
                    }
                  }
                })}
              </div>
            </>

            <div className="last-results">
              <div className="result-headings">
                <h4>{t("Last Result")}</h4>
                <h4>{t("View Result")}</h4>
              </div>
              <ul className="results mt-2">
                {result &&
                  result.map((bets) => {
                    const winner = this.getPlayAlbhapet(bets.result);
                    return (
                      <li
                        onClick={() =>
                          this.openBetResultModal(bets.mid, bets.result)
                        }
                      >
                        {winner}
                      </li>
                    );
                  })}
              </ul>
            </div>

            <div className="last-results mb-5">
              <div className="result-headings w-100">
                <h4>{t("Placed Bets")}</h4>
              </div>

              <ul className="casino-bets-list mt-3">
                {bets_list &&
                  bets_list.map((bet, i) => {
                    return (
                      <li key={i}>
                        <h4>
                          {bet.player_name} - ({bet.market_id})
                        </h4>
                        <div className="d-flex justify-content-between bet">
                          <div>
                            <h4>{t("Profit")}</h4>
                            <p>{Number(bet.profit).toFixed(0)}</p>
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
                            <p>
                              {bet.decision &&
                                (bet.decision == 1
                                  ? "Low Card"
                                  : bet.decision == 2
                                  ? "High Card"
                                  : bet.decision == 0
                                  ? "Lucky 7"
                                  : bet.decision)}
                            </p>
                          </div>
                        </div>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </>
        )}

        {active_tab === TABS[1] && (
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
                      <p>{Number(bet.profit).toFixed(0)}</p>
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
                      <p>
                        {bet.decision &&
                          (bet.decision == 1
                            ? "Low Card"
                            : bet.decision == 2
                            ? "High Card"
                            : bet.decision == 0
                            ? "Lucky 7"
                            : bet.decision)}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        <BackToMenu
          text="Back To Casino List"
          link="/casino"
          buttonClass="casino-back-btn"
        ></BackToMenu>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    balance: state.user.balance,
  };
};

export default compose(
  connect(mapStateToProps, { setUserBalance }),
  withTranslation("rules")
)(Lucky7);
