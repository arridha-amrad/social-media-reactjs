import React, {Component} from 'react'
import {Redirect} from 'react-router-dom';

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
    this.setState({ message: "" });
    this.setState({ [whateverType]: e.target.value });
  }

  signin = user => {
    return fetch("http://localhost:5000/signin", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
  }

  authenticate (jwt, next) {
    if(typeof window !== "undefined") {
      // save token into localstorage
      localStorage.setItem("jwt", JSON.stringify(jwt));
      next();
    }
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
    this.signin(user)
    .then(data => {
      if(data.error) {this.setState({error : data.error, loading:false})
      }
      else {
        // authenticate
        this.authenticate(data, () => {
          this.setState({redirectToReferer: true })
        })
    }
    })
  };

  render() {
  const {email, password, error, message, redirectToReferer, loading} = this.state;
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
          {message && (<div className="alert alert-success text-center">
            <strong>Congratulation! </strong> {message}
          </div>)}

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
