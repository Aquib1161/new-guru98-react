import Cricket from "../assets/img/icons/cricket.png";
import FootBall from "../assets/img/icons/soccer.png";
import TennisBall from "../assets/img/icons/tennis.png";
import AllGames from "../assets/img/icons/all.png";
export const betPrices = [1000, 10000, 25000, 50000];
export const darkTheme = "#E91E63";
export const lightTheme = "#46c35f";
export const siteName = "Cric11";
export const domain = "cric11.net";

export const SOCKET_URL = "https://bsf1010.pro/";
export const TEENPATTI_URL = "https://casino.1ex.in/getMarketcashino?id=t20";
export const DRAGON_TIGER_URL =
  "https://casino.1ex.in/getMarketcashino?id=dragon_tiger";
export const LUCKY7A_URL = "https://casino.1ex.in/getMarketcashino?id=lucky7_a";
export const AAA_URL = "https://casino.1ex.in/getMarketcashino?id=aaa";

export const scoreMsgImg = (run) => {
  let imgUrl = "https://admin.sixpro.in/dist/img/score_msgs/";
  imgUrl += `${run.toUpperCase()}.jpeg`;

  return imgUrl;
};

export const isDotIn = () => {
  return true; //window.location.hostname === "sixpro.in";
};

export const GAMESTYPES = [
  {
    id: 0,
    name: "All",
    icon: AllGames,
  },
  {
    id: 4,
    name: "Cricket",
    icon: Cricket,
  },
  {
    id: 1,
    name: "Football",
    icon: FootBall,
  },
  {
    id: 2,
    name: "Tennis",
    icon: TennisBall,
  },
];
