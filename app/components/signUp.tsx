import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const signUpSchema = z.object({
    email: z.string().email("Invalid email address"),
    username: z.string().min(6, "Username must be at least 6 characters"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must include at least one uppercase letter")
        .regex(/[a-z]/, "Password must include at least one lowercase letter")
        .regex(/\d/, "Password must include at least one number"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type SignUpFormData = z.infer<typeof signUpSchema>;

interface SignUpProps {
    onSubmit: (data: SignUpFormData) => void;
    onSwitchToSignIn: () => void;
}

export function SignUp({ onSubmit, onSwitchToSignIn }: SignUpProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email
                </label>
                <input
                    {...register("email")}
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                {errors.email && (
                    <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                )}
            </div>

            {/* Username */}
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    Username
                </label>
                <input
                    {...register("username")}
                    type="text"
                    placeholder="Choose a username"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                {errors.username && (
                    <p className="text-red-400 text-sm mt-1">{errors.username.message}</p>
                )}
            </div>

            {/* Password */}
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    Password
                </label>
                <input
                    {...register("password")}
                    type="password"
                    placeholder="Create a password"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                {errors.password && (
                    <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
                )}
            </div>

            {/* Confirm Password */}
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    Confirm Password
                </label>
                <input
                    {...register("confirmPassword")}
                    type="password"
                    placeholder="Confirm your password"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                {errors.confirmPassword && (
                    <p className="text-red-400 text-sm mt-1">
                        {errors.confirmPassword.message}
                    </p>
                )}
            </div>

            {/* Sign Up Button */}
            <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 cursor-pointer"
            >
                Sign Up
            </button>

            {/* Toggle Link */}
            <div className="text-center mt-4">
                <p className="text-slate-400">
                    Already have an account?{" "}
                    <button
                        type="button"
                        onClick={onSwitchToSignIn}
                        className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
                    >
                        Sign In
                    </button>
                </p>
            </div>
        </form>
    );
}
