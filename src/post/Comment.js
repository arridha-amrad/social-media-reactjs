import React, { Component } from 'react';
import { comment, uncomment } from './apiPost';
import { isAuthenticated } from '../auth';
import { Link, Redirect } from 'react-router-dom';
import DefaultProfile from '../image/avatar.png';
import Moment from 'react-moment';

class Comment extends Component {
  state = {
    text: "",
    error: "",
    redirectToSignIn: false
  }
  handleChange = event => {
    this.setState({ error: "" })
    this.setState({ text: event.target.value })
  }

  isValid = () => {
    const { text } = this.state;
    if (!text) {
      this.setState({
        error: "No comment added"
      });
      return false
    }
    if (text.length > 150) {
      this.setState({
        error: "Your comment is too long"
      });
      return false
    }
    return true
  };

  addComment = e => {
    e.preventDefault();
    if (!isAuthenticated()) {
      this.setState({ redirectToSignIn: true });
      return false;
    }
    if (this.isValid()) {
      const userId = isAuthenticated().user._id;
      const token = isAuthenticated().token;
      const postId = this.props.postId;

      comment(userId, token, postId, { text: this.state.text }).then(data => {
        if (data.error) {
          console.log(data.error)
        } else {
          this.setState({ text: "" })
          // dispatch fresh list of component
          this.props.updateComments(data.comments);
        }
      })
    };
  };

  deleteComment = comment => {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;
    const postId = this.props.postId;

    uncomment(userId, token, postId, comment).then(data => {
      if (data.error) {
        console.log(data.error)
      } else {
        this.props.updateComments(data.comments);
      }
    })
  }

  deleteConfirm = comment => {
    let answer = window.confirm(
      "Delete this comment?"
    );
    if(answer) {
      this.deleteComment(comment);
    }
  }
  render() {
    const { comments } = this.props;
    if (this.state.redirectToSignIn) {
      return <Redirect to={{
        pathname: "/signin",
        state: "You need to login"
      }} />
    }
    return (
      <div>
        {this.state.error && (
          <div className="alert alert-warning">
            <h><strong>Failed!&nbsp;</strong>{this.state.error}</h>
          </div>
        )}
        <form onSubmit={this.addComment}>
          <div className="form-group">
            <textarea type="text"
              onChange={this.handleChange}
              placeholder="Leave a comment..."
              className="form-control"
              value={this.state.text}
            />
            <button className="btn btn-raised btn-primary">Send Comment</button>
          </div>
        </form>
        <h4 className="text-primary">{comments.length} Comments</h4>
        {comments.map((comment, i) => (

          <div className="media">
            <div class="media-left">
              <img
                style={{
                  borderRadius: "50%",
                  height: "30px",
                  width: "30px"
                }}
                className="float-left mr-3"
                onError={i => (i.target.src = `${DefaultProfile}`)}
                src={`${process.env.REACT_APP_API_URL}/user/photo/${comment.postedBy._id}`}
                alt={comment.postedBy.name}
              />
            </div>
            <div 
            className="media-body card"
            style={{background:"transparent", boxShadow:"none"}}
            >
            <div className="d-inline">
            <Link className="mt-0 media-heading"
              to={`/user/${comment.postedBy._id}`}
              >{comment.postedBy.name}</Link>

              {isAuthenticated().user && isAuthenticated().user._id === comment.postedBy._id && (
                <i 
              onClick={() => this.deleteConfirm(comment)}
              style={{cursor:"pointer"}}
              className="fas fa-trash-alt float-right">
              </i>
              )}

            </div>
              <small style={{ color: "#C0C0C0" }}>on &nbsp;
                  <Moment format="DD MMM YYYY">
                    {comment.created}
                  </Moment>
                </small>
              <p>{comment.text}</p>
            </div>
          </div>
        ))}
      </div>
    )
  }
}
export default Comment;
