import React from "react";
import ReactDOM from "react-dom";

import Layout from "./Layout";

/*
 * abiCandidatesRestURL  -  REST URL for fetching current candidate data.
 * 
 * staticScoresURL       -  (optional) "static" data that will basically extend properties
 *                          of the candidates data based on 'name'. If at some time the
 *                          static data is delivered in the candidate REST payload, simply
 *                          remove the prop for Layout.
 *
 * sheetURL              -  URL to the spreadsheet file.
 *
 */

const app = document.getElementById('app');
ReactDOM.render(<Layout className="container" 
    abiCandidatesRestURL="https://app.joinlane.com/api/v1/lane/0B0znLGWrPnLPZE9vTmppR24zV0U/abi0002"
    staticScoresURL="./js/static.json"
    sheetURL="https://docs.google.com/spreadsheets/d/1B0lJR17MrjIyE1f-Zo5s4ZeRB4VH3O6wNJ8VS9J4xHg/edit#gid=0"
  />, 
  app);
