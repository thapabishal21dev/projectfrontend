import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "../lib/supabase/browser-client";

const Callback = () => {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const { data, error } = await supabase.auth.exchangeCodeForSession(
        window.location.href
      );

      if (error) {
        console.error("Error exchanging code for session:", error.message);
        return;
      }

      if (data.session) {
        router.push("/");
      }
    };

    handleOAuthCallback();
  }, [router]);

  return "redirecting";
};

export default Callback;
