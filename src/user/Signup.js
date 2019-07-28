import React, {Component} from 'react';
import { signup } from '../auth/index';
import {Redirect} from 'react-router-dom';


class Signup extends Component {
  constructor() {
    super()
    this.state = {
      name: "",
      email: "",
      password: "",
      password2: "",
      error: "",
      message: "",
      redirectToSignIn: false
    }
  }

  handleChange = whateverType => e => {
    this.setState({ error: "" });
    this.setState({ message: "" });
    this.setState({ [whateverType]: e.target.value });
  }

    isValid = () => {
    const {password, password2} = this.state;
    if(password!==password2){
      this.setState({error: "Password not match"});
      return false;
    } else {
      return true;
    }
  }

  clickSubmit = e => {
    e.preventDefault();
    if(this.isValid()) {
    const {name, email, password} = this.state;
    const user = {
      name,
      email,
      password,
    }
    // console.log(user);
    signup(user)
    .then(data => {
      if(data.error) this.setState({error : data.error})
      else 
      this.setState({
        name: "",
        email: "",
        password: "",
        error: "",
        redirectToSignIn: true
      })
    })
  };
}

  render() {
  const {name, email, password, error, redirectToSignIn, password2} = this.state;

  if(redirectToSignIn) {
    return <Redirect to={{
      pathname:"/signin",
      state:"Signup complete. Please login"
    }} />
  }

  return (
    <div className="row mt-5">
      <div className="col-md-4 offset-md-4">
        <div className="container">
          <h2 className="mt-5 mb-5 text-center">Signup</h2>
          {error && (<div className="alert alert-warning text-center">
            <strong>Failed! </strong> {error}
          </div>)}
          <form>
            <div className="form-group">
              <label htmlFor="name" className="text-muted">Name</label>
              <input onChange={this.handleChange("name")} type="text" className="form-control" value={name} />
            </div>
            <div className="form-group">
              <label htmlFor="email" className="text-muted">Email</label>
              <input onChange={this.handleChange("email")} type="email" className="form-control" value={email} />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="text-muted">Password</label>
              <input onChange={this.handleChange("password")} type="password" className="form-control" value={password} />
            </div>
            <div className="form-group">
              <label htmlFor="password2" className="text-muted">Confirm Password</label>
              <input onChange={this.handleChange("password2")} type="password" className="form-control" value={password2} />
            </div>

            <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">Submit</button>
            <small className="text-lead float-right mt-2">Already have account?&nbsp;<a href="/signin" className="float-right">login</a></small>
          </form>
        </div>
      </div>
    </div>
    
  )
  }
}

export default Signup
