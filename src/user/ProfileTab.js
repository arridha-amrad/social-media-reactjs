import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Modal, ListGroup, Badge } from 'react-bootstrap';


class ProfileTab extends Component {
  constructor() {
    super()
    this.state = {
      show1: false,
      show2: false,
      show3: false
    }
  }
  handleClose1 = () => this.setState({ show1: false });
  handleClose2 = () => this.setState({ show2: false });
  handleClose3 = () => this.setState({ show3: false });

  handleShow1 = () => this.setState({ show1: true });
  handleShow2 = () => this.setState({ show2: true });
  handleShow3 = () => this.setState({ show3: true });

  render() {
    const { followers, following, posts } = this.props;

    return (
      <div className="mb-4">
        <Badge pill style={{cursor: "pointer", fontWeight: "200", background: "#E0E0E0" }} className="mr-2" onClick={this.handleShow1}>
          following: {following.length}
        </Badge>
        <Badge pill style={{cursor: "pointer", fontWeight: "200", background: "#E0E0E0" }} className="mr-2" onClick={this.handleShow2}>
          followers: {Object.keys(followers).length}
        </Badge>
        <Badge pill style={{cursor: "pointer", fontWeight: "200", background: "#E0E0E0" }} onClick={this.handleShow3}>
          posts: {posts.length}
        </Badge>

        <Modal show={this.state.show3} onHide={this.handleClose3}>
          <Modal.Header closeButton>
            <Modal.Title>Posts</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {posts.map((post, i) => (
              <ListGroup key={i}>
                <ListGroup.Item>
                <img style={{width: "30px", height: "30px", borderRadius:"50%"}} src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`} alt={post.title}/>
                <Link to={`/post/${post._id}`}>{post.title}</Link>
                </ListGroup.Item>
              </ListGroup>
            ))}
          </Modal.Body>
        </Modal>

        <Modal show={this.state.show1} onHide={this.handleClose1}>
          <Modal.Header closeButton>
            <Modal.Title>Following</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {following.map((follow, i) => (
              <ListGroup key={i}>
                <ListGroup.Item>
                <img style={{width: "30px", height: "30px", borderRadius:"50%"}} src={`${process.env.REACT_APP_API_URL}/user/photo/${follow._id}`} alt={follow.name}/>
                <Link to={`/user/${follow._id}`}>{follow.name}</Link>
                </ListGroup.Item>
              </ListGroup>
            ))}
          </Modal.Body>
        </Modal>

        <Modal show={this.state.show2} onHide={this.handleClose2}>
          <Modal.Header closeButton>
            <Modal.Title>Followers</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {followers.map((follower, i) => (
              <ListGroup key={i}>
              <ListGroup.Item>
                <img style={{width: "30px", height: "30px", borderRadius:"50%"}} src={`${process.env.REACT_APP_API_URL}/user/photo/${follower._id}`} alt={follower.name}/>
                <Link to={`/user/${follower._id}`}>{follower.name}</Link>
                </ListGroup.Item>
              </ListGroup>
            ))}
          </Modal.Body>
        </Modal>
      </div>
    )
  }
}

export default ProfileTab
