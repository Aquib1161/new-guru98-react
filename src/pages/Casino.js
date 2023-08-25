import { Link, useOutletContext } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";

// import TeenPatti from "../assets/img/teen-patti.webp";
// import DragonTiger from "../assets/img/dragon-tiger.webp";
// import Lucky7 from "../assets/img/Lucky7.webp";
// import AAA from "../assets/img/aaa.png";
import BackToMenu from "../components/BackToMenu";
import Footer from "./Footer";

const Casino = () => {
  const { t } = useOutletContext();

  const comingSoon = () => {
    alert("Coming Soon");
    return false;
  };
  return (
    <>
      <BackToMenu></BackToMenu>
      <Container>
        <Row className="align-items-end mt-2 ">
          <Col xs={6} sm={4} className="text-center mt-2">
            <Link to="/casino/twenty-twenty-teenpatti" className="text-dark">
              <img
                height={100}
                src="https://m.fawk.app/assets/images/Games/new/Teenpatti%20T20.png"
                alt=""
                className="w-100 card_3d"
              />
              {/* <b>TeenPatti T-20 </b> */}
            </Link>
          </Col>

          <Col xs={6} sm={4} className="text-center mt-2 ">
            <Link to="/casino/dragon-tiger" className="text-dark">
              <img
                height={100}
                src="https://m.fawk.app/assets/images/Games/new/Dragon%20Tiger.png"
                alt=""
                className="w-100 card_3d"
              />
              {/* <b>Dragon Tiger</b> */}
            </Link>
          </Col>

          <Col xs={6} sm={4} className="text-center ">
            <Link to="/casino/lucky-7" className="text-dark mt-2">
              <img
                height={100}
                src="https://m.fawk.app/assets/images/Games/new/7%20up%20&%20Down.png"
                alt=""
                className="w-100 card_3d"
              />
              {/* <b>Lucky 7</b> */}
            </Link>
          </Col>

          <Col xs={6} sm={4} className="text-center mt-2 ">
            <Link to="/casino/aaa" className="text-dark">
              <img
                height={100}
                src="https://m.fawk.app/assets/images/Games/new/Amar%20Akbar%20Anthony.png"
                alt=""
                className="w-100 card_3d"
              />
              {/* <b>AAA</b> */}
            </Link>
          </Col>
        </Row>

        <img
          style={{ marginBottom: "60px" }}
          height={100}
          src="https://victoryexch.com/images/slider/slider3.jpg"
          alt=""
          className="w-100 card_3d mt-4"
        />
      </Container>

      {/* <BackToMenu></BackToMenu> */}
      <Footer buttonClass="casino-back-btn" />
    </>
  );
};

export default Casino;
