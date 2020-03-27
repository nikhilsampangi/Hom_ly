import axios from "axios";
import Cookies from "js-cookie";

export const register = newUser => {
  return axios
    .post("/customer/register", {
      firstName: newUser.firstname,
      lastName: newUser.lastname,
      hashedPassword: newUser.hashedPassword,
      email: newUser.email,
      phoneNum: newUser.phone
      // confirmPassword: newUser.confirmPassword
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
    .post("/customer/login", {
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

export const pwdReset = user => {
  return axios
    .post("/user/forgot_password", {
      email: user.email
    })
    .then(res => {
      if (res.data.error) {
        const check = {
          status: false,
          error: res.data.error
        };
        console.log(check);
        return check;
      } else {
        const check = {
          status: true,
          data: res.data
        };
        console.log(check);
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
      return check;
    }
  });
};

export const profile = prof => {
  return axios
    .get("user/profile", { headers: { Authorization: prof.token } })
    .then(res => {
      console.log(res);
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
        console.log(check);
        return check;
      }
    });
};
