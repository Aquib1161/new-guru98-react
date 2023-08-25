import { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import "boxicons";
import Body from "../components/Body";
import Notification from "../components/Toast";
import { httpPost, httpGet } from "../utils/http";
import Loader from "../components/Loader";
import { getFireToken } from "../firebase";

import { domain, siteName } from "../utils/configs";

export default function Login() {
  const [toast, toggleToast] = useState(false);
  const [toastDesc, toastMsg] = useState("");
  const [is_fetching, setIsFetching] = useState(false);
  const [isTokenFound, setTokenFound] = useState(false);
  const [username, setUserName] = useState(false);
  const [password, setPassword] = useState(false);
  getFireToken(setTokenFound);

  localStorage.setItem("is_old_theme", true);

  const getNotification = async () => {
    try {
      const result = await httpGet("notification");
      if (result.data.status === "success") {
        localStorage.setItem("latestNotification", result.data.msg);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsFetching(true);

    const formData = new FormData(e.target);
    const formDataObj = Object.fromEntries(formData.entries());
    formDataObj.device_token = isTokenFound || "";

    try {
      if (!formDataObj.username.toLowerCase().includes("c")) {
        formDataObj.username = "c" + formDataObj.username;
      }
      const response = await httpPost("ClientLogin", formDataObj);

      if (response.status === "success") {
        localStorage.setItem("access-token", response.data.token);
        localStorage.setItem("user-data", JSON.stringify(response.data));

        await getNotification();

        window.location.href = "/rules";
      } else {
        toggleToast(true);
        toastMsg(response.msg);
        setIsFetching(false);
      }
    } catch (err) {
      console.error(err);
      setIsFetching(false);
    }
  };

  return (
    <div className="login-page">
      {is_fetching && <Loader />}
      <Notification
        isVisible={toast}
        title="Login"
        type="danger"
        message={toastDesc}
        onClose={toggleToast}
      />
      <Body className="d-flex align-items-center body">
        <Container className="h-screen">
          <Row>
            <Col xs={12}>
              <center><img src="https://guru98.com/images/npl/logo_1.png" className="" width={140} height={140} alt="" /></center>
              {/* <h2 className="loginpage-title">{siteName}</h2> */}
              {/* <h5 className="loginpage-subtitle">Sign In</h5> */}
            </Col>
            <Col
              className="m-auto position-relative"
              sm={7}
              md={6}
              lg={4}
              xs={12}
            >
              <Form onSubmit={handleLogin} className="bg-white mx-auto login-form-fields" style={{ width: 100, }} >
                <div className="d-flex flex-column bd-highlight ">
                  <TextField
                    label="Client Code *"
                    id="outlined-start-adornment"
                    name="username"
                    className="login-input-field"
                    onInput={(e) => setUserName(e.target.value)}
                    InputProps={{
                      // startAdornment: (
                      //   <InputAdornment
                      //     className="font-weight-bold"
                      //     position="start"
                      //   >
                      //     C
                      //   </InputAdornment>
                      // ),
                    }}
                  />

                  <TextField
                    label="Password *"
                    className="login-input-field"
                    id="outlined-start-adornment"
                    name="password"
                    type="password"
                    onInput={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="d-flex justify-content-around align-items-center pt-2">

                  <Button
                    type="submit"
                    onSubmit={handleLogin}
                    className="w-100% login-button text-white"
                    variant="contained"
                    disabled={!username || !password}
                  >
                    LOGIN
                  </Button>

                  <Button
                    type="submit"
                 
                    className="w-100% APK-button text-white"
                    variant="contained"
                   >
                    Download APK
                  </Button>

                </div>
              </Form>
            </Col>
          </Row>
          {/* <p
            style={{
              textAlign: "center",
              marginTop: "35px",
              fontSize: "12px",
            }}
          >
            Copyright ©{domain} 2023.
          </p> */}
        </Container>
      </Body>
    </div>
  );
}
