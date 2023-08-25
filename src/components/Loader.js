import Logo from "../assets/img/loader.gif";

const Loader = () => {
  return (
    <div className="position-fixed w-100 h-100 d-flex align-items-center justify-content-center loader">
      <img src={Logo} alt="Loader" className="flip-vertical-right" />
    </div>
  );
};

export default Loader;
