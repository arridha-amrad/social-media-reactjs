export const read = (userId, token) => {
  return fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  }).then(response => {
    return response.json();
  })
    .catch(error => console.log(error));
};

// update
export const update = (userId, token, userData) => {
  // di fungsi update kita mengirim form data
  // tidak bentuk json
  return fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    },
    body: userData
  }).then(response => {
    return response.json();
  })
    .catch(error => console.log(error));
};

// update user
// update diatas tidak merubah nama user di navbar
// sehingga dibuat fungsi ini
// ini adalah middleware
export const updateUser = (user, next) => {
  if (typeof window !== "undefined") {
    if (localStorage.getItem("jwt")) {
      let auth = JSON.parse(localStorage.getItem("jwt"));
      auth.user = user;
      localStorage.setItem("jwt", JSON.stringify(auth));
      next();
    }
  }
}

// delete a user
export const remove = (userId, token) => {
  return fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  }).then(response => {
    return response.json();
  })
    .catch(error => console.log(error));
};

export const list = () => {
  return fetch(`${process.env.REACT_APP_API_URL}/users`, {
    method: "GET"
  }).then(response => {
    return response.json();
  })
    .catch(err => console.log(err));
}

// follow
export const follow = (userId, token, followId) => {
  return fetch(`${process.env.REACT_APP_API_URL}/user/follow`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ userId, followId })
  }).then(response => {
      return response.json();
  }).catch(err => console.log(err));
}
// return response.json();
// }).catch(err => console.log(err));

// unfollow
export const unfollow = (userId, token, unfollowId) => {
  return fetch(`${process.env.REACT_APP_API_URL}/user/unfollow`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ userId, unfollowId })
  }).then(response => {
      return response.json();
    }).catch(err => console.log(err));
};

export const findPeople = (userId, token) => {
  return fetch(`${process.env.REACT_APP_API_URL}/user/findpeople/${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type" : "application/json",
      Authorization: `Bearer ${token}`
    }
  })
  .then(response => {
    return response.json();
  })
  .catch(err =>
    console.log(err));
}