import React, { Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import {isAuthenticated, signout} from '../auth/index';

// history dan withRouter untuk membuat active link
// active link membandingkan path di Link dengan path dari props.history
const isActive = (history, path) => {
  if (history.location.pathname === path) return { background: "rgb(0, 100, 0)" }
}

const Menu = ({ history }) => (
  <div>
    <ul className="nav nav-tabs bg-primary">
      <li className="nav-item ml-5">
        <Link className="nav-link" style={isActive(history, "/")} to="/">Home</Link>
      </li>

      {isAuthenticated() ? (
        <Fragment>
          <li className="nav-item">
            <Link className="nav-link" 
                  style={isActive(history, `/user/${isAuthenticated().user._id}`)} 
                  to={`/user/${isAuthenticated().user._id}`}>
                  {isAuthenticated().user.name}
            </Link>  
          </li>
          <li className="nav-item ml-auto">
            <Link className="nav-link"
              style={(isActive(history, "/users"))}
              to="/users">Users</Link>
          </li>
          <li className="nav-item mr-5">
            <span className="nav-link"
              style={(isActive(history, "/signout"), { cursor: "pointer", color: "#fff" })}
              onClick={() => signout(() => history.push("/signin"))} >Logout</span>
          </li>

        </Fragment>
      ) : ( 
          <Fragment>
            <li className="nav-item">
              <Link className="nav-link" style={isActive(history, "/signin")} to="/signin">Sign In</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" style={isActive(history, "/signup")} to="/signup">Sign Up</Link>
            </li>
          </Fragment>
        )}

    </ul>

  </div>
)

export default withRouter(Menu);

