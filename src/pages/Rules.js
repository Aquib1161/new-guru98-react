import { useEffect, useState } from "react";
import { Button, Container, Modal } from "react-bootstrap";
import { useOutletContext } from "react-router-dom";
import { siteName } from "../utils/configs";
export default function Rules() {
  const [selectedLanguage, setLanguage] = useState("hindi");
  // const { t, i18n } = useTranslation("rules");
  const { t, changeLanguage } = useOutletContext();

  const [isNotification, toggleNotification] = useState(true);

  const hideNotification = () => {
    localStorage.setItem("is_notification_viewed", 1);
    toggleNotification(false);
  };

  const is_notification_viewed = Number(
    localStorage.getItem("is_notification_viewed") || "0" // by default it has to 0
  );

  useEffect(() => {
    isHindi();
  });

  const isHindi = () => {
    return selectedLanguage === "hindi";
  };

  const setOldTheme = () => {
    localStorage.setItem("is_old_theme", true);

    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 600);
  };

  const setNewTheme = () => {
    localStorage.setItem("is_old_theme", false);

    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 600);
  };

  return (
    <>
      {/* <div className="d-flex m-auto" style={{ width: "300px" }}>
        <Button
          style={{ backgroundColor: "#FF911F" }}
          className="w-100 tab-button"
          onClick={() => {
            changeLanguage("en");
            // setLanguage("en");
          }}
        >
          English
        </Button>
        <Button
          style={{ backgroundColor: "#84B332" }}
          className="w-100 tab-button"
          onClick={() => {
            changeLanguage("hindi");
            // setLanguage("hindi");
          }}
        >
          Hindi
        </Button>
      </div> */}

      <Modal
        show={isNotification && !is_notification_viewed}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        onHide={() => hideNotification()}
      >
        <Modal.Header
          className="text-center py-1 text-white"
          style={{ backgroundColor: "#52b5e1" }}
          closeButton
        >
          <Modal.Title>
            <center>Welcome To {siteName}</center>{" "}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "#fff" }}>
          <h6>
            <b>
              <center>
                {" "}
                अगर कोई सेशन रनिंग मै चल रहा है और टीम जीत जाती है या आलआउट हो
                जाती है तो सेशन डिक्लेअर होगा।
              </center>
            </b>
          </h6>
        </Modal.Body>
        <Modal.Footer
          className="py-1"
          style={{
            backgroundColor: "#52b5e1",
            color: "#fff",
            textAlign: "center",
          }}
        >
          <center>
            <b>Thanks For Visiting Our Site</b>
          </center>{" "}
        </Modal.Footer>
      </Modal>

      <Container className="mt-2">
        <ul className="rules-list text-bold">
          <li>
            1. किसी भी मैच में पेनल्टी के रन सैशन मैं जोड़े नही जायेंगे। जो सैशन उस टाइम पर चल रहा हो
          </li>
          <li>
            2.  लोगिन करने के बाद अपना पासवर्ड बदल लें। समय समय पर पासवर्ड बदलते रहे। पासवर्ड लीक होने की जवाबदारी कंपनी की नहीं होगी।
          </li>
          <li>
            3.  गेम रद्द या टाई होने पर मैच के सभी सौदे रद्द माने जायेंगे और जो सेशन पुरे हो चुके हे, उनके हिसाब से ही Coins कम या ज्यादा होंगे ।
          </li>
          <li>
            4. एक बार में मैच का सौदा कम से कम 500 (पांच सौ) एवं ज्यादा से ज्यादा 1,00,000 (एक लाख) और सेशन का सौदा कम से कम 500 (पांच सौ) एवं ज्यादा से ज्यादा 50,000 (पचास हज़ार ) तक का ही लिया जायेगा।
          </li>
          <li>
            5.  मैच के दौरान भाव को देख व समझ के ही सौदा करे। किये गए किसी भी सौदे को हटाया या बदला नहीं जाएगा। सभी सौदे के लिए स्वयं आप ही जिम्मेदार होंगे।
          </li>
          <li>
            6. मैच या सेशन भाव गलत चलने पर जो भी मैच या सेशन के सौदे हुए हे वह स्वतः हट जायेंगे। ऐसी स्थिति में किसी भी तरह का वाद-विवाद मान्य नहीं होगा।
          </li>
          <li>
            7.  रेट डिफरेंस सेट करने के लिए कोइन्स के पास वाली इमेज पे क्लिक करे और अपना रेट डिफरेंस सेट कर ले।
          </li>
          <li>
            8. चीटिंग या गलत भाव के सौदे हटा दिए जायेंगे मैच खत्म होने बाद भी।
          </li>
          <li>
            9. अगर आप इस एग्रीमेंट को ऐक्सेप्ट नहीं करते हे तो कोई सौदा नहीं कीजिये।
          </li>
          <li>
            10.  कंपनी का डिसीज़न ही फाइनल होगा, उस पर कोई क्लेम मान्य नहीं होगा।
          </li>
          <li>
          नोट : सर्वर या वेबसाईट में किसी तरह की खराबी आने या बंद हो जाने पर केवल किये गए सौदे ही मान्य होंगे। ऐसी स्थिति में किसी भी तरह का वाद-विवाद मान्य नहीं होगा। अंत में केवल कंपनी का निर्णय ही मान्य होगा।
          </li>
        </ul>
       
        {/* <b>{t("note")}</b> */}
      </Container>

      <Button className="d-flex justify-content-around align-items-center"
        style={{
          backgroundColor: "#2799fa",
          width: "89%",
          textAlign: "center",
          padding: "2px",
          margin: "20px",
        }}
        onClick={() => setOldTheme()}
      >
        <b>Countinue</b>
      </Button>
    </>
  );
}
