import React from "react";
import { withTranslation } from "react-i18next";
import { get } from "lodash";

import Loader from "../../components/Loader";
import BackToMenu from "../../components/BackToMenu";

class OldPassbook extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      amountreceived: false,
      matchloss: false,
      matchprofit: false,
      amountpaid: false,
    };

  }

  handleamountreceived = () => {
    this.setState({ amountreceived: !this.state.amountreceived });
  };
  handlematchloss = () => {
    this.setState({ matchloss: !this.state.matchloss });
  };
  handlematchprofit = () => {
    this.setState({ matchprofit: !this.state.matchprofit });
  };
  handleamountpaid = () => {
    this.setState({ amountpaid: !this.state.amountpaid });
  };


  calculatedBalance = (balance, type, amount, index) => {
    if (index === 0) {
      return balance;
    }

    if (type === "C") {
      return Number(balance) - Number(amount);
    } else {
      return Number(balance) + Number(amount);
    }
  };

  render() {
    const { passbook, is_fetching, t } = this.props;
    const team_data = get(passbook, "team_data", []);
    let passbookBalance = passbook.total_balance;

    return (
      <>
        {is_fetching && <Loader />}
        <BackToMenu></BackToMenu>
        <main className="warp table-responsive statement-tables">
          <div className="stopScrollHorizontally">
            <section className="nabBarSection"><div className="menuWp">Passbook</div>
            </section>
            <div className="passbookTable">
              <table className="table table-hover table-bordered table-striped">
                <tbody>
                  <tr className="odd" onClick={() => this.handleamountreceived()}>
                    <td className="font-bold">Amount Received</td>
                    <td align="right" className="font-bold" style={{ color: 'green' }}>0 SHOW</td>
                  </tr>
                  {this.state.amountreceived === true ?
                    <tr>
                      <td className="" colSpan={2}>
                        <table className="table-condensed table-sm small">
                          <tbody>
                            <tr>
                              <td className="font-bold">Transaction ID</td>
                              <td className="font-bold">Particular</td>
                              <td className="font-bold">Date &amp; Time</td>
                              <td className="font-bold">Credit</td>
                              <td className="font-bold">Balance</td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                    : null}
                  <tr className="even collapsed" onClick={() => this.handlematchloss()}>
                    <td className="font-bold">Match Loss</td>
                    <td align="right" className="font-bold" style={{ color: 'red' }}>0 SHOW</td>
                  </tr>
                  {this.state.matchloss === true ?
                    <tr>
                      <td className="" colSpan={2}>
                        <div className="" style={{ height: '20px' }}>
                          <table className="table table-condensed table-sm small">
                            <tbody >
                              <tr>
                                <td className="font-bold">S.No.</td>
                                <td className="font-bold">Match Detail</td>
                                <td className="font-bold">Loss Amount</td>
                                <td className="font-bold">Balance</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                    : null}

                  <tr className="odd collapsed" onClick={() => this.handlematchprofit()}>
                    <td className="font-bold">Match Profit</td>
                    <td align="right" className="font-bold" style={{ color: 'green' }}>0 SHOW</td>
                  </tr>
                  {this.state.matchprofit === true ?
                    <tr>
                      <td className="" colSpan={2}>
                        <div className="" style={{ height: '20px' }}>
                          <table className="table table-condensed table-sm small">
                            <tbody >
                              <tr>
                                <td className="font-bold">S.No.</td>
                                <td className="font-bold">Match Detail</td>
                                <td className="font-bold">Profit Amount</td>
                                <td className="font-bold">Balance</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                    : null}
                  <tr className="even collapsed" onClick={() => this.handleamountpaid()}>
                    <td className="font-bold">Amount Paid</td>
                    <td align="right" className="font-bold" style={{ color: 'red' }}>-0 SHOW</td>
                  </tr>
                  {this.state.amountpaid === true ?
                    <tr>
                      <td className="" colSpan={2}>
                        <div className="" id="info_4" aria-expanded="false" style={{ height: '20px' }}>
                          <table className=" table-condensed table-sm small">
                            <tbody>
                              <tr>
                                <td className="font-bold">Transaction ID</td>
                                <td className="font-bold">Particular</td>
                                <td className="font-bold">Date &amp; Time</td>
                                <td className="font-bold">Dedit</td>
                                <td className="font-bold">Balance</td>
                              </tr>
                              <tr />

                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                    : null}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </>
    );
  }
}

export default withTranslation("rules")(OldPassbook);
