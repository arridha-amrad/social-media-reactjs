import React, {Component} from 'react'
import {Redirect} from 'react-router-dom';
import { signin, authenticate } from '../auth/index';

class Signin extends Component {
  constructor() {
    super()
    this.state = {
      email: "",
      password: "",
      error: "",
      loading: false,
      message: "",
      redirectToReferer: false,
    }
  }

  handleChange = whateverType => e => {
    this.setState({ error: "" });
    this.props.location.state =  "";
    this.setState({ message: "" });
    this.setState({ [whateverType]: e.target.value });
  }

  clickSubmit = e => {
    e.preventDefault();
    this.setState({ loading: true })
    const {email, password} = this.state;
    const user = {
      email,
      password,
    }
    // console.log(user);
    signin(user)
    .then(data => {
      if(data.error) {this.setState({error : data.error, loading:false})
      }
      else {
        // authenticate
        authenticate(data, () => {
          this.setState({redirectToReferer: true })
        })
    }
    })
  };

  render() {
  // const redirectMessage = this.props.redirectMessage;
  const {email, password, error, redirectToReferer, loading} = this.state;
  if(redirectToReferer) return <Redirect to="/" />
  return (
    <div className="row mt-5">
      <div className="col-md-4 offset-md-4">
        <div className="container">
          <h2 className="mt-5 mb-5 text-center">Signin</h2>

          {loading ? (
            <div className="jumbotron text-center">
              <h2>loading...</h2>
            </div>) : ("")}

          {error && (<div className="alert alert-warning text-center">
            <strong>Failed! </strong> {error}
          </div>)}

          {this.props.location.state && (
            <div className="alert alert-secondary text-center">
            {this.props.location.state}
          </div>
          )}

          <form>
            <div className="form-group">
              <label htmlFor="email" className="text-muted">Email</label>
              <input onChange={this.handleChange("email")} type="email" className="form-control" value={email} />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="text-muted">Password</label>
              <input onChange={this.handleChange("password")} type="password" className="form-control" value={password} />
            </div>
            <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">Submit</button>
            <small className="text-lead float-right mt-2">Don't have an account?&nbsp;<a href="/signup" className="float-right">signup</a></small>
          </form>
        </div>
      </div>
    </div>
    
  )
  }
}

export default Signin;
