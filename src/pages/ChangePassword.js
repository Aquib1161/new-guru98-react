import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  FormGroup,
  InputGroup,
  Button,
  FormControl,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";

import Notification from "../components/Toast";

import { httpPost } from "../utils/http";
import BackToMenu from "../components/BackToMenu";

export default function ChangePassword() {
  const [toast, toggleToast] = useState(false);
  const [toastDesc, toastMsg] = useState("");
  const [toastType, setToastType] = useState("");
  const { t } = useOutletContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const formDataObj = Object.fromEntries(formData.entries());

      if (formDataObj.password !== formDataObj.confirm_password) {
        toggleToast(true);
        toastMsg(t("New Password and Confirm Password must be same"));
        setToastType("danger");
        return false;
      }

      if (formDataObj.password == "" || formDataObj.confirm_password == "") {
        toggleToast(true);
        toastMsg(t("Please Enter Password"));
        setToastType("danger");
        return false;
      }

      const result = await httpPost("ClientPassword", formDataObj);

      if (result.status === "error") {
        toggleToast(true);
        toastMsg(result.msg);
        setToastType("danger");
      } else {
        toggleToast(true);
        setToastType("success");
        toastMsg(result.msg);
        window.location.href = "logout";
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Notification
        isVisible={toast}
        title=""
        type={toastType}
        message={toastDesc}
        onClose={() => toggleToast(false)}
      />
      <Container>
        <Row>
          <Col className="m-auto mt-4" sm={7} md={6} lg={4} xs={12}>
            <Card className="p-4">
              <h4 className="card-title" style={{ color: "#21618c", fontSize: "20px", fontWeight: 500, fontFamily: "Roboto,Helvetica Neue,sans-serif" }}>
                Reset Password
              </h4>
              <Form onSubmit={handleSubmit}>
                <FormGroup className="my-2">
                  {/* <FormLabel>{t("Current Password")}</FormLabel> */}
                  <InputGroup className="mb-3">
                    <InputGroup.Text className="bg-dark-opacity">
                      {/* <box-icon
                        color="#E91E63"
                        type="solid"
                        name="unity"
                      ></box-icon> */}
                      <box-icon name="label"></box-icon>
                    </InputGroup.Text>
                    <FormControl
                      placeholder={t("Old Password")}
                      name="old_password"
                      type="password"
                    />
                  </InputGroup>
                </FormGroup>

                <FormGroup className="my-2">
                  {/* <FormLabel>{t("New Password")}</FormLabel> */}
                  <InputGroup className="mb-3">
                    <InputGroup.Text className="bg-dark-opacity">
                      <box-icon type="solid" name="key"></box-icon>
                    </InputGroup.Text>
                    <FormControl
                      placeholder={t("New Password")}
                      name="password"
                      type="password"
                    />
                  </InputGroup>
                </FormGroup>

                <FormGroup className="my-2">
                  {/* <FormLabel>{}</FormLabel> */}
                  <InputGroup className="mb-3">
                    <InputGroup.Text className="bg-dark-opacity">
                      {/* <box-icon
                        color="#E91E63"
                        type="solid"
                        name="key"
                      ></box-icon> */}
                      {/* <box-icon name='like' rotate='90'></box-icon> */}

                      <box-icon
                        name="like"
                        rotate="180"
                        flip="horizontal"
                      ></box-icon>
                    </InputGroup.Text>
                    <FormControl
                      placeholder={t("Confirm Password")}
                      name="confirm_password"
                      type="password"
                    />
                  </InputGroup>
                </FormGroup>

                <Button
                  type="submit" style={{ background: "#165287", color: "white" }}
                  onSubmit={handleSubmit}
                  className="w-100 mt-4"
                  variant="info"
                >
                  {t("Save")}
                </Button>
              </Form>
            </Card>
          </Col>
        </Row>

        <BackToMenu buttonClass="btn btn-primary w-100 card_3d casino-back-btn"></BackToMenu>
      </Container>
    </>
  );
}
