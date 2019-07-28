import React, { Component } from 'react'
import { isAuthenticated, signout } from '../auth/index';
import { remove } from './apiUser';
import {Redirect} from 'react-router-dom';

class deleteUser extends Component {
  state = {
    redirect: false
  }
  deleteAccount = () => {
    // console.log("delete")
    const userId = this.props.userId;
    const token = isAuthenticated().token;
    remove(userId, token).then(data => {
      if(data.error) {
        console.log(data.error)
      } else {
        signout(() => console.log("User is deleted"));
        this.setState({ redirect: true });
      }
    })
  }

  deleteConfirm = () => {
    let answer = window.confirm('You will delete your account permanently. Continue?');
    if (answer) {
      this.deleteAccount();
    }
  }
  render() {
    if(this.state.redirect) {
      return <Redirect to="/" />
    }
    return (
      <button onClick={this.deleteConfirm} className="btn btn-raised btn-danger">Delete Profile</button>
    )
  }
}

export default deleteUser

