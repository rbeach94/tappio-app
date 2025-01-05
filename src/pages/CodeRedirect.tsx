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
        // First, get the NFC code details
        const { data: nfcCode, error: nfcError } = await supabase
          .from('nfc_codes')
          .select('id, assigned_to, url')
          .eq('code', code)
          .single();

        console.log('NFC code data:', nfcCode, 'Error:', nfcError);

        // If the code doesn't exist in the database
        if (nfcError?.code === 'PGRST116') {
          console.log('Code not found, redirecting to activate page');
          navigate(`/activate/${code}`);
          return;
        }

        // For any other database errors
        if (nfcError) {
          console.error('Database error:', nfcError);
          navigate('/');
          return;
        }

        // If the code exists but is not assigned
        if (!nfcCode?.assigned_to) {
          console.log('Code not assigned, redirecting to activate page');
          navigate(`/activate/${code}`);
          return;
        }

        // If we have a URL, use it directly
        if (nfcCode.url) {
          console.log('Using pre-generated URL:', nfcCode.url);
          window.location.href = nfcCode.url;
          return;
        }

        // Fallback: Get the profile ID and construct the URL
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
        console.log('Redirecting to profile:', profile.id);
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