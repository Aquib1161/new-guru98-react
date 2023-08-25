import { useState, useEffect } from "react";
import { httpGet } from "../utils/http";

export default function Logout() {
  const response = httpGet("logout");

  // localStorage.removeItem("user-data");
  // localStorage.removeItem("access-token");
  // localStorage.removeItem("is_notification_viewed");
  localStorage.clear();

  window.location.href = "/login";
  return;
}
