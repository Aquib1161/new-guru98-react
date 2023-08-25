/* 
* @author Name <Birendar Kanwasi>
* Created :29-Jan-2023
* Description: The component function return Hindi Html text 
*/
import "./matchrule.css";

const InPayMatchRule = (props) => {
  //console.log(props);
  return (
    <div className="matchRules">
      {props.ruleTypes == "BOOKMAKER" && props.matchType == "Cricket" && (
        <div className="matchRules">
          {/* <h2> BOOKMAKER </h2> */}
          <h4> CRICKET </h4>
          <p>
            1. कंपनी के पास किसी भी आईडी और सौदे को हटाने और डिलीट करने का
            अधिकार सुरक्षित है, यदि वह अवैध पाया जाता है। उदाहरण के लिए VPN/
            ROBOT- से एक ही IP से एक से अधिक सौदे एक ही समय में किए गए हैं ।
            नोट: और केवल जीतने वाली बेट ही रद्द कर दी जाएगी{" "}
          </p>
          <p>
            2. किसी भी तकनीकी खराबी के कारन ऑड्स रुक जाते है तो रुके हुए भाव पर
            किए गए सौदे हटा दिए जायेगे ,{" "}
          </p>
        </div>
      )}

      {props.ruleTypes == "BOOKMAKER" && props.matchType == "Cricket" && (
        <div className="matchRules">
          <h4>FOOTBALL </h4>
          <p>
            1. कंपनी के पास किसी भी आईडी और सौदे को हटाने और डिलीट करने का
            अधिकार सुरक्षित है, यदि वह अवैध पाया जाता है। उदाहरण के लिए VPN/
            ROBOT- से एक ही IP से एक से अधिक सौदे एक ही समय में किए गए हैं ।
            नोट: और केवल जीतने वाली बेट ही रद्द कर दी जाएगी,{" "}
          </p>
          <p>
            2 .मैच मै फुल टाइम और STOPPAGE टाइम पर जो सौदे किए गए है वो मान्य
            किए जायेगे ,पेनलिटी शूट आउट मै किए गए गोल को नहीं गिना जायेगा,{" "}
          </p>
          <p>
            3 .यदि किक ऑफ के बाद किसी कारन से मैच रुक जाता है और 48 घंटे तक चालू
            नहीं होता है तो किए गए सही एडवांस सौदे रद्द कर दिए जायेगे,{" "}
          </p>
          <p>
            4 .यदि बिना किक ऑफ के कोई टीम वॉकओवर मै जीत जाती है तो दोनों टीम पैर
            किए गए सौदे रद्द हो जायेगे ,
          </p>
          <p>
            5 मैच के टोटल 90 मिनट तक खेले जाने के बाद भी अगर किसी भी टीम का कोई
            स्कोर नहीं होता है, यानि दोनों टीम का स्कोर 0 - 0 होता है तो मैच टाई
            माना जायेगा और सभी सौदे रद्द कर दिए जायेगे ,
          </p>
        </div>
      )}

      {props.ruleTypes == "BOOKMAKER" && props.matchType == "Cricket" && (
        <div className="matchRules">
          <h4>TENNIS </h4>
          <p>
            1. कंपनी के पास किसी भी आईडी और सौदे को हटाने और डिलीट करने का
            अधिकार सुरक्षित है, यदि वह अवैध पाया जाता है। उदाहरण के लिए VPN/
            ROBOT- से एक ही IP से एक से अधिक सौदे एक ही समय में किए गए हैं ।
            नोट: और केवल जीतने वाली बेट ही रद्द कर दी जाएगी,{" "}
          </p>
          <p>
            2 .निर्धारित समय पर अगर किसी भी प्लेयर का एक भी सेट कम्पलीट नहीं
            होता है तो दोनों प्लेयर पैर किए गए सौदे रद्द मने जायेगे{" "}
          </p>


          <h4>CASINO </h4>
          <p>
          1. कसीनो के किसी भी गेम मे अगर किसी तकनीक खराबी के कारन अगर आप के किसी सौदे का रिजल्ट नहीं होता है तो वो सौदा अपने आप रात को 11:30 PM अपने आप रद्द हो जायेगा और आप के कॉइन वापिस हो जायेगे,{" "}
          </p>
          
        </div>


        
      )}

      {props.ruleTypes == "FANCY & SESSION" && props.matchType == "Cricket" && (
        <div className="matchRules">
          {/* <h2> FANCY & SESSION </h2> */}
          <h4> CRICKET </h4>
          <p> 1.मैच के टाई होने पर सभी सौदे मान्य किए जायेगे,</p>
          <p> 2. सभी एडवांस फैंसी टॉस के कुछ देर पहले ससपेंड कर दी जाएगी , </p>
          <p>
            {" "}
            3. यदि किसी तकनीकी खराबी के कारन कोई सेशन या फैंसी ID से हट जाती है और दुबारा ID पर नहीं आती है तो उस सेशन पर किए गए सभी सौदे मान्य किए जायेगे,{" "}
          </p>
          <p>
            4. यदि किसी सेशन या फैंसी के रेट गलत चल जाते है तो गलत रेट पर किए गए
            सौदे हटा दिए जायेगे,
          </p>
          <p>
          5. स्कोर बोर्ड और टीवी थर्ड पार्टी सोर्स है अगर स्कोर स्लो और गलत चलता है तो इस मे कम्पनी की कोई ज़िम्मेदारी नहीं है कृपया  सौदा अपने हिसाब से करे,
          </p>
          <p className="redP">
            6. यदि कोई क्लाइंट ग्राउंड कमेंर्टी से एक ही IP से BOOT से VPN से एक
            है टाइम मे एक से सौदे करता है तो करता है तो केवल जीत वाले सौदे हटा
            दिए जाएंगे , उदहारण:-(
            <span className="redSpan">
              6 ओवर सेशन मै 44 YES और 48 NOT करता है और रन 43 बनते है तो 48 वाले
              सभी सौदे हटा दिए जा सकते है,
            </span>
            )
          </p>
          <p>
            7. पेनल्टी के रन बर्तमान मे चल रहे किसी भी सेशन पर मान्य नहीं किए
            जाते है,
          </p>
          <p>
            8. यदि बर्तमान मे सेशन चल रहे हो और टीम (DLS) या किसी भी कारन से जीत
            जाती है तो ओवर वाले सेशन जो कम्पलीट नहीं हुए है वो रद्द कर दिया
            जायेगा और एक्स्ट्रा सेशन (
            <span className="redSpan">
              विकेट पार्टनरशिप ,प्लेयर के रन,एक्सटरा फैंसी) सभी पास किआ जायेगा,
            </span>
          </p>
          <p>
            9.प्लेयर के 35 रन पर रिटायर्ड हर्ट या इंजर्ड होने पर प्लेयर के रन
            डिक्लेअर 35 ही किये जायेंगे ,
          </p>
          <p>
            {" "}
            10. एडवांस सेशन और फैंसी केवल 1ST इनिंग के लिए ही VALID होती है,{" "}
          </p>
        </div>
      )}
    </div>
  );
};

export default InPayMatchRule;
