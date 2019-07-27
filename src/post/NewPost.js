import React, { Component } from 'react'
import { create } from './apiPost';
import { Redirect } from 'react-router-dom';
import { isAuthenticated } from '../auth';
import Spinner from '../image/Spinner';

class NewPost extends Component {
  constructor() {
    super()
    this.state = {
      title: "",
      body: "",
      error: "",
      photo: "",
      user: {},
      fileSize: 0,
      loading: false,
      redirectToProfile: false
    };
  }

  // Ketika laman direload berisi data si user
  componentDidMount() {
    this.postData = new FormData();
    this.setState({ user: isAuthenticated().user })
  }

  isValid = () => {
    const { title, body, fileSize } = this.state;
    if (fileSize > 1000000) {
      this.setState({ error: "Your file is too large" });
      return false;
    }
    if (!title || !body) {
      this.setState({ error: "You must fill in all the field" });
      return false;
    }
    return true;
  }

  handleChange = whateverType => event => {
    this.setState({ error: "" });
    const value = 
      whateverType === "photo" ? event.target.files[0] : event.target.value;
    const fileSize = whateverType === "photo" ? event.target.files[0].size : 0;
    this.postData.set(whateverType, value);
    this.setState({ [whateverType]: value, fileSize });
  }

  clickSubmit = event => {
    event.preventDefault();
    this.setState({ loading: true })
    if (this.isValid()) {
      const userId = isAuthenticated().user._id;
      const token = isAuthenticated().token;
      create(userId, token, this.postData).then(data => {
        if (data.error) {
          this.setState({ error: data.error })
        } else {
          this.setState({
            title: "",
            body: "",
            photo: "",
            loading: false,
            redirectToProfile: true
          })
        }
      })
    }
  }

  render() {
    const { title, body, error, loading, user, redirectToProfile } = this.state;

    if (redirectToProfile) {
      return <Redirect to={`/user/${user._id}`} />
    }

    return (
      <div className="row">
        <div className="col-md-4 offset-md-4 mt-5">
          <h2 className="text-center mt-5 mb-4">Create a new post</h2>
          {error && (
            <div className="alert alert-danger text-center">
              {error}
            </div>
          )}
          <div className="container">
            <form>

              <div className="form-group">
                <label className="bmd-label-floating">Photo Post</label>
                <input 
                  type="file" 
                  className="form-control"
                  onChange={this.handleChange("photo")}
                  accept="image/*"
                />
                <small className="text-muted">max. size 1Mb</small>
              </div>

              <div className="form-group">
                <label htmlFor="title" className="bmd-label-floating">Title</label>
                <input type="text" className="form-control" id="title"
                  onChange={this.handleChange("title")}
                  value={title}
                />
              </div>

              <div className="form-group">
                <label htmlFor="body" className="bmd-label-floating" >Body</label>
                <textarea className="form-control" id="body" rows="3" value={body} onChange={this.handleChange("body")}></textarea>
              </div>

                <button
                  onClick={this.clickSubmit}
                  className="btn btn-raised btn-primary">Send
                </button>
                {loading && (
                  <span className="ml-2 mb-3">
                    <Spinner />
                  </span>
                )}
            </form>
          </div>
        </div>

      </div>
    )
  }
}
export default NewPost;
