import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { Shield, Lock, Mail } from "lucide-react";

export default function AuthPortal() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setAuthLoading(true);

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );

        // HARDCODED SECURITY: Public signups can ONLY generate student candidates
        await setDoc(doc(db, "users", userCredential.user.uid), {
          uid: userCredential.user.uid,
          email: email,
          role: "student",
          createdAt: new Date().toISOString(),
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center text-blue-600 mb-3">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold tracking-tight text-slate-800 uppercase">
            Assessment Hub Entry
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            VERIFIED PORTAL LOGIN SYSTEM
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-lg mb-4 font-medium">
            Error: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold tracking-wide text-slate-600 uppercase mb-1">
              Institutional Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-lg pl-10 pr-4 py-2 text-sm text-slate-800 outline-none transition"
                placeholder="name@college.edu"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-wide text-slate-600 uppercase mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-lg pl-10 pr-4 py-2 text-sm text-slate-800 outline-none transition"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={authLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-lg transition uppercase tracking-wider shadow-sm disabled:opacity-50"
          >
            {authLoading
              ? "Verifying..."
              : isSignUp
                ? "Create Candidate Profile"
                : "Authenticate Account"}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-100 text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError("");
            }}
            className="text-xs text-blue-600 hover:text-blue-700 transition font-medium underline underline-offset-4"
          >
            {isSignUp
              ? "◄ Existing User? Login Here"
              : "Need to generate an institutional profile? Register ►"}
          </button>
        </div>
      </div>
    </div>
  );
}
