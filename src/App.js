import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./pages/layout";
import Login from "./pages/login";
import Rules from "./pages/Rules";
import Dashboard from "./pages/Dashboard";
import Ledger from "./pages/Ledger";
import Passbook from "./pages/Passbook";
import Matkaplay from "./pages/Matkaplay";
import Matches from "./pages/Matches";
import Statement from "./pages/Statement";
import ViewStatement from "./pages/ViewStatement";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import Logout from "./pages/Logout";
import InPlay from "./pages/InPlay";
import FreeGames from "./pages/FreeGames";

// import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import "./assets/style/style.scss";
import Casino from "./pages/Casino";
import AmarAkbarAnthony from "./pages/Casinos/AmarAkbarAnthony";
import TwentyTeenPatti from "./pages/Casinos/2020TeenPatti";
import DragonTiger from "./pages/Casinos/DragonTiger";
import CasinoStatement from "./pages/Casinos/CasinoStatement";
import Lucky7 from "./pages/Casinos/Lucky7";

import { useState } from "react";
import { onMessageListener } from "./firebase";

import { connect } from "react-redux";
import { compose } from "redux";
import { func } from "prop-types";
import { setUserBalance } from "./modules/user/actions";

function App({ ...props }) {
  const updateLocalStore = (data) => {
    const userDetails = JSON.parse(localStorage.getItem("user-data"));

    userDetails.data.total_coins = data.total_coins;
    props.setUserBalance(data.total_coins);
    localStorage.setItem("user-data", JSON.stringify(userDetails));
  };

  onMessageListener()
    .then((payload) => {
      console.log(payload);
      updateLocalStore(JSON.parse(payload.data.body));
    })
    .catch((err) => console.log("failed: ", err));

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" index element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index path="/" element={<Dashboard />} />
          <Route path="rules" element={<Rules />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="ledger" element={<Ledger />} />
          <Route path="passbook" element={<Passbook />} />
          <Route path="matkaplay" element={<Matkaplay />} />
          <Route path="statement" element={<Statement />} />
          <Route path="view-statement" element={<ViewStatement />} />
          <Route path="casino-statement" element={<CasinoStatement />} />
          <Route path="FreeGames" element={<FreeGames />} />
          <Route
            path="in-play"
            exact
            strict
            element={<Matches status="inplay" />}
          />
          <Route
            path="upcoming"
            strict
            exact
            element={<Matches status="upcoming" />}
          />
          <Route path="profile" element={<Profile />} />
          <Route path="password" element={<ChangePassword />} />
          <Route path="logout" element={<Logout />} />
          <Route path="play-match" element={<InPlay />} />

          <Route path="/casino">
            <Route path="" element={<Casino />} />
            <Route path="aaa" element={<AmarAkbarAnthony />} />
            <Route path="lucky-7" element={<Lucky7 />} />
            <Route
              path="twenty-twenty-teenpatti"
              element={<TwentyTeenPatti />}
            />
            <Route path="dragon-tiger" element={<DragonTiger />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

InPlay.propTypes = {
  t: func,
};

const mapStateToProps = (state) => {
  return {
    balance: state.user.balance,
  };
};

export default compose(connect(mapStateToProps, { setUserBalance }))(App);
