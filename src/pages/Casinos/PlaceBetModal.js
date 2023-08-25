import React from "react";
import { func } from "prop-types";

import {
  Modal,
  Button,
  Container,
  Row,
  Col,
  FormGroup,
  FormLabel,
  FormControl,
} from "react-bootstrap";

import { withTranslation } from "react-i18next";

import { httpPost } from "../../utils/http";
import Notification from "../../components/Toast";

const COIN_OPTIONS = [100, 200, 500, 1000, 5000, 10000, 20000];

class PlaceBetModal extends React.Component {
  state = {
    counter: 0,
    bet_amount: "",
    is_notification: false,
    is_bet_in_progress: false,
  };

  interval = 0;

  componentDidMount() {
    this.setState({ counter: 7 });

    clearInterval(this.interval);
    this.interval = setInterval(() => {
      const { counter } = this.state;

      if (counter > 0) {
        this.setState({ counter: counter - 1 });
      }

      if (counter === 0) this.props.closeModal();
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.is_visible !== this.props.is_visible) {
      this.setState({ bet_amount: "" });
    }
  }

  luckyDataFormatter = () => {
    const { odd } = this.props;
    const { bet_amount } = this.state;

    return { ...odd, amount: bet_amount };
  };

  placeBet = async () => {
    try {
      const {
        odd: {
          player_key,
          market_id,
          player,
          rate,
          sid = null,
          bet_type = null,
        },
        game_type,
        min,
        max,
        updatePosition,
        isPositionInResponse = false,
      } = this.props;
      const { bet_amount } = this.state;

      if (Number(bet_amount) < Number(min)) {
        alert(`Minimum bet amount is ${min}`);
        return;
      }

      if (Number(bet_amount) > Number(max)) {
        alert(`Maximum bet amount is ${max}`);
        return;
      }

      let params = {
        game_type,
        key: player_key,
        market_id,
        amount: bet_amount,
        rate,
        bet_for: player,
        player_name: player,
        sid,
        bet_type,
      };

      if (game_type === "LUCKY7 A") params = this.luckyDataFormatter();

      this.setState({ is_bet_in_progress: true });

      const response = await httpPost("save_teenpatti_bet", params, true);

      if (response.status === "error") {
       /* this.setState({
          noti_type: "danger",
          noti_msg: response.msg,
          is_notification: true,
          amount: "",
          is_bet_in_progress: false,
        }); */
        this.props.setAlert({
          noti_type: "danger",
          noti_msg: response.msg,
          is_notification: true,
          amount: "",
          is_bet_in_progress: false,
        });
        this.props.closeModal();
       // setTimeout(()=>{ this.props.closeModal()}, 9000);
       // 
      } else {
      
        /*this.setState({
          noti_type: "success",
          noti_msg: "Bet Placed Successfully",
          is_notification: true,
          amount: "",
          is_bet_in_progress: false,
        }); 
        */
        this.props.setAlert({
          noti_type: "success",
          noti_msg: "Bet Placed Successfully",
          is_notification: true,
          amount: "",
          is_bet_in_progress: false,
        });

        updatePosition(isPositionInResponse ? response : market_id);
       // this.props.closeModal(params);
        this.props.closeModal(params);

       //setTimeout(()=>{  this.props.closeModal(params)}, 9000);
      }
    } catch (e) {
      console.log(e);
    }
  };

  updateBetAmount = (bet_amount) => {
    this.setState({ bet_amount });
  };

  hideNotification = () => {
    this.setState({ is_notification: false });
  };

  render() {
    const {
      bet_amount,
      is_notification,
      noti_type,
      noti_msg,
      is_bet_in_progress,
      counter,
    } = this.state;

    const {
      t,
      closeModal,
      odd: { rate, player },
      min,
      max,
      is_visible,
    } = this.props;

    return (
      <>
        <Notification
          isVisible={is_notification}
          type={noti_type || "success"}
          title=""
          message={noti_msg}
          onClose={this.hideNotification}
        />

        <Modal 
          show={is_visible}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          onHide={() => closeModal()}
          className="casino-bet-modal position-relative"
        >
          {is_bet_in_progress && (
            <div className="casino-loader">
              <div class="lds-dual-ring"></div>
            </div>
          )}
          <Modal.Header closeButton style={{background:"#E26F7E"}}>
            <Modal.Title id="contained-modal-title-vcenter">
              {t("Place Bet")} on {player}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{background:"#E26F7E"}}>
            <Container>
              <Row>
                <Col sm={6} xs={6}>
                  <FormGroup>
                    <FormLabel>{t("Rate")}</FormLabel>
                    <FormControl type="Number" readOnly value={rate} />
                  </FormGroup>
                </Col>
                <Col sm={6} xs={6}>
                  <FormGroup>
                    <FormLabel>{t("Amount")}</FormLabel>
                    <FormControl
                      type="Number"
                      onChange={(e) => this.updateBetAmount(e.target.value)}
                      max={max}
                      min={min}
                      value={bet_amount}
                    />
                  </FormGroup>
                </Col>
              </Row>

              <Row className="mt-3">
                <Col
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  className="casino-bet-amounts"
                >
                  {COIN_OPTIONS.map((price) => {
                    return (
                      <Button
                        key={price}
                        className="bet-price-btn"
                        onClick={() => this.updateBetAmount(price)}
                      >
                        {price}
                      </Button>
                    );
                  })}
                </Col>
              </Row>
            </Container>
          <Modal.Footer className="mt-4">
            <Button variant="light" onClick={closeModal}>
              Cancel
            </Button>

            <Button variant="success" onClick={this.placeBet}>
              Place Bet
            </Button>
            <Button variant="danger">{counter}</Button>
          </Modal.Footer>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

PlaceBetModal.propTypes = {
  t: func,
};

export default withTranslation()(PlaceBetModal);
