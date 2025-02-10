// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { LogIn, AlertCircle } from "lucide-react";
// import toast from "react-hot-toast";
// import { useAuth } from "../context/AuthContext";

// export default function LoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [authType, setAuthType] = useState("local");
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   const { login, isAuthenticated } = useAuth();

//   useEffect(() => {
//     if (isAuthenticated) {
//       navigate("/ideation");
//     }
//   }, [isAuthenticated, navigate]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(null);

//     try {
//       const success = await login(email, password, authType);
//       if (success) {
//         toast.success("Login successful!");
//         navigate("/ideation");
//       } else {
//         setError("Invalid credentials");
//         toast.error("Invalid credentials");
//       }
//     } catch (error) {
//       const errorMessage =
//         error instanceof Error
//           ? error.message
//           : "An error occurred during login";
//       setError(errorMessage);
//       toast.error(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary-light to-white">
//       <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
//         <div className="text-center">
//           <h2 className="mt-6 text-3xl font-bold text-gray-900">
//             Sign in to your account
//           </h2>
//         </div>

//         <div className="flex justify-center space-x-4 mb-8">
//           <button
//             onClick={() => {
//               setAuthType("local");
//               setError(null);
//             }}
//             className={`px-4 py-2 rounded-md transition-colors duration-200 ${
//               authType === "local"
//                 ? "bg-primary text-white"
//                 : "bg-gray-100 text-gray-700 hover:bg-primary-light hover:text-primary"
//             }`}
//           >
//             Local Auth
//           </button>
//           <button
//             onClick={() => {
//               setAuthType("socialhub");
//               setError(null);
//             }}
//             className={`px-4 py-2 rounded-md transition-colors duration-200 ${
//               authType === "socialhub"
//                 ? "bg-primary text-white"
//                 : "bg-gray-100 text-gray-700 hover:bg-primary-light hover:text-primary"
//             }`}
//           >
//             SocialHub
//           </button>
//         </div>

//         {error && (
//           <div className="rounded-md bg-semantic-error-light p-4">
//             <div className="flex">
//               <div className="flex-shrink-0">
//                 <AlertCircle className="h-5 w-5 text-semantic-error" />
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm text-semantic-error">{error}</p>
//               </div>
//             </div>
//           </div>
//         )}

//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           <div className="rounded-md shadow-sm space-y-4">
//             <div>
//               <label htmlFor="email" className="label">
//                 {authType === "local" ? "Email address" : "SocialHub Username"}
//               </label>
//               <input
//                 id="email"
//                 name="email"
//                 type="text"
//                 autoComplete={authType === "local" ? "email" : "username"}
//                 required
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="input"
//                 placeholder={
//                   authType === "local" ? "Email address" : "SocialHub username"
//                 }
//               />
//             </div>
//             <div>
//               <label htmlFor="password" className="label">
//                 Password
//               </label>
//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 autoComplete="current-password"
//                 required
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="input"
//                 placeholder="Password"
//               />
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={isLoading}
//             className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             <LogIn
//               className={`h-5 w-5 mr-2 ${isLoading ? "animate-spin" : ""}`}
//             />
//             {isLoading ? "Signing in..." : "Sign in"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// LoginPage.propTypes = {
//   // No props needed as this is a top-level page component
// };

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { LogIn, Mail, Lock, AlertCircle, Loader2 } from "lucide-react";
// import toast from "react-hot-toast";
// import { motion } from "framer-motion";
// import { useAuth } from "../context/AuthContext";
// import clsx from "clsx";

// export default function LoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [authType, setAuthType] = useState("local");
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   const { login, isAuthenticated } = useAuth();

//   useEffect(() => {
//     if (isAuthenticated) {
//       navigate("/ideation");
//     }
//   }, [isAuthenticated, navigate]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(null);

//     try {
//       const success = await login(email, password, authType);
//       if (success) {
//         toast.success("Login successful!");
//         navigate("/ideation");
//       } else {
//         setError("Invalid credentials");
//         toast.error("Invalid credentials");
//       }
//     } catch (error) {
//       const errorMessage =
//         error instanceof Error
//           ? error.message
//           : "An error occurred during login";
//       setError(errorMessage);
//       toast.error(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const inputVariants = {
//     focus: { scale: 1.02, transition: { duration: 0.2 } },
//     blur: { scale: 1, transition: { duration: 0.2 } },
//   };

