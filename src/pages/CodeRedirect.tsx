import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const CodeRedirect = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const redirectToProfile = async () => {
      console.log('Attempting to redirect for code:', code);
      
      if (!code) {
        console.error('No code provided');
        navigate('/');
        return;
      }

      try {
        const { data: nfcCode, error } = await supabase
          .from('nfc_codes')
          .select('id, assigned_to')
          .eq('code', code)
          .single();

        if (error || !nfcCode) {
          console.error('Error fetching NFC code:', error);
          navigate('/');
          return;
        }

        // If the code is not assigned, redirect to activate page
        if (!nfcCode.assigned_to) {
          navigate(`/activate/${code}`);
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from('nfc_profiles')
          .select('id')
          .eq('code_id', nfcCode.id)
          .single();

        if (profileError || !profile) {
          console.error('Error fetching profile:', profileError);
          navigate('/');
          return;
        }

        // Redirect to the profile view page
        navigate(`/profile/${profile.id}/view`);
      } catch (error) {
        console.error('Error during redirect:', error);
        navigate('/');
      }
    };

    redirectToProfile();
  }, [code, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="text-sm text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  );
};

export default CodeRedirect;