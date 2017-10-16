import React from 'react';
import { Table } from 'react-bootstrap';

const MARKETING_ASSESSMENT = 'marketing assessment';
const BUSINESS_SIMULATION = 'business simulation';

function tdColorCoded(cc) {
  return (
    <td>
      <span className={`color-coded color-coded-${cc.toLowerCase()}`}>
        {cc.toUpperCase()}
      </span>
    </td>
  );
}

function commentList(alist, cc) {
  if (cc) {
    return (
      <ul>
        {alist[cc].assessors.map(a =>
          <li className={'color-coded color-coded-' + cc}>
            <span>
              {a.name}:&nbsp;
            </span>
            <span>
              {a.comment}
            </span>
          </li>
        )}
      </ul>
    );
  } else {
    return null;
  }
}

class MyTable extends React.Component {
  constructor(th) {
    super();

    this.th = th;

    this.state = {
      active: {
        row: null,
        color: ''
      }
    };
  }

  handleClick(row, color) {
    row =
      row === this.state.active.row && color === this.state.active.color
        ? null
        : row;

    const active = { row, color };

    this.setState({ active });
  }

  tbody() {
    const data = this.tableSort(this.props.data);

    return (
      <tbody>
        {data.map((a, i) =>
          this.row(
            a,
            i,
            a.name in this.props.staticScores
              ? this.props.staticScores[a.name]
              : a
          )
        )}
      </tbody>
    );
  }

  tdColorCount(assessor, i, color) {
    const count = assessor[color].count;
    const style = {
      cursor: 'pointer'
    };

    if (count > 0) {
      return (
        <td style={style} onClick={() => this.handleClick(i, color)}>
          {count}
        </td>
      );
    } else {
      return <td>0</td>;
    }
  }

  render() {
    return (
      <Table className={this.props.className} responsive>
        <thead>
          {this.th}
        </thead>
        {this.tbody()}
      </Table>
    );
  }
}

// Tab #1Total
export class TableTotalSummary extends MyTable {
  constructor() {
    super(
      <tr className="col-7">
        <th>NAME</th>
        <th>
          BUSINESS SIMULATION<br />FINAL SCORE
        </th>
        <th>
          MARKETING ASSESSMENT<br />FINAL SCORE
        </th>
        <th>MARKETING PROFILE</th>
        <th>
          CULTURAL FIT<br />ASSESSMENT SCORE
        </th>
        <th>
          LOGISTICAL<br />REASONING SCORE
        </th>
        <th>FINAL SCORE</th>
      </tr>
    );
  }

  tableSort(data) {
    const that = this;
    return _.sortBy(data, [
      function(c) {
        const i = _.indexOf(that.props.colorCodes, c.finalScore);
        return i >= 0 ? i : that.props.colorCodes.length - 1;
      },
      function(c) {
        return c.name.split(' ').pop();
      }
    ]);
  }

  row(a, i, sd) {
    // If static data has an entry for this candidate, use the static data; otherwise,
    // use the data returned by the REST call. This allows removing the static data
    // at some future date and the server side code can simply add the data to the
    // REST payload.
    
    return (
      <tr key={i}>
        <th>
          <span className="color-coded">
            {a.name}
          </span>
        </th>
        {tdColorCoded(a.businessSimulationFinalScore)}
        {tdColorCoded(a.knackPresentationFinalScore)}
        <td>
          {a.marketingProfile}
        </td>
        {tdColorCoded(sd.culturalFitAssessmentScore)}
        {tdColorCoded(sd.logisticalReasoningScore)}
        {tdColorCoded(a.finalScore)}
      </tr>
    );
  }
}

// Tab #2
export class TableBusinessSimulation extends MyTable {
  constructor() {
    super(
      <tr className="col-6">
        <th>NAME</th>
        <th>AVERAGE SCORE</th>
        <th>FINAL SCORE</th>
        <th>
          <span className="color-coded color-coded-green">GREEN</span>
        </th>
        <th>
          <span className="color-coded color-coded-yellow">YELLOW</span>
        </th>
        <th>
          <span className="color-coded color-coded-red">RED</span>
        </th>
      </tr>
    );
  }

