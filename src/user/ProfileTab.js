import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Modal, ListGroup } from 'react-bootstrap';


class ProfileTab extends Component {
  constructor() {
    super()
    this.state = {
      show1: false,
      show2: false,
    }
  }
  handleClose1 = () => this.setState({ show1: false });
  handleClose2 = () => this.setState({ show2: false });
  handleShow1 = () => this.setState({ show1: true });
  handleShow2 = () => this.setState({ show2: true });

  render() {
    const { followers, following } = this.props;

    return (
      <div className="mb-4">
        <Button variant="primary" onClick={this.handleShow1}>
          following: {following.length}
        </Button>
        <Button variant="primary" onClick={this.handleShow2}>
          followers: {Object.keys(followers).length}
        </Button>

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
