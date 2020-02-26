import axios from "axios";
import Cookies from "js-cookie";

export const register = newUser => {
  return axios
    .post("user/register", {
      username: newUser.username,
      hashedPassword: newUser.hashedPassword,
      email: newUser.email,
      phone: newUser.phone,
      gender: newUser.gender,
      confirmPassword: newUser.confirmPassword
    })
    .then(res => {
      if (res.data.error) {
        const check = {
          status: false,
          error: res.data.error
        };
        return check;
      } else {
        const check = {
          status: true,
          data: res.data
        };
        return check;
      }
    });
};

export const login = user => {
  return axios
    .post("user/login", {
      email: user.email,
      hashedPassword: user.hashedPassword
    })
    .then(res => {
      if (res.data.error) {
        const check = {
          status: false,
          error: res.data.error
        };
        return check;
      } else {
        Cookies.set("usertoken", res.data);
        const check = {
          status: true,
          data: res.data
        };
        return check;
      }
    });
};

export const pay = add_money => {
  return axios
    .post(
      "user/add_money_to_wallet",
      { amount: add_money.amount },
      { headers: { Authorization: add_money.token } }
    )
    .then(res => {
      if (res.data.error) {
        const check = {
          status: false,
          error: res.data.error
        };
        return check;
      } else {
        const check = {
          status: true,
          data: res.data.link
        };
        return check;
      }
    });
};

export const gasTrans = () => {
  return axios.post("user/gmap", { lat: "13", lng: "80" }).then(res => {
    if (res.data.error) {
      const check = {
        status: false,
        error: res.data.error
      };
      return check;
    } else {
      const check = {
        status: true,
        data: res.data
      };
      console.log(res);
      return res;
    }
  });
};

export const profile = prof => {
  return axios
    .get("user/profile", { headers: { Authorization: prof.token } })
    .then(res => {
      if (res.data.error) {
        const check = {
          status: false,
          error: res.data.error
        };
        return check;
      } else {
        const check = {
          status: true,
          data: res.data.link
        };
        console.log(res);
        return res;
      }
    });
};
