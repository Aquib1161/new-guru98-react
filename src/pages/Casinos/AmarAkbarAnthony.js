import React from "react";
import { Button, Table, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { compose } from "redux";
import io from "socket.io-client";
import axios from "axios";
import { withTranslation } from "react-i18next";
import { httpGet, httpPost } from "../../utils/http";
import { setUserBalance } from "../../modules/user/actions";
import iframeCards from "./helpers";
import PlaceBetModal from "./PlaceBetModal";
import Rules from "../../assets/img/aaa-rules.jpeg";
import "./style.scss";
import Notification from "../../components/Toast";
import { SOCKET_URL, AAA_URL } from "../../utils/configs";
import BackToMenu from "../../components/BackToMenu";
import BetResultData from "./BetResultData";
const TABS = ["Game", "Placed Bets"];
const DEFAULT_SECS = 2000;

class AmarAkbarAnthony extends React.Component {
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
    game_type: "AMAR AKBAR ANTHONY",
    Amar: {},
    Akbar: {},
    Anthony: {},
    is_notification: false,
    ReactPositon: [],
  };

  componentDidMount() {
    this.gameData();
    this.getCoins();
    this.getGameData();
    this.getBetsList();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.timer != this.state.timer) {
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

  getBetsList = async () => {
    try {
      const params = { game_type: "AAA" };
      const response = await httpPost("casino_bet_list", params, true);

      this.setState({ bets_list: response.bet_data });
      this.getPlayersPosition();
    } catch (err) {
      console.log(err);
    }
  };

  selectBetPlayer = (selected_odd) => {
    selected_odd.rate = selected_odd.b1;
    selected_odd.player = selected_odd.nat;
    selected_odd.market_id = selected_odd.mid;
    this.setState({ selected_odd, slip_modal: true });
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

  gameData = async () => {
    try {
      const result = await httpGet("amar_akbar_anthony_data", {}, true);
      if (result.data.status === "success") {
        const {
          data: {
            data: {
              min_limit,
              max_limit,
              url,
              socket_perm,
              game_name,
              api_hit_time,
            },
          },
        } = result;
        this.setState(
          {
            min_limit,
            max_limit,
            api_hit_time: api_hit_time || DEFAULT_SECS,
            iframe_url: url,
            socket_perm: Number(socket_perm),
          },
          () => {
            this.getGameData(true);
          }
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  getGameData = async (hitPlayerPosition = false) => {
    const { active_tab, api_hit_time, socket_perm } = this.state;
    if (socket_perm) {
      this.socket = io.connect(SOCKET_URL);
      this.socket.emit("JoinRoom", "aaa");
      this.socket.on("aaa", (data) => {
        const finalData = JSON.parse(data);
        const OddsData = finalData.data.aaa;
        this.setState({
          odds_data: OddsData.odds_data ? OddsData.odds_data : [],
          real_time_card_array: OddsData.real_time_card_array
            ? OddsData.real_time_card_array
            : this.state.real_time_card_array,
          result: OddsData.result ? OddsData.result : this.state.result,
          market_id: Number(OddsData.market_id),
          timer: Number(OddsData.timer),
          counter: Number(OddsData.timer),
        });
      });
    } else {
      const response = await axios.get(AAA_URL);
      const OddsData = response.data.data.aaa;

      // console.log(OddsData);

      this.setState(
        {
          odds_data: OddsData.odds_data ? OddsData.odds_data : [],
          real_time_card_array: OddsData.real_time_card_array
            ? OddsData.real_time_card_array
            : this.state.real_time_card_array,
          result: OddsData.result ? OddsData.result : this.state.result,
          market_id: Number(OddsData.market_id),
          timer: Number(OddsData.timer),
          counter: Number(OddsData.timer),
        },
        () => {
          setTimeout(() => {
            this.getGameData();
          }, api_hit_time);
        }
      );
    }
    this.getPlayersPosition();
  };

  getCoins = async () => {
    try {
      let coins = 0;
      const coinsData = await httpPost("coins", {}, true);
      if (coinsData.status == "success") {
        coins = coinsData.data;
      }
      this.updateLocalStore(coins);
    } catch (error) {
      console.log("getCoinsError", error);
    }
  };

  updateLocalStore = (coins) => {
    const userDetails = JSON.parse(localStorage.getItem("user-data"));

    userDetails.data.total_coins = coins;
    this.props.setUserBalance(coins);
    localStorage.setItem("user-data", JSON.stringify(userDetails));
  };

  showNotifiyAlert = (obj) => {
    this.setState({
      noti_type: obj.noti_type,
      noti_msg: obj.noti_msg,
      is_notification: obj.is_notification,
      amount: "",
      is_bet_in_progress: obj.is_bet_in_progress,
    });
  };

  hideNotification = () => {
    this.setState({ is_notification: false });
  };

  toggleRulesModal = () => {
    const { rules_modal } = this.state;

    this.setState({ rules_modal: !rules_modal });
  };
  toggleActiveTab = (active_tab) => {
    this.setState({ active_tab });
  };

  ABC = (i) => {
    switch (i) {
      case 1:
        return <span>A</span>;
      case 2:
        return <span>B</span>;
      case 3:
        return <span>C</span>;
      default:
        return "";
    }
  };

  Color = (amount) => {
    if (amount < 0) {
      return <span style={{ color: "red" }}>{amount}</span>;
    } else {
      return <span style={{ color: "green" }}>{amount}</span>;
    }
  };

  closeModal = (params = false) => {
    this.setState({ slip_modal: false, selected_odd: {} });
    if (params) {
      let { bets_list, positions } = this.state;
      const newBet = [
        {
          player_name: params.player_name,
          market_id: params.market_id,
          profit: (Number(params.rate) - 1) * params.amount,
          loss: "-" + params.amount,
          amount: params.amount,
          decision: "",
          key: params.sid,
        },
      ].concat(bets_list);
      this.setState({ bets_list: newBet, positions });
      this.getCoins();
    }
  };

  getPlayersPosition = async (MarketId) => {
    try {
      let { bets_list, market_id } = this.state;

      let FinalArray = [];
      FinalArray[0] = 0.0;
      FinalArray[1] = 0.0;
      FinalArray[2] = 0.0;
      FinalArray[3] = 0.0;

      bets_list.forEach((BetsData, index) => {
        if (BetsData.market_id == market_id) {
          FinalArray.forEach((data, i) => {
            if (i == BetsData.key) {
              FinalArray[i] += Number(BetsData.profit);
            } else {
              FinalArray[i] += Number(BetsData.loss);
            }
          });
        }
      });

      this.setState({ ReactPositon: FinalArray });
    } catch (e) {
      console.log("PositionError", e);
    }
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

  render() {
    const {
      rules_modal,
      active_tab,
      iframe_url,
      counter,
      odds_data,
      real_time_card_array,
      result,
      timer,
      market_id,
      slip_modal,
      selected_odd,
      max_limit,
      min_limit,
      bets_list,
      is_notification,
      ReactPositon,
      is_bet_result,
      bet_result_market_id,
      winner,
    } = this.state;

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

        {slip_modal && (
          <PlaceBetModal
            is_visible={slip_modal}
            odd={selected_odd}
            game_type="AAA"
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

        <Modal show={rules_modal} centered>
          <Modal.Header closeButton onHide={() => this.toggleRulesModal()}>
            <Modal.Title>Rules</Modal.Title>
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
              {TABS[0]}
            </Button>
            <Button
              style={{ backgroundColor: "#2c3e50", border: "white" }}
              className={`tab-button casino-tabs ${
                active_tab === TABS[1] ? "active" : ""
              }`}
              onClick={() => this.toggleActiveTab(TABS[1])}
            >
              {TABS[1]}
            </Button>
            <Button
              style={{ backgroundColor: "#2c3e50", border: "white" }}
              className="tab-button casino-tabs"
              onClick={this.toggleRulesModal}
            >
              Rules
            </Button>
          </div>
          <div>{market_id}</div>
        </div>

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
                    <li style={{ color: "red" }}>
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
                  if (
                    odd.nat.includes("Amar") ||
                    odd.nat.includes("Akbar") ||
                    odd.nat.includes("Anthony")
                  ) {
                    const Alpha = this.ABC(i + 1);
                    return (
                      <>
                        <div className="col-4" key={i}>
                          <div className="casino-card w-100">
                            {odd.gstatus != "ACTIVE" && (
                              <div className="locked">
                                <box-icon
                                  type="solid"
                                  color="#fff"
                                  name="lock-alt"
                                ></box-icon>
                              </div>
                            )}
                            <p style={{ color: "green" }}>{odd.b1}</p>
                            <p
                              className="card-strip"
                              onClick={() =>
                                this.selectBetPlayer({
                                  ...odd,
                                  game_type: "AAA",
                                  bet_for: "AAA",
                                })
                              }
                            >
                              {Alpha}.{odd.nat}
                            </p>
                            <p style={{ color: "blue" }}>
                              {this.Color(Math.round(ReactPositon[odd.sid]))}
                            </p>
                          </div>
                        </div>
                      </>
                    );
                  }
                })}
              </div>

              <div className="last-results">
                <div className="result-headings">
                  <h4>Last Result</h4>
                  <h4>View Result</h4>
                </div>
                <ul className="results mt-2">
                  {result.map((bets) => {
                    const winner = this.ABC(Number(bets.result));

                    return (
                      <li
                        onClick={() =>
                          this.openBetResultModal(bets.mid, bets.result)
                        }
                        style={{ color: "#2c3e50" }}
                      >
                        {winner}
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="result-headings w-100">
                <center>
                  <h4>Placed Bets List</h4>
                </center>
              </div>

              <ul className="casino-bets-list">
                {bets_list.map((bet, i) => {
                  return (
                    <li key={i}>
                      <h4>
                        {bet.player_name} - ({bet.market_id})
                      </h4>
                      <div className="d-flex justify-content-between bet">
                        <div>
                          <h4>Profit</h4>
                          <p>{Number(bet.profit).toFixed(0)}</p>
                        </div>
                        <div>
                          <h4>Loss</h4>
                          <p>{bet.loss}</p>
                        </div>
                        <div>
                          <h4>Amount</h4>
                          <p>{bet.amount}</p>
                        </div>
                        <div>
                          <h4>Decision</h4>
                          <p>
                            {bet.decision &&
                              (bet.decision == 1
                                ? "Amar"
                                : bet.decision == 2
                                ? "Akbar"
                                : bet.decision == 3
                                ? "Anthony"
                                : bet.decision)}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </>
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
                            ? "Amar"
                            : bet.decision == 2
                            ? "Akbar"
                            : bet.decision == 3
                            ? "Anthony"
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
)(AmarAkbarAnthony);
