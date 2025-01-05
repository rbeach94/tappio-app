import { Home, LayoutDashboard, Settings, Headset, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const Navigation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    } else {
      navigate("/login");
    }
  };

  return (
    <nav className="bg-background border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex space-x-2 md:space-x-4 items-center overflow-x-auto">
            <Button
              variant="ghost"
              className="flex items-center space-x-2"
              onClick={() => navigate("/")}
            >
              <Home className="h-5 w-5" />
              <span className="hidden md:inline">Home</span>
            </Button>
            <Button
              variant="ghost"
              className="flex items-center space-x-2"
              onClick={() => navigate("/dashboard")}
            >
              <LayoutDashboard className="h-5 w-5" />
              <span className="hidden md:inline">Dashboard</span>
            </Button>
            <Button
              variant="ghost"
              className="flex items-center space-x-2"
              onClick={() => navigate("/admin")}
            >
              <Settings className="h-5 w-5" />
              <span className="hidden md:inline">Admin</span>
            </Button>
            <Button
              variant="ghost"
              className="flex items-center space-x-2"
              onClick={() => navigate("/support")}
            >
              <Headset className="h-5 w-5" />
              <span className="hidden md:inline">Support</span>
            </Button>
          </div>
          <div className="flex items-center">
            <Button
              variant="ghost"
              className="flex items-center space-x-2"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              <span className="hidden md:inline">Log out</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};