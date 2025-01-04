import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-8 page-transition">
      <div className="max-w-3xl text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Welcome to Your Premium Platform
        </h1>
        <p className="text-xl text-muted-foreground">
          Experience the future of digital interaction with our cutting-edge platform
        </p>
      </div>
      
      <div className="flex gap-4">
        <Button
          onClick={() => navigate("/login")}
          className="hover-scale"
          size="lg"
        >
          Sign In
        </Button>
        <Button
          onClick={() => navigate("/signup")}
          variant="outline"
          className="hover-scale"
          size="lg"
        >
          Create Account
        </Button>
      </div>
    </div>
  );
};

export default Index;