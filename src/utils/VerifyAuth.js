import React from "react";

class VerifyAuth extends React.Component {
  checkAuth = () => {
    const token = localStorage.getItem("access-token");
    if (!token) {
      window.location.href = "/login";
    }
  };

  render() {
    this.checkAuth();
    return this.props.children;
  }
}

export default VerifyAuth;
