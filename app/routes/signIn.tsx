import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Route } from "./+types/signIn";
import { useNavigate } from "react-router";

import { SignUp } from "../components/signUp";
import { useUser } from "../contexts/UserContext";
import "./signIn.css";

const signInSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
});

type SignInFormData = z.infer<typeof signInSchema>;

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Sign In - Vale of Eternity" },
        { name: "description", content: "Vale of Eternity Board Game" },
    ];
}

export default function AuthPage() {
    const [isSignUp, setIsSignUp] = useState(false);
    const navigate = useNavigate();
    const { login } = useUser();

    const signInForm = useForm<SignInFormData>({
        resolver: zodResolver(signInSchema),
    });

    const onSignInSubmit = (data: SignInFormData) => {
        // Allow any username/password
        login(data.username);
        navigate("/lobby");
    };

    const onSignUpSubmit = (data: any) => {
        console.log("Sign up:", data);
        // TODO: Handle sign up
        setIsSignUp(false);
    };

    const handleGoogleAuth = () => {
        console.log(isSignUp ? "Google sign up" : "Google sign in");
        // TODO: Handle Google SSO
        navigate("/lobby");
    };

    return (
        <div className="sign-in-container fixed inset-0 bg-cover bg-center bg-no-repeat overflow-y-auto">
            {/* Background Overlay */}
            <div className="fixed inset-0 bg-black/40" />

            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-slate-600/60 backdrop-blur-sm rounded-lg shadow-xl p-8">
                    <div className="text-center mb-8">
                        <h1 className="title-glow text-3xl font-bold text-white mb-2">
                            Vale of Eternity
                        </h1>
                        <p className="text-slate-300">
                            {isSignUp ? "Create your account" : "Sign in to your account"}
                        </p>
                    </div>

                    {/* Form */}
                    {isSignUp ? (
                        <SignUp
                            onSubmit={onSignUpSubmit}
                            onSwitchToSignIn={() => setIsSignUp(false)}
                        />
                    ) : (
                        <form onSubmit={signInForm.handleSubmit(onSignInSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Username
                                </label>
                                <input
                                    {...signInForm.register("username")}
                                    type="text"
                                    placeholder="Enter your username"
                                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                                {signInForm.formState.errors.username && (
                                    <p className="text-red-400 text-sm mt-1">
                                        {signInForm.formState.errors.username.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Password
                                </label>
                                <input
                                    {...signInForm.register("password")}
                                    type="password"
                                    placeholder="Enter your password"
                                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                                {signInForm.formState.errors.password && (
                                    <p className="text-red-400 text-sm mt-1">
                                        {signInForm.formState.errors.password.message}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 cursor-pointer"
                            >
                                Sign In
                            </button>

                            <div className="text-center mt-4">
                                <p className="text-slate-300">
                                    Don't have an account?{" "}
                                    <button
                                        type="button"
                                        onClick={() => setIsSignUp(true)}
                                        className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
                                    >
                                        Sign Up
                                    </button>
                                </p>
                            </div>
                        </form>
                    )}

                    {/* SSO option */}
                    {!isSignUp && <>
                        <div className="flex items-center my-6">
                            <div className="flex-1 border-t border-slate-600"></div>
                            <span className="px-3 text-slate-300 text-sm">or</span>
                            <div className="flex-1 border-t border-slate-600"></div>
                        </div>

                        <button
                            onClick={handleGoogleAuth}
                            className="w-full flex items-center justify-center gap-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 border border-slate-600 cursor-pointer"
                        >
                            <i className="fa-brands fa-google"></i>
                            {isSignUp ? "Sign up with Google" : "Sign in with Google"}
                        </button></>}

                </div>
            </div>
        </div>
    );
}
