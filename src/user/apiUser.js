import { isAuthenticated } from '../auth';

export const read = (userId, token) => {
  return fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${isAuthenticated().token}`
    }
  }).then(response => {
    return response.json();
  })
    .catch(error => console.log(error));
};

// delete a user
export const remove = (userId, token) => {
  return fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${isAuthenticated().token}`
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