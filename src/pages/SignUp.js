import React, { useState, useEffect } from "react";
import {Link, useNavigate} from 'react-router-dom'
import './Auth.css'

function SignUp() {
  const navigate = useNavigate()
  const [buttonValue, setButtonValue] = useState("Get OTP");
  const [showOTP, setShowOTP] = useState(false);
  const [OTP, setOTP] = useState("");
  const [isLoading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  function handleFormData(e) {
    setFormData((prev) => {
      return { ...prev, [e.target.id]: e.target.value };
    });
  }

  function handleGetOTP(e) {
    e.preventDefault();
    setLoading(true);
    console.log(`${process.env.REACT_APP_BACKEND_URL}/auth/sign-up`);
    fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/sign-up`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success !== true) {
          console.log(data.message);
        } else {
          setShowOTP(true);
          setButtonValue("Resend");
        }
      })
      .catch((e) => console.log(e))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (OTP !== "") {
      setButtonValue("Verify");
    } else {
      setButtonValue("Resend");
    }
  }, [OTP]);

  function handleSubmit(e) {
    e.preventDefault();

    if (OTP === "") {
      setLoading(true);
      fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/resend-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: formData.username }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            console.log("OTP resent");
          } else {
            console.log(data.message);
          }
        })
        .catch((e) => console.log(e))
        .finally(() => setLoading(false));
    } else {
      setLoading(true);
      fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/check-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: formData.username, OTP: OTP }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            console.log("Verified");
            navigate('/sign-in')
          } else {
            console.log(data.message);
            setOTP("");
          }
        })
        .finally(() => setLoading(false));
    }
  }

  return (
    <div className="hero">
      <h2>Sign Up</h2>
      <form>
        <input
          type="text"
          placeholder="Username"
          id="username"
          required
          value={formData["username"]}
          onChange={(e) => {
            handleFormData(e);
          }}
        />
        <input
          type="email"
          placeholder="Email"
          id="email"
          required
          value={formData["email"]}
          onChange={(e) => {
            handleFormData(e);
          }}
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          required
          value={formData["password"]}
          onChange={(e) => {
            handleFormData(e);
          }}
        />
        {showOTP && (
          <>
            <input
              type="number"
              id="otp"
              onChange={(e) => {
                setOTP(e.target.value.slice(0, 4));
              }}
              value={OTP}
              placeholder="OTP"
            />
            <input
              type="submit"
              value={isLoading ? "Loading" : buttonValue}
              onClick={(e) => handleSubmit(e)}
            />
          </>
        )}

        {!showOTP && (
          <input
            type="submit"
            value={isLoading ? "Loading" : "Submit"}
            onClick={(e) => handleGetOTP(e)}
          />
        )}

        <h5>Already have an account <Link to="/sign-in">Sign in?</Link></h5>
      </form>
    </div>
  );
}

export default SignUp;
