export default function PopUp(props) {
    return (
      <div className={props.popUpOpen ? 'card popup' : 'popup hidden'}>
        <ul className="list-group">
          <li onClick={props.onCharSelectClick} data-name='waldo' className="char-select-item">
            <img className="char-icon" src="./images/waldo-icon.jpg" alt="waldo" />
            <div>
              <p className="char-name">Waldo</p>
            </div>
          </li>
        </ul>
        <img alt="target" className="target" src="../images/default-target.png" />
      </div>
    )
}