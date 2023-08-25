onmessage = function (e) {
  console.log("here");
  const notiData = JSON.parse(e.data.body);

  let userData = localStorage.getItem("user-data");
  userData.data.total_coins = notiData.total_coins;

  localStorage.setItem("user-item", userData);

  setTimeout(() => {
    window.location.reload();
  }, 200);
};
