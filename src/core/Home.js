import React from 'react'
import {isAuthenticated} from '../auth/index';

const Home = () => {
  return (
    <div className="jumbotron">
      <h2>Home</h2>
      <p className="lead">Welcome to React &nbsp; 
      {isAuthenticated() && (<strong style={{ fontWeight: "bold" }}>{isAuthenticated().user.name}</strong>)}
      </p>
    </div>
  )
}

export default Home
