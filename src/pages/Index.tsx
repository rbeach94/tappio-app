import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuthForm } from "@/components/AuthForm";
import { Card, CardContent } from "@/components/ui/card";
import { Smartphone, ArrowRight, CheckCircle2 } from "lucide-react";

const Index = () => {
  const [showLogin, setShowLogin] = useState(true);
  const navigate = useNavigate();

  const benefits = [
    "Share your contact details instantly with a tap",
    "Customize your digital business card anytime",
    "Track engagement and networking analytics",
    "Environmentally friendly - no paper waste",
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Auth Form */}
      <div className="w-full md:w-1/2 p-4 md:p-8 flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="w-full max-w-md">
          <AuthForm mode={showLogin ? "login" : "signup"} />
          <p className="text-center mt-4 text-sm text-gray-600">
            {showLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setShowLogin(!showLogin)}
              className="text-primary hover:underline"
            >
              {showLogin ? "Sign up" : "Log in"}
            </button>
          </p>
        </div>
      </div>

      {/* Right Side - NFC Info */}
      <div className="w-full md:w-1/2 p-4 md:p-8 bg-[#192734] text-white flex items-center">
        <div className="max-w-xl mx-auto space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Smartphone size={40} className="text-[#8899ac]" />
              <h1 className="text-3xl md:text-4xl font-bold">
                Digital Business Cards
              </h1>
            </div>
            <p className="text-lg text-gray-300">
              Transform your networking experience with our modern NFC-powered
              digital business cards. Share your professional identity with a
              simple tap.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              Why Choose Digital? <ArrowRight className="text-[#8899ac]" />
            </h2>
            <div className="grid gap-4">
              {benefits.map((benefit, index) => (
                <Card key={index} className="bg-white/10 border-none">
                  <CardContent className="p-4 flex items-start gap-3">
                    <CheckCircle2 className="text-[#8899ac] shrink-0 mt-1" />
                    <p className="text-gray-200">{benefit}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;