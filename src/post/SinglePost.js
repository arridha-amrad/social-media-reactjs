import React, { Component } from 'react';
import { singlePost, remove } from './apiPost';
import DefaultProfile from '../image/avatar.png';
import { Link, Redirect } from 'react-router-dom'
import Moment from 'react-moment';
import BigSpinner from '../image/BigSpinner';
import { isAuthenticated } from '../auth';

class SinglePost extends Component {
  state = {
    post: '',
    loading: false,
    deleted: false,
    redirectToProfile: false

  }

  componentDidMount = () => {
    const postId = this.props.match.params.postId
    singlePost(postId).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ post:data });
      }
    })
  }

  deletePost = () => {
    const postId = this.props.match.params.postId;
    const token = isAuthenticated().token;
    remove(postId, token).then(data => {
      if(data.error){
        console.log(data.error)
      } else {
        this.setState({ 
          redirectToProfile: true
         });
      }
    });
  };

  deleteConfirm = () => {
    let answer = window.confirm('You will delete this post. Continue?');
    if (answer) {
      this.deletePost();
    }
  }

  renderPost = () => {
    const { post } = this.state;
    const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
    const posterName = post.postedBy ? post.postedBy.name : "unknow";
    const postedDate = new Date(post.created);

    return (
      <>
        <div className="card mt-5" style={{ boxShadow: "none", background: "transparent" }}>
          <h2 className="text-center">
            {this.state.post.title}
          </h2>
          <hr style={{ border: "2px solid #000" }} />
          <img
            src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
            onError={i => (i.target.src = `${DefaultProfile}`)}
            className="card-img-top mx-auto img-thumbnail mt-2"
            style={{ width: "100%", height: "450px", border: "none" }}
            alt={post.title} />
          <h5>{post.title}</h5>
          <p>{post.body}</p>
          <small> Posted by: <Link to={`${posterId}`}>{posterName}</Link></small>
          <small style={{ color: "#C0C0C0" }}>on &nbsp;
                  <Moment format="MMM YYYY">
              {postedDate}
            </Moment></small>
        </div>
        <div className="d-inline-block mt-2">
          <Link to="/" className="btn btn-secondary btn-raised">Back to Posts</Link>
          {isAuthenticated().user && isAuthenticated().user._id === post.postedBy._id && (
            <>
              <Link 
              to={`/post/edit/${this.state.post._id}`}
              className="btn btn-raised btn-success ml-4 mr-4"
              >Update Post
              </Link>
              <button
                onClick={this.deleteConfirm}
                className="btn btn-raised btn-warning"
              >Delete
                </button>
            </>
          )}

        </div>
      </>
    )
  }
  render() {
    if(this.state.redirectToProfile){
      return <Redirect to={`/user/${this.state.post.postedBy._id}`}/>
    }
    return (
      <div className="row">
        <div className="col-md-6 offset-md-3">
          {!this.state.post ? (
            <div className="text-center">
              <BigSpinner />
            </div>
          ) : (this.renderPost(this.state.post))
          }          
        </div>
      </div>
    )
  }
}

export default SinglePost

