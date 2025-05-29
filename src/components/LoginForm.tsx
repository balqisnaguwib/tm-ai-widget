"use client";

import { useState } from "react";
import { loginUser } from "@/lib/api";
import { storage } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await loginUser(username, password);
      
      if (response.status === "success" && response.user_info) {
        // Store user data in session storage
        storage.setUser(response.user_info);
        
        // Redirect to survey page
        router.push("/chat/survey");
      } else {
        setError(response.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-center mb-8">
        <Image 
          src="/tm-logo.png" 
          alt="TM Logo" 
          width={150} 
          height={60}
          className="animate-float"
        />
      </div>
      
      <div className="glass-effect rounded-2xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-tm-blue to-tm-orange bg-clip-text text-transparent">
          AI Day Login
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-500 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-2">
              Staff ID
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="ios-input w-full focus:outline-none focus:ring-2 focus:ring-tm-blue"
              placeholder="Enter your Staff ID"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="ios-input w-full focus:outline-none focus:ring-2 focus:ring-tm-blue"
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 bg-gradient-to-r from-tm-blue to-tm-orange text-white font-medium rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}