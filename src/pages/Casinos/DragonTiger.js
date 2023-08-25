import React from "react";
import { Button, Table, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { compose } from "redux";
import { withTranslation } from "react-i18next";
import io from "socket.io-client";
import { httpGet, httpPost } from "../../utils/http";
import { setUserBalance } from "../../modules/user/actions";
import cardImages from "./helpers";
import PlaceBetModal from "./PlaceBetModal";
import PlacedBets from "./PlacedBets";
import DTRules from "../../assets/img/dragon-tiger.jpeg";
import "./style.scss";
import BetResultData from "./BetResultData";
import "./style.scss";
import { SOCKET_URL, DRAGON_TIGER_URL } from "../../utils/configs";
import Notification from "../../components/Toast";
import axios from "axios";
import BackToMenu from "../../components/BackToMenu";

const TABS = ["Game", "Placed Bets"];
const DEFAULT_SECS = 1000;

class DragonTiger extends React.Component {
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
    max_limit: 0,
    min_limit: 0,
    iframe_url: "", // "https://backlayexchange.com/new/2020",
    position: [],
    socket_perm: 0,
    slip_modal: false,
    selected_odd: {},
    active_tab: TABS[0],
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
    if (prevState.timer !== this.state.timer) {
      this.setState({ counter: this.state.timer });
    }

    // if (prevState.timer != this.state.timer || this.state.counter === 0) {
    //   this.resetCounter();
    // }

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

  getGameConfig = async () => {
    try {
      const result = await httpGet("dragon_tiger_data", {}, true);

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
          this.socket.emit("JoinRoom", "dragon_tiger");
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
        console.log("error");
      }
    } catch (e) {
      console.log(e);
    }
  };

  getGameRecurringData = async (hit_player_position = false) => {
    const { active_tab, api_hit_time, socket_perm } = this.state;

    if (socket_perm) {
      let isFirst = true;

      this.socket.on("dragon_tiger", (msg) => {
        msg = JSON.parse(msg);
        const {
          last_team_win,
          market_id,
          odds_data,
          real_time_card_array,
          result,
          timer,
        } = msg.data.dragon_tiger || {};

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

    // const response = await httpGet("dragon_tiger_api", null, true);
    const response = await await axios.get(DRAGON_TIGER_URL);

    const {
      last_team_win,
      market_id,
      odds_data,
      real_time_card_array,
      result,
      timer,
    } = response.data.data.dragon_tiger || {};

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

  getPlayersPosition = async (market_id) => {
    try {
      const response = await httpPost(
        "dragon_tiger_position",
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

  getBetsList = async () => {
    try {
      const params = { game_type: "DRAGON TIGER" };
      const response = await httpPost("casino_bet_list", params, true);

      this.setState({ bets_list: response.bet_data });
    } catch (err) {
      console.log(err);
    }
  };

  getPlayAlbhapet = (team) => {
    switch (team) {
      case "1":
        return <span style={{ color: "#2c3e50" }}>D</span>;
      case "2":
        return <span style={{ color: "#E8FF22" }}>T</span>;
      case "3":
        return <span className="result-green">TIE</span>;
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

  // resetCounter = () => {
  //   const { counter, timer } = this.state;

  //   if (timer == 0) {
  //     return;
  //   }

  //   if (counter == 0) {
  //     return;
  //   }

  //   setInterval(() => {
  //     this.setState({ counter: counter - 1 || 0 });
  //   }, 1000);
  // };

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

  hideNotification = () => {
    this.setState({ is_notification: false });
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
            <img src={DTRules} alt="" width="100%" />
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
          <div>{market_id.split(".")[1]}</div>
        </div>

        {slip_modal && (
          <PlaceBetModal
            is_visible={slip_modal}
            odd={selected_odd}
            game_type="DRAGON TIGER"
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
            casino_type="dragon_tiger"
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
                  <b>Dragon</b>
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
                  <b>Tiger</b>
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
                    backgroundColor: "#2c3e50",
                    textAlign: "right",
                    color: "white",
                  }}
                >
                  {/* <th>
                    {t("Min")}: {min_limit}/- {t("Max")}: {max_limit}/-
                  </th> */}
                  <th colSpan={2} className="lgaai">
                    {t("Back")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {odds_data.map((odd, i) => {
                  return (
                    <tr>
                      <th className="d-flex justify-content-between">
                        {odd.player}
                        {position && (
                          <span
                            className={
                              position[i].total_profit < 0
                                ? "text-danger"
                                : "text-success"
                            }
                          >
                            {position[i].total_profit}
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
                  );
                })}
              </tbody>
            </Table>

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
              <div className="result-headings" style={{ width: "100%" }}>
                <h4>{t("Placed Bets")}</h4>
              </div>

              <PlacedBets bets_list={bets_list} game_type="DRAGON TIGER" />
            </div>
          </>
        )}

        {active_tab === TABS[1] && (
          <PlacedBets bets_list={bets_list} game_type="DRAGON TIGER" />
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
)(DragonTiger);
