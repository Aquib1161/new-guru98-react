import React from "react";
import { Button, Table, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { compose } from "redux";
import io from "socket.io-client";
import axios from "axios";
import { get } from "lodash";
import { withTranslation } from "react-i18next";

import { httpGet, httpPost } from "../../utils/http";

import { setUserBalance } from "../../modules/user/actions";

import cardImages from "./lucky7cards";
import iframeCards from "./helpers";
import PlaceBetModal from "./PlaceBetModal";

import Rules from "../../assets/img/aaa-rules.jpeg";

import "./style.scss";
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
  };

  componentDidMount() {
    this.getGameConfig();

    this.getBetsList();

    setInterval(() => {
      this.getCoins();
    }, 60000);
  }

  componentWillUnmount() {
    // const { socket_perm } = this.state;
    // if (socket_perm) {
    //   this.socket.emit("leave_room");
    // }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.timer !== this.state.timer) {
      this.setState({ counter: this.state.timer });
      return;
    }

    if (prevState.timer !== this.state.timer || this.state.counter === 0) {
      this.resetCounter();
    }

    if (prevState.market_id !== this.state.market_id) {
      this.setState({ Amar: {}, Akbar: {}, Anthony: {} });

      this.getLastMarketIdResult(prevState.market_id);
    }

    this.setState({ slip_modal: false });
  }

  getCoins = async () => {
    try {
      const response = await httpPost("lucky7_a_position", {}, true);
      if (response.status === "success") {
        const { data } = response;

        this.updateLocalStore(data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  getPlayersPosition = async () => {
    try {
      // const { position = [] } = response || {};

      // position.forEach((team) => {
      //   this.setState({ [team.player_name]: team });
      // });

      this.getCoins();

      // const response = await httpPost("lucky7_a_position", {}, true);

      // if (response.status === "success") {
      //   const { data } = response;

      //   // this.setState({ position });
      //   this.updateLocalStore(data);
      // }
    } catch (e) {
      console.log(e);
    }
  };

  getGameConfig = async () => {
    try {
      const result = await httpGet("amar_akbar_anthony_data", {}, true);

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
          this.socket = io("https://casinosocket.sixpro.in:8080/");
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
    // const { api_hit_time } = this.state;
    const { active_tab, api_hit_time, socket_perm } = this.state;

    if (socket_perm) {
      let isFirst = true;
      this.socket.on("oddsdata", (msg) => {
        const {
          last_team_win,
          market_id,
          odds_data,
          real_time_card_array,
          result,
          timer,
        } = msg.data.amar_akbar_anthony || {};

        if (hit_player_position && isFirst) this.getPlayersPosition(market_id);
        isFirst = false;

        this.setState({
          last_team_win,
          market_id,
          odds_data: odds_data.t2 || [],
          real_time_card_array,
          result,
          timer: Number(timer),
          counter: Number(timer),
        });
      });

      return;
    }

    const response = await httpGet("amar_akbar_anthony_api", null, true);
    const {
      last_team_win,
      // market_id,
      // mid,
      odds_data,
      real_time_card_array,
      result,
      timer,
    } = response.data.data.data || {};
    // console.log(response.data.data.odds_data.t2);
    // return;

    if (hit_player_position) this.getPlayersPosition(odds_data.t2[0].mid);

    this.setState(
      {
        last_team_win,
        market_id: odds_data.t2[0].mid,
        odds_data: odds_data.t2 || [],
        real_time_card_array,
        result,
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
      const { game_type } = this.state;
      const params = { game_type };
      const response = await httpPost("casino_bet_list", params, true);

      this.setState({ bets_list: response.bet_data });
    } catch (err) {
      console.log(err);
    }
  };

  getPlayAlbhapet = (team) => {
    switch (team) {
      case "1":
        return <span className="text-danger">A</span>;
      case "2":
        return <span className="text-white">B</span>;
      case "3":
        return <span className="result-yellow">C</span>;
      default:
        return "";
    }
  };

  selectBetPlayer = (selected_odd) => {
    const data = {
      game_type: selected_odd.game_type,
      player_key: selected_odd.nat,
      market_id: selected_odd.mid,
      rate: selected_odd.rate,
      bet_for: selected_odd.bet_for,
      player: selected_odd.nat,
      sid: selected_odd.sid,
      bet_type: selected_odd.bet_type,
    };
    this.setState({ selected_odd: data, slip_modal: true });
  };

  calculatePositions = (last_bet) => {
    const { positions } = this.state;
  };

  closeModal = (params = false) => {
    this.setState({ slip_modal: false, selected_odd: {} });

    if (params) {
      let { bets_list, positions } = this.state;
      console.log(params);

      const isKhaya = params.bet_type === "K";

      const profit = isKhaya
        ? params.amount
        : Number(params.rate) * params.amount;

      const loss = isKhaya
        ? Number(params.rate) * params.amount
        : params.amount;

      const newBet = [
        {
          ...params,
          profit,
          loss: `-${loss}`,
        },
      ].concat(bets_list);

      let totalPosition = profit;
      const { bet_for } = params;

      if (positions[bet_for]) {
        positions[bet_for] = Number(positions[bet_for]) + totalPosition;
      } else {
        positions[bet_for] = totalPosition;
      }

      this.setState({ bets_list: newBet, positions });
    }
  };

  resetCounter = () => {
    const { counter, timer } = this.state;

    if (timer === 0) {
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

  isLocked = (status) => {
    return true; // status === "CLOSED" || status === "SUSPENDED";
  };

  getOddRate = (rate) => {
    const oddRate = rate > 0 ? rate - 1 : rate;
    return parseFloat(oddRate).toFixed(2);
  };

  getLastMarketIdResult = async (market_id) => {
    try {
      const response = await axios({
        method: "GET",
        url: `http://api.bettexch.net/all_casino_result?market_id=${market_id}`,
      });

      if (response.status && response.data) {
        this.setState({
          last_odds_result: response.data,
        });
      }

      // console.log(response);
      // const response = {
      //   success: true,
      //   data: [
      //     {
      //       mid: "27.222508203831",
      //       sid: "",
      //       win: "2",
      //       cards: "8SS",
      //       desc: "Akbar | Red | Even | Over 7 | Card 8",
      //       gtype: "aaa",
      //     },
      //   ],
      // };
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const {
      result,
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
      counter,
      bets_list,
      winner,
      positions,
      game_type,
    } = this.state;
    let { odds_data } = this.state;

    const { t } = this.props;

    if (!odds_data) odds_data = [];

    return (
      <>
        <a href="/casino" className="casino-back-btn">
          {t("Back")}
        </a>

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
          style={{ background: "#0d6efd", color: "#fff" }}
        >
          <div className="d-flex">
            <Button
              className={`tab-button casino-tabs ${
                active_tab === TABS[0] ? "active" : ""
              }`}
              onClick={() => this.toggleActiveTab(TABS[0])}
            >
              {t(TABS[0])}
            </Button>
            <Button
              className={`tab-button casino-tabs ${
                active_tab === TABS[1] ? "active" : ""
              }`}
              onClick={() => this.toggleActiveTab(TABS[1])}
            >
              {t(TABS[1])}
            </Button>
            <Button
              className="tab-button casino-tabs"
              onClick={this.toggleRulesModal}
            >
              {t("Rules")}
            </Button>
          </div>
          <div>{market_id && market_id.split(".")[1]}</div>
        </div>

        <PlaceBetModal
          is_visible={slip_modal}
          odd={selected_odd}
          game_type={game_type}
          closeModal={this.closeModal}
          max={max_limit}
          min={min_limit}
          updatePosition={this.getPlayersPosition}
          isPositionInResponse={true}
        />

        {is_bet_result && (
          <BetResultData
            market_id={bet_result_market_id}
            casino_type="aaafancy"
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

            <Table className="amar-akbar-anthony">
              <thead>
                <tr>
                  <th colSpan={3}>
                    {t("Min")}: 200/- {t("Max")}: 20,000/-
                  </th>
                </tr>
              </thead>
              <tbody>
                {odds_data.map((odd, i) => {
                  if (
                    odd.nat.includes("Amar") ||
                    odd.nat.includes("Akbar") ||
                    odd.nat.includes("Anthony")
                  ) {
                    const playerPosition = get(positions, odd.nat, 0);
                    return (
                      <tr key={i}>
                        <th>
                          {odd.nat}
                          <br />
                          {playerPosition}
                        </th>
                        <th
                          className="lgaai position-relative"
                          onClick={() => {
                            !this.isLocked(odd.gstatus) &&
                              this.selectBetPlayer({
                                ...odd,
                                rate: this.getOddRate(odd.b1),
                                game_type,
                                bet_for: "team",
                                bet_type: "L",
                              });
                          }}
                        >
                          {this.getOddRate(odd.b1)}
                          {this.isLocked() && (
                            <span className="locked-session">
                              <box-icon color="#fff" name="lock-alt"></box-icon>
                            </span>
                          )}
                        </th>
                        <th
                          className="khaai position-relative"
                          onClick={() => {
                            !this.isLocked(odd.gstatus) &&
                              this.selectBetPlayer({
                                ...odd,
                                rate: this.getOddRate(odd.l1),
                                game_type,
                                bet_for: "team",
                                bet_type: "K",
                              });
                          }}
                        >
                          {this.getOddRate(odd.l1)}
                          {this.isLocked() && (
                            <span className="locked-session">
                              <box-icon color="#fff" name="lock-alt"></box-icon>
                            </span>
                          )}
                        </th>
                      </tr>
                    );
                  }
                  return false;
                })}
              </tbody>
            </Table>

            {false && (
              <div className="casino-cards amar-akbar-anthony">
                <div className="casino-card">
                  {odds_data.map((odd) => {
                    if (odd.nat.includes("Even") || odd.nat.includes("Odd")) {
                      return (
                        <>
                          <p>{odd.b1}</p>
                          <p
                            className="card-strip"
                            onClick={() => {
                              !this.isLocked(odd.gstatus) &&
                                this.selectBetPlayer({
                                  ...odd,
                                  rate: 11,
                                  game_type,
                                  bet_for: "even_odd",
                                });
                            }}
                          >
                            {odd.nat}
                            {this.isLocked(odd.gstatus) && (
                              <span className="locked">
                                <box-icon
                                  color="#fff"
                                  type="solid"
                                  name="lock-alt"
                                ></box-icon>
                              </span>
                            )}
                          </p>
                          <p>0</p>
                        </>
                      );
                    }

                    return false;
                  })}
                </div>

                <div className="casino-card">
                  {odds_data.map((odd) => {
                    if (odd.nat.includes("Red") || odd.nat.includes("Black")) {
                      return (
                        <>
                          <p>{odd.b1}</p>
                          <p
                            className="card-strip"
                            onClick={() => {
                              !this.isLocked &&
                                this.selectBetPlayer({
                                  ...odd,
                                  rate: 11,
                                  game_type,
                                  bet_for: "red_black",
                                });
                            }}
                          >
                            {odd.nat}
                            {this.isLocked(odd.gstatus) && (
                              <span className="locked">
                                <box-icon
                                  color="#fff"
                                  type="solid"
                                  name="lock-alt"
                                ></box-icon>
                              </span>
                            )}
                          </p>
                          <p>0</p>
                        </>
                      );
                    }

                    return false;
                  })}
                </div>

                <div className="casino-card">
                  {odds_data.map((odd) => {
                    if (
                      odd.nat.includes("Under 7") ||
                      odd.nat.includes("Over 7")
                    ) {
                      return (
                        <>
                          <p>{odd.b1}</p>
                          <p
                            className="card-strip"
                            onClick={() => {
                              !this.isLocked &&
                                this.selectBetPlayer({
                                  ...odd,
                                  rate: 11,
                                  game_type,
                                  bet_for: "under_over",
                                });
                            }}
                          >
                            {odd.nat}
                            {this.isLocked(odd.gstatus) && (
                              <span className="locked">
                                <box-icon
                                  color="#fff"
                                  type="solid"
                                  name="lock-alt"
                                ></box-icon>
                              </span>
                            )}
                          </p>
                          <p>0</p>
                        </>
                      );
                    }

                    return false;
                  })}
                </div>
              </div>
            )}

            {false && (
              <div className="row lucky7-cards-lower mt-2 position-relative">
                {odds_data.map((odd) => {
                  if (odd.nat.match(/(?:Card)/i)) {
                    const number = odd.nat.split(" ")[1];

                    if (cardImages[number]) {
                      return (
                        <>
                          {odd.nat === "Card 1" && (
                            <span
                              className="position-absolute text-center"
                              style={{ top: "-4px", marginBottom: "5px" }}
                            >
                              {/* {odd.rate} */} 11
                            </span>
                          )}

                          <span className="position-relative lucky7-cards-img-lower">
                            {this.isLocked(odd.gstatus) && (
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
                                odd.gstatus !== 0 &&
                                this.selectBetPlayer({
                                  ...odd,
                                  rate: 11,
                                  game_type,
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
                  return false;
                })}
              </div>
            )}

            <div className="last-results mb-1 h-70">
              <div className="result-headings">
                <h4>{t("Last Result")}</h4>
                <h4>{t("View Result")}</h4>
              </div>
              <ul className="results mt-2">
                {result.map((bets) => {
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
                          <p>{bet.decision}</p>
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
                      <p>{bet.decision}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
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
  withTranslation("rules"),
  connect(mapStateToProps, { setUserBalance })
)(AmarAkbarAnthony);
