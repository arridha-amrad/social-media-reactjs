import React, { Component } from 'react'
import { list } from './apiPost';
import DefaultProfile from '../image/avatar.png';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import BigSpinner from '../image/BigSpinner';


class Posts extends Component {
  constructor() {
    super()
    this.state = {
      posts: []
    }
  }
  componentDidMount() {
    list().then(data => {
      if (data.error) {
        console.log(data.error)
      } else {
        this.setState({ posts: data })
      }
    })
  }
  renderPosts = posts => (
    <div className="row">
      {posts.map((post, i) => {
        const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
        const posterName = post.postedBy ? post.postedBy.name : "unknown";
        const postedDate = new Date(post.created);
        const postTitle = post.title.length > 20 ? post.title.substring(0, 20) + '...' : post.title.substring(0, 20)
        const postBody = post.body.length > 30 ? post.body.substring(0, 30) + '...' : post.body.substring(0, 30)

        return (
          <div className="col-md-4 mt-4" key={i}>
            <div className="card text-center" style={{ width: "18rem", background: "#fff", borderRadius: "20px" }}>
              <img
                src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
                onError={i => (i.target.src = `${DefaultProfile}`)}
                className="card-img-top mx-auto img-thumbnail"
                style={{ width: "auto", height: "200px" }}
                alt={post.title} />

              <div className="card-body">
                <h5 className="card-title">{postTitle}</h5>
                <p className="card-text">{postBody}</p>
                <small> Posted by: <Link to={`${posterId}`}>{posterName}</Link></small> <br />
                <small style={{ color: "#C0C0C0" }}>on &nbsp;
                  <Moment format="MMM YYYY">
                    {postedDate}
                  </Moment></small>
                <br /> <br />
                <Link to={`/post/${post._id}`} className="btn btn-secondary btn-raised">Read more</Link>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
  render() {
    const { posts } = this.state;
    return (
      <div className="container mt-5">
        <h2>Posts</h2>
        {!posts.length ? (
          <div className="text-center">
            <BigSpinner />
          </div>
        ) : (
            this.renderPosts(posts)
          )}

      </div>
    )
  }
}

export default Posts
