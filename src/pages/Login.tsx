import { AuthForm } from "@/components/AuthForm";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 page-transition">
      <AuthForm mode="login" />
    </div>
  );
};

export default Login;