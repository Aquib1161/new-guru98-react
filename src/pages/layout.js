import { Suspense, useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { connect } from "react-redux";
import ThemeProvider from "react-bootstrap/ThemeProvider";
import { useTranslation } from "react-i18next";
import { httpPost } from "../utils/http";
import Loader from "../components/Loader";
import { Navbar, Container } from "react-bootstrap";

import profile from "../assets/img/profile.gif";
import logout from "../assets/img/logout.png";

import { setUserBalance } from "../modules/user/actions";
import VerifyAuth from "../utils/VerifyAuth";
import "../assets/style/style.scss";

const isOldActive = localStorage.getItem("is_old_theme");
const language = localStorage.getItem("selectedLanguage");
const pathname = window.location.pathname;
const exposure = localStorage.getItem("exposure");
const plus_minus = localStorage.getItem("plus_minus");
const Layout = ({ ...props }) => {
  const location = useLocation();
  const [isLoading, toggleLoader] = useState(false);
  const [isRefreshDisabled, toggleRefreshCoins] = useState(false);
  const [url, setUrl] = useState(null);
  const [isOld, toggleOldTheme] = useState(
    isOldActive && isOldActive === "true" ? true : false
  );
  const [notification, setNotification] = useState(null);
  const [selectedLanguage, setLanguage] = useState(language || "hindi");
  const { i18n, t } = useTranslation("rules");

  useEffect(() => {
    setUrl(location.pathname);
    // refreshCoins();
    checkNotify();
  }, [location]);

  useEffect(() => {
    i18n.changeLanguage(selectedLanguage);
    localStorage.setItem("selectedLanguage", selectedLanguage);
  }, [selectedLanguage]);

  useEffect(() => {
    localStorage.setItem("is_old_theme", isOld);
  }, [isOld]);

  const expand = "navbar";

  const userDetails = JSON.parse(localStorage.getItem("user-data"));

  if (userDetails?.data?.total_coins) {
    props.setUserBalance(userDetails?.data?.total_coins);
  }

  const checkNotify = async () => {
    const msg = localStorage.getItem("latestNotification");
    setNotification(msg);
  };

  const { balance } = props;
  return (
    <VerifyAuth>
      <ThemeProvider
        breakpoints={["xxxl", "xxl", "xl", "lg", "md", "sm", "xs", "xxs"]}
      >
        {isLoading && <Loader />}
        <Suspense fallback="loading">
          <Navbar
            width="40"
            key={expand}
            variant="dark"
            expand={expand}
            className={pathname == "/rules" ? "bg-theme-dark_rules p-0" : "bg-theme-dark p-0"}
          >
            <Container fluid style={{ padding: "3px", fontWeight: "bold" }}>
              <div>
                <a href="/dashboard" className="logo">
                  <img src={profile} alt="profile" style={{ width: "40px" }} />
                </a>
              </div>
              <div className="profile-details text-center">
                <div>
                  <p className="m-0">
                    {userDetails?.data?.name} ({userDetails?.data?.username})
                  </p>

                </div>
                <div>
                  <p>
                    {t("coins")}: {balance}
                  </p>
                </div>
              </div>
              <div>
                <a href="/logout" className="logo">
                  <img src={logout} alt="logout" style={{ width: "30px" }} />
                </a>
              </div>
            </Container>

            {pathname !== "/rules" && notification && (
              <marquee className="notification">{notification}</marquee>
            )}
          </Navbar>

          <div className="position-relative">
            <Outlet context={{ changeLanguage: setLanguage, t: t }} />
          </div>
        </Suspense>
      </ThemeProvider>
    </VerifyAuth>
  );
};

const mapStateToProps = (state) => {
  return {
    balance: state.user.balance,
  };
};

export default connect(mapStateToProps, { setUserBalance })(Layout);
