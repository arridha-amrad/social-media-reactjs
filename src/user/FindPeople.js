import React, { Component } from 'react'
import { Button } from 'react-bootstrap';
import { findPeople, follow } from './apiUser';
import DefaultProfile from '../image/avatar.png';
import {Link} from 'react-router-dom';
import { isAuthenticated } from '../auth';

class Users extends Component {
  constructor() {
    super()
    this.state = {
      users: [],
      error: "",
      open: false
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

  clickFollow = (user, i) => {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;
    // jalankan fungsi follow di apiuser
    follow(userId, token, user._id).then(data => {
      if(data.error) {
        this.setState({ error: data.error})
      } else {
        let newToFollow = this.state.users;
        newToFollow.splice(i, 1);
        // slice return the removed item in an array
        this.setState({ 
          users : newToFollow,
          open: true,
          followMessage: `Following ${user.name}`
        });
      }
    });
  };

  renderUsers = (users) => (
    <div className="row">
      {users.map((user, i) => (
      <div className="col-md-4 mt-4" key={i}>
      <div className="card text-center" style={{ width: "18rem", background:"#fff", borderRadius:"20px" }}>
      <img style={{
              height: "240px",
              width: "auto"
            }}
              className="card-img-top mx-auto img-thumbnail"
              src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}?${new Date().getTime()}`} 
              alt={user.name} 
              onError = {i => (i.target.src = `${DefaultProfile}`)}
            />
        <div className="card-body">
          <h5 className="card-title">{user.name}</h5>
          <p className="card-text">{user.email}</p>
          <Link to={`/user/${user._id}`} className="btn btn-secondary btn-raised mr-2">View Profile</Link>
          <Button variant="primary"
          onClick={() => this.clickFollow(user, i)} 
          className="ml-2">Follow
          </Button>
        </div>
      </div>
    </div>
      ))}

    </div>

  )

  render() {
    const { users, open, followMessage } = this.state;
    return (
      <div className="container mt-5">
        <h2>People you might know...</h2>
        {open && (
          <div className="alert alert-primary">
            <p>{followMessage}</p>
          </div>
        )}
        {this.renderUsers(users)}
      </div>
    )
  }
}

export default Users
