import React, { Component } from 'react';
import { isAuthenticated } from '../auth/index';
import { Redirect, Link } from 'react-router-dom';
import { read } from './apiUser';
import defaultProfile from '../image/avatar.png';
import DeleteUser from './deleteUser';

class Profile extends Component {
  constructor() {
    super()
    this.state = {
      user: "",
      redirectToSignin: false
    }
  }

  init = userId => {
    const token = isAuthenticated().token;
    read(userId, token).then(data => {
      if (data.error) {
        this.setState({ redirectToSignin: true })
      } else {
        this.setState({ user: data })
      }
    })
  }

  componentDidMount() {
    const userId = this.props.match.params.userId;
    this.init(userId);
  }

  componentWillReceiveProps(props) {
    const userId = props.match.params.userId;
    this.init(userId);
  }

  render() {
    const { redirectToSignin, user } = this.state;
    if (redirectToSignin) return <Redirect to="/signin" />
    return (
      <div className="container mt-5">
        <h2 className="mb-4 text-center">Profile
        <hr style={{width: "50%", height:"10px"}}></hr>
        </h2>
        <div className="row">
          <div className="col-md-4 offset-md-2">
            <img className="card-img-top rounded-circle"
              src={defaultProfile}
              alt={user.name}
              style={{ height: "240px", width: "240px" }}
            />
          </div>
          <div className="col-md-4">
            <div className="lead mt-4">
              <p>Name&nbsp;  :  &nbsp;{user.name}</p>
              <p>Email&nbsp;&nbsp;  :  &nbsp;{user.email}</p>
              <p>Joined : &nbsp;{`${new Date(
                user.created
              ).toDateString()}`}
              </p>
            </div>
            {isAuthenticated().user._id === user._id && (
              <div className="d-inline-block">
                <Link className="btn btn-raised btn-primary mr-5"
                  to={`/user/edit/${user._id}`}>Edit Profile</Link>
                <DeleteUser userId={user._id}/>
              </div>
            )}
          </div>
        </div>

      </div>
    )
  }
}

export default Profile;
