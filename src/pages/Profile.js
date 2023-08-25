import { Row, Col, Button } from "react-bootstrap";
// import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import BackToMenu from "../components/BackToMenu";
import Footer from "./Footer";
export default function Profile() {
  const { t } = useOutletContext();
  const userDetails = JSON.parse(localStorage.getItem("user-data"));

  return (
    <>
      <BackToMenu></BackToMenu>
      <div className="container-fluid divide-y-1">
        <Row>
          {/* <Col sm={12} className="p-0 text-center mt-4">
            <h5 className=" profile-title">{t("Rate Information")}</h5>
          </Col> */}

          {/* <table style={{ fontWeight: "bold" }}>
            <thead>
              <td xs={6} sm={6}>
                <Col xs={6} sm={6}>
                  {t("Rate Difference :	")}
                </Col>
              </td>
              <td>
                <Col xs={3} sm={3} style={{ borderColor: "red" }}>
                  <select className="w-1020">
                    {[0, 1, 2, 3, 4, 5].map((rate) => {
                      return <option value={rate}>{rate}</option>;
                    })}
                  </select>
                </Col>
              </td>
              <td>
                <Col xs={3} sm={3}>
                  <Button size="sm" variant="success">
                    {t("Update")}
                  </Button>
                </Col>
              </td>
            </thead>
          </table> */}
           <Col sm={12} className="p-0 text-center mt-4 ">
            <h5 className=" profile-title">{t("User Profile")}</h5>
          </Col>
        </Row>{" "}
        <Row className="border-bottom p-2">
         
          <Col sm={5} xs={5} style={{ fontWeight: "bold"}}>
            {t("User Id")}
          </Col>
          <Col sm={1} xs={1}>
            :
          </Col>
          <Col sm={5} xs={5} style={{ fontWeight: "normal"}}>
            {userDetails.data.username}
          </Col>
        </Row>
        <Row className="border-bottom p-2">
          <Col sm={5} xs={5}  style={{ fontWeight: "bold" }} >
            {t(" Name")}
          </Col>
          <Col sm={1} xs={1}>
            :
          </Col>
          <Col sm={5} xs={5} style={{ fontWeight: "normal"}}>
            {userDetails.data.name}
          </Col>
        </Row>
        <Row className="border-bottom p-2">
          <Col sm={5} xs={5} style={{ fontWeight: "bold" }}  >
            {t("Mobile")}
          </Col>
          <Col sm={1} xs={1}>
            :
          </Col>
          <Col sm={5} xs={5} style={{ fontWeight: "normal" }}  >
            1234567891
          </Col>
        </Row>
        <Row className="border-bottom p-2">
          <Col sm={5} xs={5} style={{ fontWeight: "bold" }} >
            {t("Email")}  :
          </Col>
          <Col sm={1} xs={1}>
            :
          </Col>
          <Col sm={5} xs={5} style={{ fontWeight: "normal" }} >
            tt
          </Col>
        </Row>
        {/* <Row style={{ fontWeight: "bold" }}>
          <Col sm={6} xs={6}>
            {t("Date Of Joining")}:
          </Col>
          <Col sm={6} xs={6}>
            {userDetails.data.doj || "---"}
          </Col>
        </Row> */}
        <Row className="border-bottom p-2">
          <Col sm={5} xs={5}  style={{ fontWeight: "bold" }} >
            {t("Address")}
          </Col>
          <Col sm={1} xs={1}>
            :
          </Col>
          <Col sm={5} xs={5}  style={{ fontWeight: "normal" }} >
            India
          </Col>
        </Row>
        <Row className="border-bottom p-2">
          <Col sm={5} xs={5}  style={{ fontWeight: "bold" }} >
            {t("IP")}
          </Col>
          <Col sm={1} xs={1}>
            :
          </Col>
          <Col sm={5} xs={5}  style={{ fontWeight: "normal" }} >
            49.204.160..181
          </Col>
        </Row>
      </div>
      {/* <Row>
        <Col sm={12} className="p-0 text-center mt-4">
          <h5 className=" profile-title test-bold">{t("HELPLINE NUMBER")}</h5>
        </Col>
        <Row style={{ fontWeight: "bold" }}>
          <Col sm={6} xs={6}>
            {t("Helpline No")}:
          </Col>
          <Col sm={6} xs={6}>
            -
          </Col>
        </Row>
      </Row> */}
      <br></br>
      {/* <BackToMenu></BackToMenu> */}

      {/* <Footer buttonClass="casino-back-btn" /> */}
      <Footer />
    </>
  );
}
