function loadBankToPage() {
  //
  const sheetId = "1THnbQE8Wqd7ATyg3rdbZB8xsWG8HMdBgT5u70PfDa_Q";
  const apiKey = "AIzaSyDdTUdVUMNo5ZuwGWcm0uxFE6ukg6YlcOE";
  const promise = fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Аркуш1?key=${apiKey}`
  );

  return promise;
  //
}
