import React, {Component} from 'react';
import { signup } from '../auth/index';


class Signup extends Component {
  constructor() {
    super()
    this.state = {
      name: "",
      email: "",
      password: "",
      error: "",
      message: "",
    }
  }

  handleChange = whateverType => e => {
    this.setState({ error: "" });
    this.setState({ message: "" });
    this.setState({ [whateverType]: e.target.value });
  }

  clickSubmit = e => {
    e.preventDefault();
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
        message: data.message
      })
    })
  };

  render() {
  const {name, email, password, error, message} = this.state;
  return (
    <div className="row mt-5">
      <div className="col-md-4 offset-md-4">
        <div className="container">
          <h2 className="mt-5 mb-5 text-center">Signup</h2>
          {error && (<div className="alert alert-warning text-center">
            <strong>Failed! </strong> {error}
          </div>)}
          {message && (<div className="alert alert-success text-center">
            <strong>Congratulation! </strong> {message}
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
            <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">Submit</button>
            {message ? (
            <small className="text-lead float-right mt-2"><a href="/signin" className="float-right">login</a></small>
            ) : (
            <small className="text-lead float-right mt-2">Already have account?&nbsp;<a href="/signin" className="float-right">login</a></small>
            )}
          </form>
        </div>
      </div>
    </div>
    
  )
  }
}

export default Signup
