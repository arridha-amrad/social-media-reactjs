import React, { Component } from 'react';
import { singlePost, remove, like, unlike } from './apiPost';
import DefaultProfile from '../image/avatar.png';
import { Link, Redirect } from 'react-router-dom'
import Moment from 'react-moment';
import BigSpinner from '../image/BigSpinner';
import { isAuthenticated } from '../auth';
import Comment from './Comment';

class SinglePost extends Component {
  state = {
    post: '',
    loading: false,
    redirectToProfile: false,
    redirectToSignin: false,
    like: false,
    likes: 0,
    comments: []
  }

  checkLike = (likes) => {
    const userId = isAuthenticated() && isAuthenticated().user._id;
    let match = likes.indexOf(userId) !== -1;
    return match;
  };

  componentDidMount = () => {
    const postId = this.props.match.params.postId
    singlePost(postId).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({
          post: data,
          likes: data.likes.length,
          like: this.checkLike(data.likes),
          comments: data.comments
        });
      }
    })
  };

  updateComments = comments => {
    this.setState({comments})
  }

  likeToggle = () => {
    if(!isAuthenticated()) {
      this.setState({redirectToSignin: true});
      return false;
    }
    let callApi = this.state.like ? unlike : like
    const userId = isAuthenticated().user._id
    const token = isAuthenticated().token
    const postId = this.state.post._id

    callApi(userId, token, postId).then(data => {
      if (data.error) {
        console.log(data.error)
      } else {
        this.setState({
          like: !this.state.like,
          likes: data.likes.length,
        });
      }
    });
  };

  deletePost = () => {
    const postId = this.props.match.params.postId;
    const token = isAuthenticated().token;
    remove(postId, token).then(data => {
      if (data.error) {
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

  renderPost = post => {
    const { like, likes } = this.state;
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

          {like ? (
            <h4 style={{ cursor: "pointer" }} onClick={this.likeToggle}><i className="fas fa-heart" style={{color:"#ff3399"}}></i>&nbsp;{likes} Like</h4>
          ) : (
            <h4 style={{ cursor: "pointer" }} onClick={this.likeToggle}><i className="far fa-heart"></i>&nbsp;{likes} Like</h4>
          )}

          <h5>{post.title}</h5>
          <p>{post.body}</p>
          <small> Posted by: <Link to={`${posterId}`}>{posterName}</Link></small>
          <small style={{ color: "#C0C0C0" }}>on &nbsp;
                  <Moment format="MMM YYYY">
              {postedDate}
            </Moment></small>
        </div>
        <div className="d-inline-block mt-2 mb-5">
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
    const {post, comments, redirectToSignin} = this.state;
    if (this.state.redirectToProfile) {
      return <Redirect to={`/user/${post.postedBy._id}`}/>
    }
    if(redirectToSignin) {
      return <Redirect to={{
        pathname: '/signin',
        state: 'Please sign in'
      }}/>
    }
    return (
      <div className="row">
        <div className="col-md-6 offset-md-3">
          {!post ? (
            <div className="text-center">
              <BigSpinner />
            </div>
          ) : (this.renderPost(post))
          }
          <Comment 
          postId={post._id} 
          comments={comments.reverse()} 
          updateComments = {this.updateComments}
          />
        </div>
      </div>
    )
  }
}

export default SinglePost

