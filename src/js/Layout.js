import React from "react";
import _ from "lodash";
import { Button, ButtonToolbar } from 'react-bootstrap';
import {Tabs, Tab} from 'react-bootstrap';
import {TableTotalSummary, TableBusinessSimulation, TableMarketingAssessment} from './Tables';

// URL for downloading the spreadsheet
const sheetURL = '';
const BUSINESS_SIMULATION = 'business simulation';
const MARKETING_ASSESSMENT = 'marketing assessment';

// color codes in ascending order
const colorCodes = ['green', 'yellow', 'red', 'grey'];

function loadJSON(url, success, error) {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function()
  {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        if (success)
          success(JSON.parse(xhr.responseText));
      } else {
        if (error)
          error(xhr);
      }
    }
  };
  // add timestamp to bypass browser cache
  url = url + (url.match(/\?/) ? '&' : '?') + 'timestamp=' + _.now();
  xhr.open("GET", url, true);
  xhr.send();
}

export default class Layout extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      staticScores: {},
      activeKey: 1, // selects active tab
    };
  }

  componentDidMount () {
    // static scores only load once and only if passed in through props
    const that = this;
    if ('staticScoresURL' in this.props) {
      loadJSON(this.props.staticScoresURL, function (staticScores) {
        that.setState({staticScores});
        console.log('Static data downloaded');
      }, function () {
        console.log('Static data download failed');
      });
    }

    this.load();
  }

  componentWillUnmount () {
    this.serverRequest.abort();
  }

  // Controllers
  load() {
    const that = this;
    loadJSON(this.props.abiCandidatesRestURL, function (data) {
      console.log('REST payload received');
      that.updateData(data);
    }, function () {
      console.log('REST call failed');
    });
  }

  download () {
    window.open(this.props.sheetURL);
  }

  // Model
  updateData (data) {
    // This is the json payload for reporting ABU candidate results.
    // Each element represents a single 'candidate'. Each candidate (c)
    // includes two arrays of assessments results (r), one containing admin
    // resutls and the other containing assessor results. This will combine the
    // two and add a 'type' property to distinguish the assessor type to
    // simplify processing. This also adds aggregate values (with safe defaults)
    // to support reporting.
    //
    // Note that this fully documents the applicaton model, including the
    // logic and relationship of aggregate values reported on the view.
    _.each(data, function (c, i) {
      // Use a boilerplate object to assign default values we are either
      // expecting from the json payload (data[i]) or will require for
      // report production in this app.
      data[i] = _.assign({
        // Expected from json payload...
        _id: '',
        description: '',
        name: '',
        picture: '',
        ratings: [],
        culturalFitAssessmentScore: 'grey',
        logisticalReasoningScore: 'grey',
        adminRatings: [], // will later be concatentated to ratings[] and deleted

        // The remainder are aggregates added by this app

        // Running aggregates (displayed in Tab #1)
        businessSimulationFinalScore: 'grey',
        knackPresentationFinalScore: 'grey',
        marketingProfile: 'no',
        finalScore: 'grey',

        // Aggregates broken down by assessment catagory and
        // relates to the Leaderboard Tab #
        'business simulation': { // Tab #2
          averageScore: 'grey',
          finalScore: 'grey',
          admin: {
            green: {
              count: 0,
              assessors: [],
            },
            yellow: {
              count: 0,
              assessors: [],
            },
            red: {
              count: 0,
              assessors: [],
            },
            grey: {
              count: 0,
              assessors: [],
            },
            marketingProfileYes: 0,
            marketingProfileNo: 0,
          },
          assessor: {
            green: {
              count: 0,
              assessors: [],
            },
            yellow: {
              count: 0,
              assessors: [],
            },
            red: {
              count: 0,
              assessors: [],
            },
            grey: {
              count: 0,
              assessors: [],
            },
            marketingProfileYes: 0,
            marketingProfileNo: 0,
          },
        },
        'marketing assessment': { // Tab #3
          averageScore: 'grey',
          finalScore: 'grey',
          admin: {
            green: {
              count: 0,
              assessors: [],
            },
            yellow: {
              count: 0,
              assessors: [],
            },
            red: {
              count: 0,
              assessors: [],
            },
            grey: {
              count: 0,
              assessors: [],
            },
            marketingProfileYes: 0,
            marketingProfileNo: 0,
          },
          assessor: {
            green: {
              count: 0,
              assessors: [],
            },
            yellow: {
              count: 0,
              assessors: [],
            },
            red: {
              count: 0,
              assessors: [],
            },
            grey: {
              count: 0,
              assessors: [],
            },
            marketingProfileYes: 0,
            marketingProfileNo: 0,
          }
        },
      }, data[i]);

      // Normalize
      // type ratings
      _.each(data[i].ratings, function (r, j) {
        data[i].ratings[j].type = 'assessor';
      })

      // type admin ratings and add merge with ratings
      _.each(data[i].adminRatings, function (r, j) {
        data[i].adminRatings[j].type = 'admin';
      })

      // delete after copy
      data[i].ratings.push(...data[i].adminRatings);
      delete(data[i].adminRatings);

      // aggregate summaries
      _.each(data[i].ratings, function (r, j) {
        //defaults
        r = _.extend({
          question1: '',
          question2: '',
          question3: '',
          question4: ['yes', 'no'][i % 2], // missing for now...
        }, r);

        // color code counts
        data[i][r.question1.toLowerCase()][r.type][r.question2.toLowerCase()]
          .count++;

        // assessor list contributing to this score
        data[i][r.question1.toLowerCase()][r.type][r.question2.toLowerCase()]
          .assessors.push({
            name: r.userName,
            comment: r.question3,
          });

        // marketing profile counts
        if (r.question4.toLowerCase() === 'yes')
          data[i][r.question1.toLowerCase()][r.type].marketingProfileYes++;
        else if (r.question4.toLowerCase() === 'no')
          data[i][r.question1.toLowerCase()][r.type].marketingProfileNo++;

        // average/final score based on highest count
        _.each(['business simulation',MARKETING_ASSESSMENT], function (s) {
          _.each([ {type: 'assessor', key: 'averageScore'}, {type: 'admin', key: 'finalScore'}, ], function (k) {
            let max = 0;
            // businessSimulationFinalScoredetermine high count
            let counts = _.map(colorCodes, function (cc) {
              const count = data[i][s][k.type][cc].count;
              if (count > max) {
                max = count;
                data[i][s][k.key] = cc;
              };
              return count;
            });
            // check for tied high count
            counts = counts.sort().reverse();
            if (counts[0] === counts[1]) {
              data[i][s][k.key] = 'grey';
            }
          });
        });
      });

      // Summary Data
      data[i].businessSimulationFinalScore = data[i]['business simulation'].finalScore;
      data[i].knackPresentationFinalScore = data[i][MARKETING_ASSESSMENT].finalScore;

      data[i].finalScore = (function (bs, ks) {
        return (bs === ks) ? bs : 'GREY';
      })(
        data[i].businessSimulationFinalScore,
        data[i].knackPresentationFinalScore
      );

      data[i].marketingProfile = (function (ap, kp) {
        return (ap > kp) ? 'YES' : 'NO';
      })(
        data[i][MARKETING_ASSESSMENT].assessor.marketingProfileYes,
        data[i][MARKETING_ASSESSMENT].assessor.marketingProfileNo
      )
    });

    // Default sort
    data = _.sortBy(data, [function (c) {
      const i = _.indexOf(colorCodes, c['business simulation'].averageScore);
      return (i >= 0) ? i : colorCodes.length - 1;
    }, function (c) {
      return c.name.split(' ').pop();
    }]);
    this.setState({data}); 
  }

  handleTabSelect(activeKey) {
    this.setState({activeKey});
  }

  toolbar (n) {
    return (
      <ButtonToolbar className={n} >
        <Button bsStyle="primary" onClick={this.load.bind(this)} >REFRESH</Button>
        <Button bsStyle="primary" onClick={this.download.bind(this)} >EXCEL SHEET</Button>
      </ButtonToolbar>
    );
  }

  render() {
    return (
      <div>
      <div className="master-container header">
        <div className="container">
          <div className={"row abi-header"}>
            <div className="col-sm-6 col-xs-7">
              <h1>ABI Day | 2016</h1>
              <img class="logo" title="ABI Day Logo" src="./images/abi-day-2016-logo.png" />
            </div>
            <div className="col-sm-6 col-xs-5">
              {this.toolbar('md-display')}
            </div>
          </div>
        </div>
      </div>
      <div className="master-container leaderboard">
        <div className="container">
          <div className={"row leaderboard"}>
            <Tabs activeKey={this.state.activeKey} onSelect={this.handleTabSelect.bind(this)} id="controlled-tab">
              <Tab eventKey={1} title="TOTAL SUMMARY">
                {this.toolbar('sm-display')}
                <TableTotalSummary id="table-1" data={this.state.data} staticScores={this.state.staticScores} />
              </Tab>
              <Tab eventKey={2} title="BUSINESS SIMULATION">
                {this.toolbar('sm-display')}
                <TableBusinessSimulation id="table-2" data={this.state.data} staticScores={this.state.staticScores}  />
              </Tab>
              <Tab eventKey={3} title="MARKETING ASSESSMENT">
                {this.toolbar('sm-display')}
                <TableMarketingAssessment id="table-3" data={this.state.data} staticScores={this.state.staticScores} />
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
      </div>
      );
  }
}
