import { Home, LayoutDashboard, Settings, MessageSquare, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const Navigation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

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

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false); // Close the mobile menu after navigation
  };

  const navigationItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Settings, label: "Admin", path: "/admin" },
    { icon: MessageSquare, label: "Feedback", path: "/feedback" },
  ];

  return (
    <nav className="bg-background border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="hidden md:flex space-x-4 items-center">
            {navigationItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                className="flex items-center space-x-2"
                onClick={() => handleNavigation(item.path)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Button>
            ))}
          </div>

          <div className="md:hidden flex items-center">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[280px]">
                <div className="flex flex-col space-y-4 mt-4">
                  {navigationItems.map((item) => (
                    <Button
                      key={item.label}
                      variant="ghost"
                      className="flex items-center justify-start space-x-2 w-full"
                      onClick={() => handleNavigation(item.path)}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Button>
                  ))}
                  <Button
                    variant="ghost"
                    className="flex items-center justify-start space-x-2 w-full"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Log out</span>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex items-center">
            <Button
              variant="ghost"
              className="flex items-center space-x-2"
              onClick={() => handleNavigation("/dashboard")}
            >
              <LayoutDashboard className="h-5 w-5" />
              <span className="hidden md:inline">Dashboard</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};