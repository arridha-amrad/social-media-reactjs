import React, { Component } from 'react';
import { read, update, updateUser } from './apiUser';
import { isAuthenticated } from '../auth';
import { Redirect } from 'react-router-dom';
import DefaultProfile from '../image/avatar.png';

class EditProfile extends Component {
  constructor() {
    super()
    this.state = {
      id: "",
      name: "",
      email: "",
      password: "",
      password2: "",
      redirectToProfile: false,
      loading: false,
      fileSize: 0,
      about: ""
    }
  }

  init = userId => {
    const token = isAuthenticated().token;
    read(userId, token).then(data => {
      if (data.error) {
        this.setState({ redirectToProfile: true })
      } else {
        this.setState({
          id: data._id,
          name: data.name,
          email: data.email,
          error: "",
          about: data.about
        })
      }
    })
  }

  componentDidMount() {
    this.userData = new FormData();
    const userId = this.props.match.params.userId;
    this.init(userId);
  }

  handleChange = whateverType => event => {
    this.setState({ error: "" });
    const value = whateverType === "photo" ? event.target.files[0] : event.target.value;
    // harus pakai index zero [0]
    const fileSize = whateverType === "photo" ? event.target.files[0].size : 0;
    this.userData.set(whateverType, value);
    this.setState({ [whateverType]: value, fileSize });
  }

  isValid = () => {
    const { name, email, password, password2, fileSize } = this.state;
    if (fileSize > 1000000) {
      this.setState({ error: "Your file is too large" });
      return false;
    }
    if (!name) {
      this.setState({ error: "Please enter the name field" });
      return false;
    }

    if (!/^([a-zA-Z0-9_]+)@((\[[0-9]{1,3}[0-9]{1,3}[0-9]{1,3})|(([a-zA-Z0-9]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/.test(email)) {
      this.setState({ error: "Please enter your valid email" });
      return false;
    }
    // if (!/^(?=.*[0-9])(?=.*[#!@$%^&*])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9#!@$%^&*]{8,})$/.test(password)) {
    //   this.setState({ error: "Your password must contain at least 8 characters with digit, lowercase, uppercase and special characters" });
    //   return false;
    // }
    // if(password !== password2) {
    //   this.setState({ error: "Password not match "});
    //   return false;
    // }
    if (password.length >= 1 && password.length <= 5) {
      this.setState({ error: "Please enter password" })
      return false;
    }
    return true
  }

  clickSubmit = event => {
    event.preventDefault();
    if (this.isValid()) {
      this.setState({ loading: true })
      const userId = this.props.match.params.userId;
      const token = isAuthenticated().token;
      update(userId, token, this.userData).then(data => {
        if (data.error) {
          this.setState({ error: data.error })
        } else {
          updateUser(data, () => {
            this.setState({ redirectToProfile: true });
          })
        }
      })
    }
  }

  render() {
    const { name, email, password, password2, id, redirectToProfile, error, loading, about } = this.state;
    if (redirectToProfile) {
      return <Redirect to={`/user/${id}`} />
    }

    const photoUrl = id ? `${process.env.REACT_APP_API_URL}/user/photo/${id}?${new Date().getTime()}` : DefaultProfile;
    return (
      <div className="row">
        <div className="col-md-4 offset-md-4 mt-5">
          <h2 className="text-center mt-5 mb-5">Edit Profile</h2>
          {error && (
            <div className="alert alert-danger text-center" role="alert">
              {error}
            </div>
          )}

          {loading && (
            <div className="jumbotron text-center">
              <h2>loading...</h2>
            </div>)}
          <img style={{
            height: "200px",
            width: "auto"
          }}
            className="img-thumbnail"
            src={photoUrl} alt={name}
            onError={i => (i.target.src = `${DefaultProfile}`)}
          />

          <div className="container">
            <form>
              <div className="form-group">
                <label htmlFor="photo" className="bmd-label-floating">Profile photo</label>
                <input type="file" className="form-control" id="photo"
                  onChange={this.handleChange("photo")}
                  accept="image/*"
                />
                <small className="text-muted">max. size 1Mb</small>
              </div>
              <div className="form-group">
                <label htmlFor="name" className="bmd-label-floating">Name</label>
                <input type="text" className="form-control" id="name"
                  onChange={this.handleChange("name")}
                  value={name}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email" className="bmd-label-floating">Email</label>
                <input type="email" className="form-control" id="email"
                  onChange={this.handleChange("email")}
                  value={email}
                />
              </div>

              <div className="form-group">
                <label htmlFor="about" className="bmd-label-floating" >About me</label>
                <textarea className="form-control" id="about" rows="3" value={about} onChange={this.handleChange("about")}></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="password" className="bmd-label-floating">Password</label>
                <input type="password" className="form-control" id="password"
                  onChange={this.handleChange("password")}
                  value={password}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password2" className="bmd-label-floating">Confirm Password</label>
                <input type="password" className="form-control" id="password2"
                  onChange={this.handleChange("password2")}
                  value={password2}
                />
              </div>
              <button
                onClick={this.clickSubmit}
                className="btn btn-raised btn-primary">Update
              </button>
            </form>
          </div>
        </div>
      </div>

    )
  }
}

export default EditProfile;