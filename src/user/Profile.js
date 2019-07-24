import React, { Component } from 'react';
import { isAuthenticated } from '../auth/index';
import { Redirect, Link } from 'react-router-dom';
import { read } from './apiUser';
import DefaultProfile from '../image/avatar.png';
import DeleteUser from './deleteUser';
import FollowProfileButton from './FollowProfileButton';
import ProfileTab from './ProfileTab';

class Profile extends Component {
  constructor() {
    super()
    this.state = {
      user: {following: [], followers: [] },
      redirectToSignin: false,
      following: false,
      error: ""
    };
  };

  // check follow
  checkFollow = user => {
    const jwt = isAuthenticated();
    const match = user.followers.find(follower => {
      return follower._id === jwt.user._id
    })
    return match
  };

  // when follow button click
  clickFollowButton = callApi => {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;
    const followId = this.state.user._id;
    callApi(userId, token, followId).then(data => {
      if (data.error) {
        this.setState({ error: data.error})
      } else {
        this.setState({ user: data, following: !this.state.following})
      }
    })
  }

  init = userId => {
    const token = isAuthenticated().token;
    read(userId, token).then(data => {
      if (data.error) {
        this.setState({ redirectToSignin: true })
      } else {
        let following = this.checkFollow(data)
        this.setState({ user: data, following })
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
    const photoUrl = user._id ? `${process.env.REACT_APP_API_URL}/user/photo/${user._id}?${new Date().getTime()}` : DefaultProfile ;

    return (
      <div className="container mt-5">
        <h2 className="mb-4 text-center">Profile
        <hr style={{ width: "50%", height: "10px" }}></hr>
        </h2>
        <div className="row">
          <div className="col-md-4 offset-md-2 text-center">
            <img style={{
              height: "240px",
              width: "auto",
              margin: "auto"
            }}
              className="card-img-top img-thumbnail mx-auto"
              src={photoUrl} 
              alt={user.name} 
              onError = {i => (i.target.src = `${DefaultProfile}`)}
            />
            <p className="text-lead mt-3 text-center">{user.about}</p>
          </div>
          <div className="col-md-4">
            <div className="lead">
              <p>Name&nbsp;  :  &nbsp;{user.name}</p>
              <p>Email&nbsp;&nbsp;  :  &nbsp;{user.email}</p>
              <p>Joined : &nbsp;{`${new Date(
                user.created
              ).toDateString()}`}
              </p>
            <ProfileTab key={user._id} following={user.following} followers={user.followers} />

            </div>
            {isAuthenticated().user._id === user._id ? (
              <div className="d-inline-block">
                <Link className="btn btn-raised btn-primary mr-5"
                  to={`/user/edit/${user._id}`}>Edit Profile</Link>
                <DeleteUser userId={user._id} />
              </div>
            ) : (
              <FollowProfileButton 
                following={this.state.following}
                onButtonClick={this.clickFollowButton}
              />
            )}
          </div>
        </div>

      </div>
    )
  }
}

export default Profile;
