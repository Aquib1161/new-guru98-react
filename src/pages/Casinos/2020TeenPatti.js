import React from "react";
import { Button, Table, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { compose } from "redux";
import io from "socket.io-client";
import { httpGet, httpPost } from "../../utils/http";
import { setUserBalance } from "../../modules/user/actions";
import cardImages from "./helpers";
import PlaceBetModal from "./PlaceBetModal";
import PlacedBets from "./PlacedBets";
import Rules from "../../assets/img/teenpatti-rules.jpg";
import "./style.scss";
import BetResultData from "./BetResultData";
import { SOCKET_URL, TEENPATTI_URL } from "../../utils/configs";
import { withTranslation } from "react-i18next";
import Notification from "../../components/Toast";
import axios from "axios";
import BackToMenu from "../../components/BackToMenu";

const TABS = ["Game", "Placed Bets"];
const DEFAULT_SECS = 1000;

class TwentyTeenPatti extends React.Component {
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
    iframe_url: "https://backlayexchange.com/new/2020",
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
    if (prevState.timer != this.state.timer) {
      this.setState({ counter: this.state.timer });
      return;
    }

    if (prevState.timer != this.state.timer || this.state.counter === 0) {
      this.resetCounter();
    }

    if (prevState.market_id != this.state.market_id) {
      const { position } = this.state;

      if (!position) return;
      const newPosition = position.map((pos) => {
        pos.total_profit = 0;
        return pos;
      });

      this.setState({ position: newPosition, slip_modal: false });
    }
  }

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

  getPlayersPosition = async (market_id) => {
    try {
      const response = await httpPost(
        "teen_patti_t20_position",
        { market_id },
        true
      );

      if (response.status === "success") {
        const { coins, position } = response.data;
        this.setState({ position });
        this.updateLocalStore(coins);
      }
    } catch (e) {
      console.log(e);
    }
  };

  getGameConfig = async () => {
    try {
      const result = await httpGet("teenpatti_t20_data", {}, true);

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
          this.socket = io.connect(SOCKET_URL);
          this.socket.emit("JoinRoom", "t20");
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
      this.socket.on("t20", (msg) => {
        msg = JSON.parse(msg);
        const {
          last_team_win,
          market_id,
          odds_data,
          real_time_card_array,
          result,
          timer,
        } = msg.data.teen_patti_t20 || {};

        if (hit_player_position && isFirst) this.getPlayersPosition(market_id);
        isFirst = false;

        this.setState({
          last_team_win,
          market_id,
          odds_data,
          real_time_card_array,
          result,
          timer: Number(timer),
          counter: Number(timer),
        });
      });
      return;
    }

    const response = await await axios.get(TEENPATTI_URL);

    const {
      last_team_win,
      market_id,
      odds_data,
      real_time_card_array,
      result,
      timer,
    } = response.data.data.teen_patti_t20;

    if (hit_player_position) this.getPlayersPosition(market_id);

    this.setState(
      {
        last_team_win,
        market_id,
        odds_data,
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
      const params = { game_type: "TEENPATTI T20" };
      const response = await httpPost("casino_bet_list", params, true);

      this.setState({ bets_list: response.bet_data });
    } catch (err) {
      console.log(err);
    }
  };

  getPlayAlbhapet = (team) => {
    switch (team) {
      case "1":
        return <span style={{ color: "#002D5B" }}>A</span>;
      case "2":
        return <span style={{ color: "green" }}>T</span>;
      case "3":
        return <span style={{ color: "#E8FF22" }}>B</span>;
      default:
        return "";
    }
  };

  selectBetPlayer = (selected_odd) => {
    this.setState({ selected_odd, slip_modal: true });
  };

  closeModal = (params = false) => {
    this.setState({ slip_modal: false, selected_odd: {} });

    if (params) {
      let { bets_list } = this.state;

      const newBet = [
        {
          player_name: params.player_name,
          market_id: params.market_id,
          profit: (Number(params.rate) - 1) * params.amount,
          loss: "-" + params.amount,
          amount: params.amount,
          decision: "",
        },
      ].concat(bets_list);

      this.setState({ bets_list: newBet });
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

  render() {
    const {
      odds_data,
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
    } = this.state;

    const { t } = this.props;

    return (
      <>
        {/* <a href="/casino" className="casino-back-btn">
          {t("Back")}
        </a> */}

        <Notification
          isVisible={this.state.is_notification}
          type={this.state.noti_type || "success"}
          title=""
          message={this.state.noti_msg}
          onClose={this.hideNotification}
        />

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
              style={{ backgroundColor: "#2c3e50", border: "2px white" }}
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
            game_type="TEENPATTI T20"
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
            casino_type="teen_patti_t20"
            is_visible={is_bet_result}
            closeModal={this.closeResultModal}
            winner={winner}
          />
        )}

        {active_tab === TABS[0] && (
          <>
            <div className="position-relative" style={{ height: "320px" }}>
              <p className="last-won">
                <span>{t("Last Won")}:</span>
                <span>{last_team_win}</span>
              </p>

              <span class="counter">
                <b class="counter-number">{counter}</b>
              </span>

              <div className="cards">
                <div>
                  <b>Player A</b>
                  <ul className="player-cards">
                    {real_time_card_array.playerA_card.map((card, i) => {
                      return (
                        <li key={i}>
                          <img src={`${cardImages[card]}`} alt="" />
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div>
                  <b>Player B</b>
                  <ul className="player-cards">
                    {real_time_card_array.playerB_card.map((card, i) => {
                      return (
                        <li key={i}>
                          <img src={`${cardImages[card]}`} alt="" />
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              <iframe
                src={iframe_url}
                title="Live Casino"
                width="100%"
                height="320px"
              />
            </div>

            <Table className="mb-0">
              <thead>
                <tr
                  style={{
                    backgroundColor: "#002D5B",
                    textAlign: "right",
                    color: "white",
                  }}
                >
                  {/* <th>
                    {t("Min")}: {min_limit}/- {t("Max")}: {max_limit}/-
                  </th> */}
                  <th colSpan={2} width="80">
                    {t("Back")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {odds_data.map((odd, i) => {
                  return (
                    (i === 0 || i === 2) && (
                      <tr>
                        <th className="d-flex justify-content-between">
                          {odd.player}
                          {position && (
                            <span>
                              {position.map((player) => {
                                if (player.player_name == odd.player) {
                                  return (
                                    <span
                                      className={
                                        player.total_profit < 0
                                          ? "text-danger"
                                          : "text-success"
                                      }
                                    >
                                      {player.total_profit}
                                    </span>
                                  );
                                }
                              })}
                            </span>
                          )}
                        </th>
                        <th
                          className="casino_lgaai position-relative"
                          onClick={() => {
                            odd.status != 0 && this.selectBetPlayer(odd);
                          }}
                        >
                          {odd.rate}
                          {odd.status == 0 && (
                            <span className="locked-session">
                              <box-icon color="#fff" name="lock-alt"></box-icon>
                            </span>
                          )}
                        </th>
                      </tr>
                    )
                  );
                })}
              </tbody>
            </Table>

            <div className="last-results mb-1 h-70">
              <div className="result-headings">
                <h4>{t("Last Result")}</h4>
                <h4>{t("View Result")}</h4>
              </div>
              <ul className="results mt-2 mb-0">
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
              <div className="result-headings">
                <h4>{t("Placed Bets")}</h4>
              </div>

              <PlacedBets bets_list={bets_list} game_type="TEENPATTI T20" />
            </div>
          </>
        )}

        {active_tab === TABS[1] && (
          <PlacedBets bets_list={bets_list} game_type="TEENPATTI T20" />
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
)(TwentyTeenPatti);
