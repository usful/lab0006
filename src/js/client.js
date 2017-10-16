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
    abiCandidatesRestURL="https://app.joinlane.com/api/v1/lane/6YZPN2GjYot9uaDeYJz07rToIp/lab0012"
    staticScoresURL="./js/static.json"
    sheetURL="https://docs.google.com/spreadsheets/d/1yF1w9b8Ae88V5MbfmPmD9plWNq_VBYoNcXY35afFvXU/edit#gid=0"
  />, 
  app);
