import * as React from 'react';
import { Row, Col, Button, Modal } from "react-bootstrap";
import { Link, useOutletContext } from "react-router-dom";
import freegame from "../assets/img/freegames.jpg";
import Footer from "./Footer";


 class FreeGames extends React.Component{
  render() {
    return (
     <>

<Row className='mt-4'>
        <Col xs={6} sm={3} className="text-center dashboard-icons">
          <Link to="/cricket">
            <img src={freegame} alt="" className="card_3d"/>
            <p>Cricket</p>
          </Link>
        </Col>

        <Col
          xs={6}
          sm={3}
          className="text-center dashboard-icons position-relative"
        >
          <Link to="/croudrun" >
            <img className="card_3d" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNfougH7w9UtmimFTmOXKqlZq_QI-roYb-JQ&usqp=CAU"  alt="" />
            <p>Croud Run 3D</p>
          </Link>
        </Col>

        <Col
          xs={6}
          sm={3}
          className="text-center dashboard-icons position-relative"
        >
          <Link to="/bubble" >
            <img className="card_3d" src="https://static.keygames.com/9/78739/44869/672x448/bubble-shooter.webp"  alt="" />
            <p>Bubble</p>
          </Link>
        </Col>

        <Col
          xs={6}
          sm={3}
          className="text-center dashboard-icons position-relative"
        >
          <Link to="/rummy" >
            <img className="card_3d" src="https://cdn.playerzpot.com/images/rummy.png"  alt="" />
            <p>Rummy</p>
          </Link>
        </Col>


        </Row>

        <Footer/>
     </>
    );
  };
};

export default FreeGames