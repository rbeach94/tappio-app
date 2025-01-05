import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const CodeRedirect = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const redirectToProfile = async () => {
      console.log('Starting redirect process for code:', code);
      
      if (!code) {
        console.error('No code provided');
        navigate('/');
        return;
      }

      try {
        // First, get the NFC code details
        console.log('Fetching NFC code details for:', code);
        const { data: nfcCode, error: nfcError } = await supabase
          .from('nfc_codes')
          .select('*')
          .eq('code', code)
          .maybeSingle();

        console.log('NFC code query result:', { nfcCode, nfcError });

        // If there was a database error
        if (nfcError) {
          console.error('Database error:', nfcError);
          navigate('/');
          return;
        }

        // If the code doesn't exist in the database
        if (!nfcCode) {
          console.log('Code not found, redirecting to activate page');
          navigate(`/activate/${code}`);
          return;
        }

        // If the code exists but is not assigned or not active
        if (!nfcCode.assigned_to || !nfcCode.is_active) {
          console.log('Code not assigned or inactive:', { 
            assigned_to: nfcCode.assigned_to, 
            is_active: nfcCode.is_active 
          });
          navigate(`/activate/${code}`);
          return;
        }

        // If we have a URL, use it directly
        if (nfcCode.url) {
          console.log('Using pre-generated URL:', nfcCode.url);
          window.location.href = nfcCode.url;
          return;
        }

        // Get or create profile
        console.log('Fetching profile for code_id:', nfcCode.id);
        let { data: profiles, error: profileError } = await supabase
          .from('nfc_profiles')
          .select('*')
          .eq('code_id', nfcCode.id);

        console.log('Profile query result:', { profiles, profileError });

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          navigate('/');
          return;
        }

        // If no profile exists but code is assigned, create one
        if ((!profiles || profiles.length === 0) && nfcCode.assigned_to) {
          console.log('Creating profile for assigned code:', nfcCode.id);
          const { data: newProfile, error: createError } = await supabase
            .from('nfc_profiles')
            .insert({
              user_id: nfcCode.assigned_to,
              code_id: nfcCode.id
            })
            .select()
            .single();

          if (createError) {
            console.error('Error creating profile:', createError);
            navigate('/');
            return;
          }

          profiles = [newProfile];
        }

        // Get the most recently created profile
        const profile = profiles && profiles.length > 0 
          ? profiles[0] 
          : null;

        if (!profile) {
          console.log('No profile found or created for assigned code:', {
            code_id: nfcCode.id,
            assigned_to: nfcCode.assigned_to
          });
          navigate(`/activate/${code}`);
          return;
        }

        // Redirect to the profile view page
        console.log('Redirecting to profile:', profile.id);
        navigate(`/profile/${profile.id}/view`);
      } catch (error) {
        console.error('Unexpected error during redirect:', error);
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