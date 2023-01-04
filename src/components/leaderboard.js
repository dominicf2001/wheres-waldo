import React from 'react';
import { v4 } from 'uuid';
import "../styles/leaderboard.css"

export default class Leaderboard extends React.Component {

  render() {
    return (
      <div id="leaderboard" className="container">
        <button onClick={this.props.onLeaderboardClick} type='button' className='close close-leaderboard' aria-label='Close'>
          <span aria-hidden="true">&times;</span>
        </button>
        <ul className="list-group">
          {
            this.props.sortedUserScores.map((userArr, index) => {
              return <li className="list-group-item" key={v4()}>{index + 1}. {userArr[0]} : {userArr[1]} seconds</li>
            })
          }
        </ul>
      </div>
    )
  }
}