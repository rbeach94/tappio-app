import { AuthForm } from "@/components/AuthForm";

const Signup = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 page-transition">
      <AuthForm mode="signup" />
    </div>
  );
};

export default Signup;