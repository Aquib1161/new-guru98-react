import { Row } from "react-bootstrap";
import { domain } from "../utils/configs";
export default function Footer(props) {
  let buttonClass = "container-fluid mt-3";
  if (props.buttonClass) buttonClass = props.buttonClass;
  return (
    // <div
    //   className={buttonClass}
    //   style={{
    //     backgroundColor: "#333333",
    //     color: "white",

    //     marginTop: "5px",
    //   }}
    // >
    //   <Row style={{ marginTop: "6px" }}>
    //     <center>
    //       {" "}
    //       <p>Copy right ©{domain} 2023.</p>
    //     </center>
    //   </Row>
    // </div>
    <></>
  );
}
