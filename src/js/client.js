import React from "react";
import ReactDOM from "react-dom";

import Layout from "./Layout";

const app = document.getElementById('app');
ReactDOM.render(<Layout className="container" 
    abiCandidatesRestURL="http://staging.joinlane.com/api/v1/lane/0B0znLGWrPnLPZE9vTmppR24zV0U/abi0002"
    staticScoresURL="./js/static.json"
    sheetURL="https://docs.google.com/spreadsheets/d/1B0lJR17MrjIyE1f-Zo5s4ZeRB4VH3O6wNJ8VS9J4xHg/edit#gid=0"
  />, 
  app);
