import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, LogIn, UserPlus } from "lucide-react";
import { toast } from "sonner";

const Activate = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [copying, setCopying] = useState(false);

  const handleCopy = async () => {
    if (!code) return;
    setCopying(true);
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy code");
    } finally {
      setCopying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 page-transition">
      <Card className="w-full max-w-md mx-auto glass-card">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">
            Activate Your NFC Code
          </CardTitle>
          <CardDescription className="text-center">
            This code hasn't been activated yet. Sign in or create an account to claim it.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div 
            className="p-4 bg-muted rounded-lg text-center cursor-pointer hover:bg-muted/80 transition-colors"
            onClick={handleCopy}
          >
            <p className="text-2xl font-mono mb-2">{code}</p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Copy className="w-4 h-4" />
              <span>Click to copy</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={() => navigate("/login")}
              className="w-full hover-scale"
              size="lg"
            >
              <LogIn className="mr-2" />
              Sign In
            </Button>
            <Button
              onClick={() => navigate("/signup")}
              variant="outline"
              className="w-full hover-scale"
              size="lg"
            >
              <UserPlus className="mr-2" />
              Create Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Activate;