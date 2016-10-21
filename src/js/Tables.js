import React from "react";
import {Table} from 'react-bootstrap';
import _ from 'lodash';

const MARKETING_ASSESSMENT = 'marketing assessment';

function tdColorCoded (cc) {
  return (
    <td ><span class={'color-coded color-coded-' + cc.toLowerCase()} >{cc.toUpperCase()}</span></td>
  );
}

function commentList (alist, cc) {
  if (cc) {
    return (
      <ul>
      {
        _.map(alist[cc].assessors, function (a) {
          return(
            <li class={'color-coded color-coded-' + cc} ><span>{a.name}:&nbsp;</span><span>{a.comment}</span></li>
          );
        })
      }
      </ul>
    );
  }
}

export class MyTable extends React.Component {
  constructor (th) {
    super();
    this.th = th;
    this.state = {
      active: {
        row: null,
        color: '',
      }
    };
  }

  handleClick(row, color) {
    row = (row === this.state.active.row && color === this.state.active.color) ? null : row;
    const active = { row, color };
    this.setState({active});
  }

  tbody () {
    var that = this;
    return (
      <tbody>
      {
        _.map(that.props.data, function (a, i) {
          return that.row(a, i, (a.name in that.props.staticScores) ? that.props.staticScores[a.name] : a);
        })
      }
      </tbody>
    );
  }

  tdColorCount (assessor, i, color) {
    const count = assessor[color].count;
    if (count > 0) {
      return (
        <td onClick={this.handleClick.bind(this, i, color)}>{count}</td>
      );
    }
    else {
      return (
        <td>0</td>
      );
    }
  }

  render () {
    return (
      <Table responsive>
        <thead>
          {this.th}
        </thead>
        {this.tbody()}
      </Table>
    );
  }
}

// Tab #1
export class TableTotalSummary extends MyTable {
  constructor () {
    super(
      <tr class="col-7">
      <th>NAME</th>
      <th>BUSINESS SIMULATION<br />FINAL SCORE</th>
      <th>MARKETING ASSESSMENT<br />FINAL SCORE</th>
      <th>MARKETING PROFILE</th>
      <th>CULTURAL FIT<br />ASSESSMENT SCORE</th>
      <th>LOGISTICAL<br />REASONING SCORE</th>
      <th>FINAL SCORE</th>
      </tr>
    );
  }

  row (a, i, sd) {
    // If static data has an entry for this candidate, use the static data; otherwise,
    // use the data returned by the REST call. This allows removing the static data
    // at some future date and the server side code can simply add the data to the
    // REST payload.
    return (
      <tr>
      <th><span class="color-coded">{a.name}</span></th>
      {tdColorCoded(a.businessSimulationFinalScore)}
      {tdColorCoded(a.knackPresentationFinalScore)}
      <td>{a.marketingProfile}</td>
      {tdColorCoded(sd.culturalFitAssessmentScore)}
      {tdColorCoded(sd.logisticalReasoningScore)}
      {tdColorCoded(a.finalScore)}
      </tr>
    );
  }
}

// Tab #2
export class TableBusinessSimulation extends MyTable {
  constructor () {
    super(
      <tr class="col-6">
      <th>NAME</th>
      <th>AVERAGE SCORE</th>
      <th>FINAL SCORE</th>
      <th><span class="color-coded color-coded-green" >GREEN</span></th>
      <th><span class="color-coded color-coded-yellow" >YELLOW</span></th>
      <th><span class="color-coded color-coded-red" >RED</span></th>
      </tr>
    );
  }

  row (a, i) {
    const assessor = a['business simulation'].assessor;
    return (
      [
        <tr>
        <th><span class="color-function-coded">{a.name}</span></th>
        {tdColorCoded(a['business simulation'].averageScore)}
        {tdColorCoded(a['business simulation'].finalScore)}
        {this.tdColorCount(assessor, i, 'green')}
        {this.tdColorCount(assessor, i, 'yellow')}
        {this.tdColorCount(assessor, i, 'red')}
        </tr>
        ,
        <tr class={ ['detail', this.state.active.row === i ? 'active' : ''].join(' ') } >
        <th></th>
        <td></td>
        <td></td>
        <td colSpan="3">{commentList(assessor, this.state.active.color)}</td>
        </tr>
      ]
    );
  }
}

// Tab #3
export class TableMarketingAssessment extends MyTable {
  constructor () {
    super(
      <tr class="col-8">
      <th>NAME</th>
      <th>AVERAGE SCORE</th>
      <th>FINAL SCORE</th>
      <th><span class="color-coded color-coded-green" >GREEN</span></th>
      <th><span class="color-coded color-coded-yellow" >YELLOW</span></th>
      <th><span class="color-coded color-coded-red" >RED</span></th>
      <th>MARKETING PROFILE YES</th>
      <th>MARKETING PROFILE NO</th>
      </tr>
    );
  }

  row (a, i) {
    const assessor = a[MARKETING_ASSESSMENT].assessor;
    return (
      [
        <tr>
        <th><span class="color-code">{a.name}</span></th>
        {tdColorCoded(a[MARKETING_ASSESSMENT].averageScore)}
        {tdColorCoded(a[MARKETING_ASSESSMENT].finalScore)}
        {this.tdColorCount(assessor, i, 'green')}
        {this.tdColorCount(assessor, i, 'yellow')}
        {this.tdColorCount(assessor, i, 'red')}
        <td>{a[MARKETING_ASSESSMENT].assessor.marketingProfileYes}</td>
        <td>{a[MARKETING_ASSESSMENT].assessor.marketingProfileNo}</td>
        </tr>
        ,
        <tr class={ ['detail', this.state.active.row === i ? 'active' : ''].join(' ') } >
        <th></th>
        <td></td>
        <td></td>
        <td colSpan="5">{commentList(assessor, this.state.active.color)}</td>
        </tr>
      ]
    );
  }
}
