

// "use client";

// import { useState } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import Image from "next/image";

// const Login = () => {
//   const router = useRouter();

//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState("");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const { data } = await axios.get("/credentials.json"); // Fetch JSON file
//       const user = data.users.find(
//         (user: { username: string; password: string }) =>
//           user.username === username && user.password === password
//       );

//       if (user) {
//         alert("Login successful!");
//         router.push("/dashboard");
//       } else {
//         setError("Invalid username or password");
//       }
//     } catch (err) {
//       setError("Failed to fetch credentials. Please try again.");
//     }
//   };

//   return (
//     <div className="relative flex min-h-screen items-center justify-center bg-gray-900">
//       {/* Background Image */}
//       <Image
//         src="/armssteel.jpeg"
//         alt="Steel Mill Background"
//         fill
//         className="absolute top-0 left-0 object-cover opacity-20"
//         priority
//       />

//       {/* Login Form */}
//       <form
//         onSubmit={handleSubmit}
//         className="relative z-10 w-full max-w-lg max-h-max rounded-xl bg-white p-10 shadow-2xl opacity-70"
//       >
//         <h2 className="mb-8 text-center text-3xl font-extrabold text-gray-800">
//           Login
//         </h2>
//         {error && (
//           <p className="mb-6 text-center text-sm text-red-500">{error}</p>
//         )}
//         <div className="mb-6">
//           <label
//             htmlFor="username"
//             className="block text-lg font-semibold text-gray-700"
//           >
//             Username
//           </label>
//           <input
//             type="text"
//             id="username"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring focus:ring-blue-300"
//             required
//           />
//         </div>
//         <div className="mb-6 relative">
//           <label
//             htmlFor="password"
//             className="block text-lg font-semibold text-gray-700"
//           >
//             Password
//           </label>
//           <input
//             type={showPassword ? "text" : "password"}
//             id="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring focus:ring-blue-300"
//             required
//           />
//           <button
//             type="button"
//             onClick={() => setShowPassword(!showPassword)}
//             className="absolute right-4 top-3 text-gray-500 hover:text-gray-700"
//           >
//             {showPassword ? "Hide" : "Show"}
//           </button>
//         </div>
//         <button
//           type="submit"
//           className="w-full rounded-lg bg-orange-600 px-6 py-3 text-lg font-semibold text-white hover:bg-orange-400 focus:ring focus:ring-blue-300"
//         >
//           Login
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Login;


"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Login = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await axios.get("/credentials.json"); // Fetch JSON file
      const user = data.users.find(
        (user: { username: string; password: string }) =>
          user.username === username && user.password === password
      );

      if (user) {
        setSuccess(true); // Set success state to true
        setTimeout(() => {
          router.push("/dashboard"); // Redirect after a delay
        }, 2000); // Delay for 2 seconds to show the success message
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      setError("Failed to fetch credentials. Please try again.");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gray-900">
      {/* Background Image */}
      <Image
        src="/armssteel.jpeg"
        alt="Steel Mill Background"
        fill
        className="absolute top-0 left-0 object-cover opacity-20"
        priority
      />

      {success ? (
        // Success Message Box
        <div className="relative z-10 w-full max-w-md rounded-lg bg-green-500 p-6 text-center text-white shadow-lg">
          <h2 className="text-2xl font-bold">Login Successful!</h2>
          <p className="mt-2">You will be redirected to the dashboard shortly.</p>
        </div>
      ) : (
        // Login Form
        <form
          onSubmit={handleSubmit}
          className="relative z-10 w-full max-w-lg max-h-max rounded-xl bg-white p-10 shadow-2xl opacity-70"
        >
          <h2 className="mb-8 text-center text-3xl font-extrabold text-gray-800">
            Login
          </h2>
          {error && (
            <p className="mb-6 text-center text-sm text-red-500">{error}</p>
          )}
          <div className="mb-6">
            <label
              htmlFor="username"
              className="block text-lg font-semibold text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <div className="mb-6 relative">
            <label
              htmlFor="password"
              className="block text-lg font-semibold text-gray-700"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring focus:ring-blue-300"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-orange-600 px-6 py-3 text-lg font-semibold text-white hover:bg-orange-400 focus:ring focus:ring-blue-300"
          >
            Login
          </button>
        </form>
      )}
    </div>
  );
};

export default Login;
