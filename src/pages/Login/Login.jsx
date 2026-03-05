import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import { useAuth } from '../../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebookF, FaApple } from 'react-icons/fa';
import lap from '../../assets/images/lap.png';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: 'admin@lms.com',
        password: 'admin123',
    });
    const { login, error, clearError } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        clearError();
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const success = login(formData.email, formData.password);
        if (success) {
            navigate('/dashboard');
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <div className={styles.loginPage}>
            {/* Left Panel - Login Form */}
            <div className={styles.leftPanel}>
                <div className={styles.formContainer}>
                    <h1 className={styles.title}>Welcome Back!!</h1>

                    {error && <div className={styles.errorMsg}>{error}</div>}

                    <form onSubmit={handleSubmit}>
                        {/* Email Field */}
                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor="login-email">
                                Email
                            </label>
                            <div className={styles.inputWrapper}>
                                <FiMail className={styles.inputIcon} />
                                <input
                                    id="login-email"
                                    className={styles.input}
                                    type="email"
                                    name="email"
                                    placeholder="email@gmail.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    autoComplete="email"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor="login-password">
                                Password
                            </label>
                            <div className={styles.inputWrapper}>
                                <FiLock className={styles.inputIcon} />
                                <input
                                    id="login-password"
                                    className={styles.input}
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    autoComplete="current-password"
                                    required
                                />
                                <button
                                    type="button"
                                    className={styles.passwordToggle}
                                    onClick={togglePasswordVisibility}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                        </div>

                        {/* Forgot Password */}
                        <div className={styles.forgotPassword}>
                            <a href="#" className={styles.forgotLink}>
                                Forgot Password?
                            </a>
                        </div>

                        {/* Login Button */}
                        <button type="submit" className={styles.loginButton} id="login-submit-btn">
                            Login
                        </button>
                    </form>

                    {/* Demo Credentials */}
                    <div className={styles.demoCredentials}>
                        <span className={styles.demoLabel}>Demo Logins:</span>
                        <button type="button" className={styles.demoBtn} onClick={() => setFormData({ email: 'admin@lms.com', password: 'admin123' })}>Admin</button>
                        <button type="button" className={styles.demoBtn} onClick={() => setFormData({ email: 'priya@lms.com', password: 'sales123' })}>Sales</button>
                        <button type="button" className={styles.demoBtn} onClick={() => setFormData({ email: 'anjali@lms.com', password: 'manager123' })}>Manager</button>
                    </div>

                    {/* Divider */}
                    <div className={styles.divider}>
                        <span className={styles.dividerLine}></span>
                        <span className={styles.dividerLine}></span>
                    </div>

                    {/* Social Login */}
                    <div className={styles.socialLogin}>
                        <button
                            className={styles.socialButton}
                            aria-label="Sign in with Google"
                            id="social-google-btn"
                        >
                            <FcGoogle className={styles.googleIcon} />
                        </button>
                        <button
                            className={styles.socialButton}
                            aria-label="Sign in with Facebook"
                            id="social-facebook-btn"
                        >
                            <FaFacebookF className={styles.facebookIcon} />
                        </button>
                        <button
                            className={styles.socialButton}
                            aria-label="Sign in with Apple"
                            id="social-apple-btn"
                        >
                            <FaApple className={styles.appleIcon} />
                        </button>
                    </div>

                    {/* Sign Up Link */}
                    <p className={styles.signupText}>
                        Don't have an account?
                        <a href="#" className={styles.signupLink}>
                            Sign up
                        </a>
                    </p>
                </div>
            </div>

            {/* Right Panel - Illustration */}
            <div className={styles.rightPanel}>
                <div className={styles.archContainer}>
                    <div className={styles.arch}>
                        <img
                            src={lap}
                            alt="Person working on laptop with headphones"
                            className={styles.characterImage}
                        />
                    </div>
                    {/* Decorative floating circles */}
                    <div className={styles.decorCircle1}></div>
                    <div className={styles.decorCircle2}></div>
                    <div className={styles.decorCircle3}></div>
                </div>
            </div>
        </div>
    );
};

export default Login;
