import { Row, Col, Button, Modal } from "react-bootstrap";
import { Link, useOutletContext } from "react-router-dom";
import InPlayIcon from "../assets/img/old/inplay-old.svg";
import CasinoIcon from "../assets/img/old/casino.png";
import CompleteIcon from "../assets/img/old/complete.svg";
import ProfileIcon from "../assets/img/old/profile.png";
import LedgerIcon from "../assets/img/old/ledger.svg";
import PasswordIcon from "../assets/img/old/forgot-password.svg";
import { useState } from "react";

import Footer from "./Footer";

export default function Dashboard() {
  const [isNotification, toggleNotification] = useState(true);

  const hideNotification = () => {
    localStorage.setItem("is_notification_viewed", 1);
    toggleNotification(false);
  };

  const is_notification_viewed = Number(
    localStorage.getItem("is_notification_viewed") || "1" // by default it has to 0
  );

  const { t, changeLanguage } = useOutletContext();
  changeLanguage("en");
  return (
    <>
      <div className="container-fluid mt-3">
        <Modal
          show={isNotification && !is_notification_viewed}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          onHide={() => hideNotification()}
        >
          <Modal.Header
            className="text-center py-1 bg-success text-white"
            closeButton
          >
            <Modal.Title>Welcome to 1xBET</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h6>
              <b>
                <center>Select Language</center>
              </b>
            </h6>
            <div className="d-flex m-auto" style={{ width: "300px" }}>
              <Button
                className="w-100 tab-button match-bets"
                onClick={() => {
                  changeLanguage("en");
                }}
              >
                English
              </Button>
              <Button
                className="w-100 tab-button session-bets"
                onClick={() => {
                  changeLanguage("hindi");
                }}
              >
                Hindi
              </Button>
            </div>
            {/* <h4 className="dashboard-notification">
            प्रिय ग्राहक हमारी आईडी पर कैसीनो चालू है |
          </h4> */}
          </Modal.Body>
          <Modal.Footer className="py-1">
            <Button variant="light" onClick={() => hideNotification()}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        <Row>
          <Col xs={6} sm={6} className="text-center dashboard-icons">
            <Link to="/in-play">
              <img src={InPlayIcon} alt="" className="" />
              <p>{t("In Play")}</p>
            </Link>
          </Col>

          <Col
            xs={6}
            sm={6}
            className="text-center dashboard-icons position-relative"
          >
            <Link to="/casino">
              <img className="" src={CasinoIcon} alt="" />
              <p>{t("Casino")}</p>
            </Link>
          </Col>

          <Col xs={6} sm={6} className="text-center dashboard-icons">
            <Link to="/statement">
              <img src={CompleteIcon} alt="" className="" />
              <p>{t("Complete Games")}</p>
            </Link>
          </Col>

          {/* <Col xs={6} sm={6} className="text-center dashboard-icons">
          <Link to="/FreeGames">
            <img src={Freegames} alt="" className="" />
            <p>{("Free Games")}</p>
          </Link>
        </Col> */}

          <Col xs={6} sm={6} className="text-center dashboard-icons">
            <Link to="/profile">
              <img src={ProfileIcon} alt="" className="" />
              <p>{t("My Profile")}</p>
            </Link>
          </Col>

          <Col xs={6} sm={6} className="text-center dashboard-icons">
            <Link to="/ledger">
              <img src={LedgerIcon} alt="" className="" />
              <p>{t("My Ledger")}</p>
            </Link>
          </Col>

          <Col xs={6} sm={6} className="text-center dashboard-icons">
            <Link to="/password">
              <img src={PasswordIcon} alt="" className="" />
              <p>{t("Change Password")}</p>
            </Link>
          </Col>
        </Row>
      </div>
      {/* <Footer /> */}
      {/* <Footer buttonClass="casino-back-btn" /> */}
    </>
  );
}
