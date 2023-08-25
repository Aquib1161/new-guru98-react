import { useEffect, useState } from "react";

import ToastContainer from "react-bootstrap/ToastContainer";
import Toast from "react-bootstrap/Toast";

export default function Notification({ ...props }) {
  const [showA, setShowA] = useState(props.isVisible);

  useEffect(() => {
    setShowA(props.isVisible);
  }, [props.isVisible]);

  const toggleShowA = () => {
    setShowA(!showA);

    props.onClose(!showA);
  };

  return (
    <ToastContainer position="top-center" className="p-3 position-fixed mt-5">
      <Toast
        bg={props.type || "error"}
        show={showA}
        onClose={toggleShowA}
        autohide
        delay={1500}
      >
        {/* <Toast.Header>
          <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
          <strong className="me-auto">{props.title || ""}</strong>
          <small>11 mins ago</small>
        </Toast.Header> */}
        <Toast.Body>{props.message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}
