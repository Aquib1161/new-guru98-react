import React from "react";
import { Table } from "react-bootstrap";
import { get } from "lodash";
import { httpPost } from "../utils/http";
import Loader from "../components/Loader";
import OldLedger from "./old-theme/OldLedger";
import OldPassbook from "./old-theme/OldPassbook";
import { withTranslation } from "react-i18next";




class Matkaplay extends React.Component {
  state = {
    matkaplay: [],
    is_fetching: false,
    selectedBetType: "Close Market",
    selectedEvenOdd: "Select Even / Odd",
    amount: "",
    betObj: []
  };

  state = {
    Matkaplay: [],
    is_fetching: false,
  };

  componentDidMount() {
    this.getMatkaplay();
  }

  getMatkaplay = async () => {
    this.setState({ is_fetching: true });
    try {
      const response = await httpPost("Matkaplay", {});

      this.setState({ passbook: response.data, is_fetching: false });
    } catch (err) {
      console.error(err);
      this.setState({ is_fetching: false });
    }
  };

  handleBetTypeChange = (event) => {
    this.setState({ selectedBetType: event.target.value });
  };

  handleEvenOddChange = (event) => {
    this.setState({ selectedEvenOdd: event.target.value });
  };

  handleAmountChange = (event) => {
    this.setState({ amount: event.target.value });
  };

  handleSubmit = () => {
    const { selectedBetType, selectedEvenOdd, amount } = this.state;
    console.log("Selected Bet Type:", selectedBetType);
    console.log("Selected Even/Odd:", selectedEvenOdd);
    console.log("Amount:", amount);
  };


  render() {
    const { matkaplay, is_fetching } = this.state;
    const { t } = this.props;

    return (
      <div className="px-2">
        {is_fetching && <Loader />}
        <div style={styles.container}>
          <div style={styles.customContainer}>
            <div class="row">
              <div class="col">
                <label for="" class="form-label"> Bet Type</label>
                <select class="form-select" aria-label="Default select example" onChange={this.handleBetTypeChange}>
                  <option selected>Close Market</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </select>
              </div>
              <div class="col">
                <label for="" class="form-label"> Even /Odd</label>
                <select class="form-select" aria-label="Default select example" onChange={this.handleEvenOddChange}>
                  <option selected>Select Even /Odd</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </select>
              </div>
              <div class="col">
                <div class="mb-3">
                  <label for="" class="form-label">Amount</label>
                  <input type="text" class="form-control" onChange={this.handleAmountChange} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center">
          <h2 style={{ color: "black", fontWeight: 600 }}>Total Points : <span style={{ color: "#555555", fontWeight: 600 }}>00</span></h2>
        </div>
        <div className="d-flex justify-content-center" style={{ paddingTop: 20 }}>
          <button type="submit" class="btn btn-secondary btn-lg" style={{ width: "600px", fontSize: "18px", fontWeight: 700, padding: 12 }} onClick={this.handleSubmit}>
            Submit Game
          </button>
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "30vh",
  },
  customContainer: {
    backgroundColor: "#923131",
    color: "white",
    padding: "32px",
    width: "300vh",
    borderRadius: "10px",
  },
};


export default withTranslation("rules")(Matkaplay);
