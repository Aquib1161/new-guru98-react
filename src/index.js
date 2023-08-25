import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import { Provider } from "react-redux";

import rules_en from "./translations/en/rules.json";
import rules_hindi from "./translations/hindi/rules.json";
import "./debugger";

import store from "./store";

const language = localStorage.getItem("selectedLanguage");
i18next.init({
  interpolation: { escapeValue: false },
  lng: language,
  resources: {
    en: {
      rules: rules_en,
    },
    hindi: {
      rules: rules_hindi,
    },
  },
});
// i18next.changeLanguage(language);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <I18nextProvider i18n={i18next}>
        <App />
      </I18nextProvider>
    </React.StrictMode>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
