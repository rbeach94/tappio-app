import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface DashboardHeaderProps {
  userRole?: string;
}

export const DashboardHeader = ({ userRole }: DashboardHeaderProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    toast.success("Successfully logged out!");
    navigate("/login");
  };

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="flex gap-4">
        {userRole === "admin" && (
          <Button onClick={() => navigate("/admin")} variant="outline">
            Admin Dashboard
          </Button>
        )}
        <Button onClick={handleLogout} variant="outline">
          Sign Out
        </Button>
      </div>
    </div>
  );
};