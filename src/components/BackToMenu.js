import { Link } from "react-router-dom";
export default function BackToMenu(props) {
  let link = "/";
  let text = "Back to Main Menu";
  let buttonClass = "btn w-100";
  if (props.link) link = props.link;
  if (props.text) text = props.text;
  if (props.buttonClass) buttonClass = props.buttonClass;
  return (
    <>
      <Link
        style={{
          backgroundColor: "#165287",
          color: "white",
          fontWeight: "bold",
        }}
        className={buttonClass}
        to={link}
      >
        {text}
      </Link>
    </>
  );
}
