import React, { Component } from 'react'
import { findPeople } from './apiUser';
import DefaultProfile from '../image/avatar.png';
import {Link} from 'react-router-dom';
import {isAuthenticated} from '../auth';

class FindPeople extends Component {
  constructor() {
    super()
    this.state = {
      users: []
    }
  }
  componentDidMount() {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;

    findPeople(userId, token).then(data => {
      if (data.error) {
        console.log(data.error)
      } else {
        this.setState({ users: data })
      }
    })
  }
  renderUsers = (users) => (
    <div className="row">
      {users.map((user, i) => (
      <div className="col-md-4 mt-4" key={i}>
      <div className="card text-center" style={{ width: "18rem" }}>
      <img style={{
              height: "240px",
              width: "auto"
            }}
              className="card-img-top img-thumbnail"
              src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}?${new Date().getTime()}`} 
              alt={user.name} 
              onError = {i => (i.target.src = `${DefaultProfile}`)}
            />
        <div className="card-body">
          <h5 className="card-title">{user.name}</h5>
          <p className="card-text">{user.email}</p>
          <Link to={`/user/${user._id}`} className="btn btn-secondary btn-raised">View Profile</Link>
        </div>
      </div>
    </div>
      ))}

    </div>

  )

  render() {
    const { users } = this.state;
    return (
      <div className="container mt-5">
        <h2>Users</h2>
        {this.renderUsers(users)}
      </div>
    )
  }
}

export default FindPeople
