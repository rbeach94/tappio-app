import { Home, LayoutDashboard, Settings, Headset, LogOut, Menu } from "lucide-react";
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

  const navigationItems = [
    { icon: Home, label: "Home", onClick: () => navigate("/") },
    { icon: LayoutDashboard, label: "Dashboard", onClick: () => navigate("/dashboard") },
    { icon: Settings, label: "Admin", onClick: () => navigate("/admin") },
    { icon: Headset, label: "Support", onClick: () => navigate("/support") },
  ];

  return (
    <nav className="bg-background border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4 items-center">
            {navigationItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                className="flex items-center space-x-2"
                onClick={item.onClick}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Button>
            ))}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center">
            <Sheet>
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
                      onClick={() => {
                        item.onClick();
                        setIsOpen(false);
                      }}
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

          {/* Dashboard Button (visible on all screens) */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              className="flex items-center space-x-2"
              onClick={() => navigate("/dashboard")}
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