//   const buttonVariants = {
//     hover: { scale: 1.02 },
//     tap: { scale: 0.98 },
//     disabled: { opacity: 0.5 },
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-purple-50">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-xl border border-gray-100"
//       >
//         <div className="text-center">
//           <motion.h2
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.2 }}
//             className="mt-6 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
//           >
//             Welcome Back
//           </motion.h2>
//           <motion.p
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.3 }}
//             className="mt-2 text-gray-600"
//           >
//             Sign in to continue to your account
//           </motion.p>
//         </div>

//         <div className="flex justify-center space-x-4 mb-8">
//           {["local", "socialhub"].map((type) => (
//             <motion.button
//               key={type}
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => {
//                 setAuthType(type);
//                 setError(null);
//               }}
//               className={clsx(
//                 "px-6 py-2 rounded-full transition-all duration-200 font-medium",
//                 authType === type
//                   ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
//                   : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//               )}
//             >
//               {type === "local" ? "Email" : "SocialHub"}
//             </motion.button>
//           ))}
//         </div>

//         {error && (
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="rounded-lg bg-red-50 p-4 border border-red-100"
//           >
//             <div className="flex items-center">
//               <AlertCircle className="h-5 w-5 text-red-500" />
//               <p className="ml-3 text-sm text-red-500">{error}</p>
//             </div>
//           </motion.div>
//         )}

//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 {authType === "local" ? "Email address" : "SocialHub Username"}
//               </label>
//               <motion.div
//                 variants={inputVariants}
//                 whileFocus="focus"
//                 className="relative"
//               >
//                 <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                 <input
//                   type="text"
//                   required
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
//                   placeholder={
//                     authType === "local" ? "you@example.com" : "@username"
//                   }
//                 />
//               </motion.div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Password
//               </label>
//               <motion.div
//                 variants={inputVariants}
//                 whileFocus="focus"
//                 className="relative"
//               >
//                 <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                 <input
//                   type="password"
//                   required
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
//                   placeholder="Enter your password"
//                 />
//               </motion.div>
//             </div>
//           </div>

//           <motion.button
//             variants={buttonVariants}
//             whileHover="hover"
//             whileTap="tap"
//             disabled={isLoading}
//             type="submit"
//             className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {isLoading ? (
//               <Loader2 className="h-5 w-5 animate-spin" />
//             ) : (
//               <LogIn className="h-5 w-5 mr-2" />
//             )}
//             {isLoading ? "Signing in..." : "Sign in"}
//           </motion.button>
//         </form>
//       </motion.div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogIn,
  Mail,
  Lock,
  AlertCircle,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import clsx from "clsx";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authType, setAuthType] = useState("local");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState({ email: false, password: false });
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  // Validation states
  const [validationErrors, setValidationErrors] = useState({
    email: [],
    password: [],
  });

  // Password requirements
  const passwordRequirements = [
    {
      id: "length",
      label: "At least 8 characters",
      test: (pass) => pass.length >= 8,
    },
    {
      id: "uppercase",
      label: "One uppercase letter",
      test: (pass) => /[A-Z]/.test(pass),
    },
    {
      id: "lowercase",
      label: "One lowercase letter",
      test: (pass) => /[a-z]/.test(pass),
    },
    { id: "number", label: "One number", test: (pass) => /\d/.test(pass) },
    {
      id: "special",
      label: "One special character",
      test: (pass) => /[!@#$%^&*]/.test(pass),
    },
  ];

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/ideation");
    }
  }, [isAuthenticated, navigate]);

  // Validate email
  const validateEmail = (email) => {
    const errors = [];
    if (!email) {
      errors.push("Email is required");
    } else if (
      authType === "local" &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      errors.push("Please enter a valid email address");
    } else if (authType === "socialhub" && !/^@?[\w]+$/.test(email)) {
      errors.push(
        "Username should only contain letters, numbers, and underscores"
      );
    }
    return errors;
  };

  // Validate password
  const validatePassword = (password) => {
    const errors = [];
    if (!password) {
      errors.push("Password is required");
    } else if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    return errors;
  };

  // Handle input blur
  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === "email") {
      setValidationErrors((prev) => ({
        ...prev,
        email: validateEmail(email),
      }));
    } else if (field === "password") {
      setValidationErrors((prev) => ({
        ...prev,
        password: validatePassword(password),
      }));
    }
  };

  // Handle input change
  const handleInputChange = (field, value) => {
    if (field === "email") {
      setEmail(value);
      if (touched.email) {
        setValidationErrors((prev) => ({
          ...prev,
          email: validateEmail(value),
        }));
      }
    } else if (field === "password") {
      setPassword(value);
      if (touched.password) {
        setValidationErrors((prev) => ({
          ...prev,
          password: validatePassword(value),
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const emailErrors = validateEmail(email);
    const passwordErrors = validatePassword(password);

    setValidationErrors({
      email: emailErrors,
      password: passwordErrors,
    });

    setTouched({ email: true, password: true });

    // If there are any validation errors, don't submit
    if (emailErrors.length > 0 || passwordErrors.length > 0) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const success = await login(email, password, authType);
      if (success) {
        toast.success("Login successful!");
        navigate("/ideation");
      } else {
        setError("Invalid credentials");
        toast.error("Invalid credentials");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred during login";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const inputVariants = {
    focus: { scale: 1.02, transition: { duration: 0.2 } },
    blur: { scale: 1, transition: { duration: 0.2 } },
  };

  const buttonVariants = {
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
    disabled: { opacity: 0.5 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-xl border border-gray-100"
      >
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
          >
            Welcome Back
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-2 text-gray-600"
          >
            Sign in to continue to your account
          </motion.p>
        </div>

        <div className="flex justify-center space-x-4 mb-8">
          {["local", "socialhub"].map((type) => (
            <motion.button
              key={type}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setAuthType(type);
                setError(null);
                setValidationErrors({ email: [], password: [] });
                setTouched({ email: false, password: false });
              }}
              className={clsx(
                "px-6 py-2 rounded-full transition-all duration-200 font-medium",
                authType === type
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              {type === "local" ? "Email" : "SocialHub"}
            </motion.button>
          ))}
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg bg-red-50 p-4 border border-red-100"
          >
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="ml-3 text-sm text-red-500">{error}</p>
            </div>
          </motion.div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {authType === "local" ? "Email address" : "SocialHub Username"}
              </label>
              <motion.div
                variants={inputVariants}
                whileFocus="focus"
                className="relative"
              >
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  className={clsx(
                    "block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all duration-200",
                    touched.email && validationErrors.email.length > 0
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : touched.email && validationErrors.email.length === 0
                      ? "border-green-300 focus:border-green-500 focus:ring-green-500"
                      : "border-gray-300 focus:border-blue-500"
                  )}
                  placeholder={
                    authType === "local" ? "you@example.com" : "@username"
                  }
                />
                <AnimatePresence>
                  {touched.email && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {validationErrors.email.length === 0 ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              <AnimatePresence>
                {touched.email && validationErrors.email.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-1"
                  >
                    {validationErrors.email.map((error, index) => (
                      <p key={index} className="text-sm text-red-500">
                        {error}
                      </p>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <motion.div
                variants={inputVariants}
                whileFocus="focus"
                className="relative"
              >
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  onBlur={() => handleBlur("password")}
                  className={clsx(
                    "block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all duration-200",
                    touched.password && validationErrors.password.length > 0
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : touched.password &&
                        validationErrors.password.length === 0
                      ? "border-green-300 focus:border-green-500 focus:ring-green-500"
                      : "border-gray-300 focus:border-blue-500"
                  )}
                  placeholder="Enter your password"
                />
                <AnimatePresence>
                  {touched.password && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {validationErrors.password.length === 0 ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              <AnimatePresence>
                {touched.password && validationErrors.password.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-1"
                  >
                    {validationErrors.password.map((error, index) => (
                      <p key={index} className="text-sm text-red-500">
                        {error}
                      </p>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-4 space-y-2">
                {passwordRequirements.map((req) => (
                  <div key={req.id} className="flex items-center space-x-2">
                    {password && req.test(password) ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-gray-300" />
                    )}
                    <span
                      className={clsx(
                        "text-sm",
                        password && req.test(password)
                          ? "text-green-500"
                          : "text-gray-500"
                      )}
                    >
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            disabled={
              isLoading ||
              validationErrors.email.length > 0 ||
              validationErrors.password.length > 0
            }
            type="submit"
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <LogIn className="h-5 w-5 mr-2" />
            )}
            {isLoading ? "Signing in..." : "Sign in"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