  tableSort(data) {
    const that = this;
    return _.sortBy(data, [
      function(c) {
        const i = _.indexOf(
          that.props.colorCodes,
          c[BUSINESS_SIMULATION].averageScore
        );
        return i >= 0 ? i : that.props.colorCodes.length - 1;
      },
      function(c) {
        return c.name.split(' ').pop();
      }
    ]);
  }

  row(a, i) {
    const assessor = a[BUSINESS_SIMULATION].assessor;
    return [
      <tr key={i}>
        <th>
          <span className="color-function-coded">
            {a.name}
          </span>
        </th>
        {tdColorCoded(a[BUSINESS_SIMULATION].averageScore)}
        {tdColorCoded(a[BUSINESS_SIMULATION].finalScore)}
        {this.tdColorCount(assessor, i, 'green')}
        {this.tdColorCount(assessor, i, 'yellow')}
        {this.tdColorCount(assessor, i, 'red')}
      </tr>,
      <tr
        key={`${i}detail`}
        className={`detail ${this.state.active.row === i ? 'active' : ''}`}
      >
        <th />
        <td />
        <td />
        <td colSpan="3">
          {commentList(assessor, this.state.active.color)}
        </td>
      </tr>
    ];
  }
}

// Tab #3
export class TableMarketingAssessment extends MyTable {
  constructor() {
    super(
      <tr className="col-8">
        <th>NAME</th>
        <th>AVERAGE SCORE</th>
        <th>FINAL SCORE</th>
        <th>
          <span className="color-coded color-coded-green">GREEN</span>
        </th>
        <th>
          <span className="color-coded color-coded-yellow">YELLOW</span>
        </th>
        <th>
          <span className="color-coded color-coded-red">RED</span>
        </th>
        <th>MARKETING PROFILE YES</th>
        <th>MARKETING PROFILE NO</th>
      </tr>
    );
  }

  tableSort(data) {
    const that = this;
    return _.sortBy(data, [
      function(c) {
        const i = _.indexOf(
          that.props.colorCodes,
          c[MARKETING_ASSESSMENT].averageScore
        );
        return i >= 0 ? i : that.props.colorCodes.length - 1;
      },
      function(c) {
        return c.name.split(' ').pop();
      }
    ]);
  }

  row(a, i) {
    const assessor = a[MARKETING_ASSESSMENT].assessor;
    return [
      <tr key={`tr${i}`}>
        <th>
          <span className="color-code">
            {a.name}
          </span>
        </th>
        {tdColorCoded(a[MARKETING_ASSESSMENT].averageScore)}
        {tdColorCoded(a[MARKETING_ASSESSMENT].finalScore)}
        {this.tdColorCount(assessor, i, 'green')}
        {this.tdColorCount(assessor, i, 'yellow')}
        {this.tdColorCount(assessor, i, 'red')}
        <td>
          {a[MARKETING_ASSESSMENT].assessor.marketingProfileYes}
        </td>
        <td>
          {a[MARKETING_ASSESSMENT].assessor.marketingProfileNo}
        </td>
      </tr>,
      <tr
        key={`${i}detail`}
        className={`detail${this.state.active.row === i ? 'active' : ''}`}
      >
        <th />
        <td />
        <td />
        <td colSpan="5">
          {commentList(assessor, this.state.active.color)}
        </td>
      </tr>
    ];
  }
}

export default class CandidateTable extends React.Component {
  render() {
    return (
      <div className="leaderboard">
        <TableTotalSummary
          className={this.props.activeTable === 1 ? 'active' : ''}
          {...this.props}
        />
        <TableBusinessSimulation
          className={this.props.activeTable === 2 ? 'active' : ''}
          {...this.props}
        />
        <TableMarketingAssessment
          className={this.props.activeTable === 3 ? 'active' : ''}
          {...this.props}
        />
      </div>
    );
  }
}
