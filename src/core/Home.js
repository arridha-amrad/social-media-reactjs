import React from 'react'
import { isAuthenticated } from '../auth/index';
import Posts from '../post/Posts';

const Home = () => {
  return (
    <div>
      <div className="jumbotron">
        <h2>Home</h2>
        <p className="lead">Welcome to React &nbsp;
      {isAuthenticated() && (<strong style={{ fontWeight: "bold" }}>{isAuthenticated().user.name}</strong>)}
        </p>
      </div>
      <div className="container">
        <Posts />
      </div>
    </div>
  )
}

export default Home
