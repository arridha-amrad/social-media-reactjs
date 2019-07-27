import React from 'react';
import { singlePost, updatePost } from './apiPost';
import {isAuthenticated} from '../auth';
import Spinner from '../image/Spinner';
import {Redirect} from 'react-router-dom';
import DefaultProfile from '../image/avatar.png';

class EditPost extends React.Component {
  constructor() {
    super()
    this.state = {
      id: "",
      title: "",
      body: "",
      redirectToProfile: false,
      fileSize: 0,
      loading: false,
      error: ""
    }
  }
  componentDidMount() {
    this.postData = new FormData();
    const postId = this.props.match.params.postId;
    this.init(postId)
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

  init = (postId) => {
    singlePost(postId).then(data => {
      if (data.error) {
        this.setState({ redirectToProfile: true })
      } else {
        this.setState({
          id: data._id,
          title: data.title,
          body: data.body
        })
      }
    })
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
      const postId = this.state.id;
      const token = isAuthenticated().token;
      updatePost(postId, token, this.postData).then(data => {
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
    const { id, title, body, error, loading, redirectToProfile } = this.state;
    if(redirectToProfile) {
      return <Redirect to={`/user/${isAuthenticated().user._id}`}/>
    }
    return (
      <div className="row">
        <div className="col-md-4 offset-md-4 mt-5">
          <h2 className="text-center mt-5 mb-4">Edit Post</h2>
          {error && (
            <div className="alert alert-danger text-center">
              {error}
            </div>
          )}
          <img style={{
            height: "200px",
            width: "auto"
          }}
            className="img-thumbnail"
            src={`${process.env.REACT_APP_API_URL}/post/photo/${id}?${new Date().getTime()}`} 
            alt={title}
            onError={i => (i.target.src = `${DefaultProfile}`)}
          />
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

export default EditPost
