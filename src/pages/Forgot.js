import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";

function Forgot() {
  const navigate = useNavigate();
  const [buttonValue, setButtonValue] = useState("Get OTP");
  const [showOTP, setShowOTP] = useState(false);
  const [OTP, setOTP] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [countdown, setcountdown] = useState(0);
  const countdownRef = useRef(null);

  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  function handleFormData(e) {
    setFormData((prev) => {
      return { ...prev, [e.target.id]: e.target.value };
    });
  }

  function handleGetOTP(e) {
    e.preventDefault();
    setLoading(true);
    fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/resend-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success === true) {
          setShowOTP(true);
          setButtonValue("Resend");
          setcountdown(15);

          console.log(data.message);
        } else {
          console.log(data.message);
        }
      })
      .catch((e) => console.log(e))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (OTP !== "") {
      setButtonValue("Verify");
    } else {
      const resendText = countdown <= 0 ? "Resend" : `Resend (${countdown}s)`;
      setButtonValue(resendText);
    }
  }, [OTP, countdown]);

  useEffect(() => {
    if (countdown <= 0) return;

    if (countdownRef.current) clearInterval(countdownRef.current);

    countdownRef.current = setInterval(() => {
      setcountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(countdownRef.current);
  }, [countdown]);

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
            setcountdown(15);
          } else {
            console.log(data.message);
          }
        })
        .catch((e) => console.log(e))
        .finally(() => setLoading(false));
    } else {
      setLoading(true);
      fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: formData.username, OTP: OTP , newPassword: formData.password}),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            console.log(data.message);
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
      <h2>Forgot Password</h2>
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
        
        {showOTP && (
          <>
            <input
              type="password"
              placeholder="New password"
              id="password"
              required
              value={formData["password"]}
              onChange={(e) => {
                handleFormData(e);
              }}
            />

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
              disabled={OTP.length > 0 ? false : countdown > 0 ? true : false}
              onClick={(e) => handleSubmit(e)}
            />
          </>
        )}

        {!showOTP && (
          <input
            type="submit"
            value={isLoading ? "Loading" : "Send OTP"}
            onClick={(e) => handleGetOTP(e)}
          />
        )}

        <h5>
          Back to <Link to="/sign-in">Sign in?</Link>
        </h5>
      </form>
    </div>
  );
}

export default Forgot;
