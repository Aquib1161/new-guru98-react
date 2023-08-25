import React from "react";
import { Modal, Row, Col } from "react-bootstrap";
import { httpGet, httpPost } from "../../utils/http";

import cardImages from "./helpers";

import Trophy from "../../assets/img/trophy.png";

import "./style.scss";
import axios from "axios";

const game_types = {
  teen_patti_t20: "20-20 Teenpatti Result",
};

class BetResultData extends React.Component {
  state = {
    betResult: null,
  };

  componentDidMount() {
    this.getbetResultData();
  }

  getbetResultData = async () => {
    try {
      // casino_type,
      const { market_id, closeModal } = this.props;
      const params = {
        market_id,
      };

      const response = await httpPost("casino_result_data", params, true);
      // const response = await axios.get(
      //   `http://adminhub777.net/cas-apis/all_casino_result?market_id=${market_id}`,
      //   {},
      //   true
      // );
      if (Array.isArray(response)) {
        closeModal();
        return;
      }
      this.setState({ betResult: response.data[0] }); //response.data
    } catch (e) {
      console.log(e);
    }
  };

  getPlayerACards = (cards) => {
    const cardsArray = cards.split(",");
    const middleIndex = Math.ceil(cardsArray.length / 2);

    return cardsArray.splice(0, middleIndex);
  };

  getPlayerBCards = (cards) => {
    const cardsArray = cards.split(",");
    const middleIndex = Math.ceil(cardsArray.length / 2);

    return cardsArray.splice(middleIndex * -1);
  };

  isTeenPatti = () => {
    const { casino_type } = this.props;

    if (casino_type == "dragon_tiger") {
      return false;
    }

    return true;
  };

  isLucky7 = () => {
    const { casino_type } = this.props;

    return casino_type === "lucky7_a";
  };

  render() {
    const { is_visible, closeModal, casino_type, market_id, winner } =
      this.props;
    const { betResult } = this.state;

    return (
      <>
        <Modal show={is_visible} center onHide={closeModal}>
          <Modal.Header closeButton>{game_types[casino_type]}</Modal.Header>
          <Modal.Body>
            {betResult && (
              <>
                <p className="text-right">
                  <strong>Round ID: </strong>
                  {market_id.split(".")[1]}
                </p>
                <div className="bet-result">
                  <Row>
                    <Col xs={this.isLucky7() ? 12 : 6} className="text-center">
                      <h4>
                        {!this.isLucky7()
                          ? this.isTeenPatti()
                            ? "Player A"
                            : "Dragon"
                          : ""}
                        {this.isLucky7() && "Player"}
                        {winner == 1 && (
                          <img
                            src={Trophy}
                            alt=""
                            style={{
                              position: "absolute",
                              marginTop: "-10px",
                              marginLeft: "6px",
                              width: "30px",
                            }}
                          />
                        )}
                      </h4>
                      <div
                        className={`bet-cards ${casino_type} ${
                          this.isLucky7() && "justify-content-center"
                        }`}
                      >
                        {this.getPlayerACards(betResult.cards).map(
                          (card, i) => {
                            console.log(card);
                            return (
                              <span key={i}>
                                <img src={`${cardImages[card]}`} alt="" />
                              </span>
                            );
                          }
                        )}
                      </div>
                    </Col>
                    <Col xs={6} className="text-center">
                      <h4>
                        {!this.isLucky7()
                          ? this.isTeenPatti()
                            ? "Player B"
                            : "Tiger"
                          : ""}{" "}
                        {winner == (this.isTeenPatti() ? 3 : 2) && (
                          <img
                            src={Trophy}
                            alt=""
                            style={{
                              position: "absolute",
                              marginTop: "-10px",
                              marginLeft: "6px",
                              width: "30px",
                            }}
                          />
                        )}
                      </h4>
                      {!this.isLucky7() && (
                        <div className={`bet-cards ${casino_type}`}>
                          {this.getPlayerBCards(betResult.cards).map(
                            (card, i) => {
                              return (
                                <span key={i}>
                                  <img src={`${cardImages[card]}`} alt="" />
                                </span>
                              );
                            }
                          )}
                        </div>
                      )}
                    </Col>
                  </Row>
                </div>
              </>
            )}
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default BetResultData;
