import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Bus } from "lucide-react";
import toast from "react-hot-toast";
import { authAPI } from "../services/api";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await authAPI.login(data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logo}>
          <Bus size={28} color="#222" />
        </div>
        <h2 style={styles.title}>Smart School Bus</h2>
        <p style={styles.subtitle}>Sign in to access your account</p>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
              })}
              type="email"
              placeholder="@example.com"
              style={styles.input}
            />
            {errors.email && <p style={styles.error}>{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.passwordWrapper}>
              <input
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "At least 6 characters" },
                })}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                style={{ ...styles.input, paddingRight: "40px" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.toggleBtn}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p style={styles.error}>{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <button type="submit" style={styles.btn} disabled={isLoading}>
            {isLoading ? <span style={styles.loader}></span> : "Sign In"}
          </button>
        </form>

        {/* Register link */}
        <div style={styles.registerLink}>
          <p>
            Don&apos;t have an account?{" "}
            <Link to="/register" style={styles.link}>
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

// React Style Objects
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(to bottom right, #eef4ff, #fff8e1)",
    fontFamily: "Segoe UI, Tahoma, sans-serif",
    padding: "1rem",
  },
  card: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "15px",
    boxShadow: "0 6px 20px rgba(8, 6, 6, 0.1)",
    width: "100%",
    maxWidth: "380px",
    textAlign: "center",
  },
  logo: {
    width: "60px",
    height: "60px",
    background: "#ffd54f",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 auto 1rem",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: "700",
    color: "#333",
    marginBottom: "0.3rem",
  },
  subtitle: {
    color: "#666",
    fontSize: "0.9rem",
    marginBottom: "1.5rem",
  },
  formGroup: {
    marginBottom: "1rem",
    textAlign: "left",
  },
  label: {
    fontSize: "0.9rem",
    color: "#444",
    display: "block",
    marginBottom: "0.3rem",
  },
  input: {
    width: "100%",
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "0.95rem",
    transition: "border 0.2s, box-shadow 0.2s",
    outline: "none",
  },
  error: {
    color: "#d32f2f",
    fontSize: "0.8rem",
    marginTop: "0.3rem",
  },
  passwordWrapper: {
    position: "relative",
  },
  toggleBtn: {
    position: "absolute",
    top: "50%",
    right: "10px",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#666",
  },
  btn: {
    background: "linear-gradient(90deg, #fbc02d, #fdd835)",
    color: "#fff",
    fontWeight: "600",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    width: "100%",
    marginTop: "10px",
    transition: "0.3s",
  },
  loader: {
    width: "30px",
    height: "30px",
    border: "3px solid white",
    borderTop: "3px solid transparent",
    borderRadius: "50%",
    display: "inline-block",
    animation: "spin 0.8s linear infinite",
  },
  registerLink: {
    marginTop: "1rem",
    fontSize: "0.9rem",
    color: "#555",
  },
  link: {
    color: "#fa5a03ff",
    fontWeight: "600",
    textDecoration: "none",
  },
};

export default Login;
