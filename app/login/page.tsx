"use client";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "../lib/supabase/browser-client";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { toast, Toaster } from "sonner";
import { useParams } from "next/navigation";

const Login = () => {
  const params = useParams();
  const nextUrl = params.next;

  const supabase = createSupabaseBrowserClient();

  const handleLogin = async (provider: "google" | "github") => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${
          nextUrl || ""
        }`,
      },
    });
    toast.success(`User  logged in with ${provider}`, {
      style: {},
      duration: 3000,
      position: "top-center",
    });
  };

  return (
    <div className="flex justify-center h-screen w-full bg-[#f8f8f8] lg:p-24 sm:p-12 ">
      <div className="flex mx-auto sm:justify-center flex-col gap-4 w-[500px] bg-white h-fit p-12 rounded-lg">
        <h1 className="text-center text-3xl text-green-500">
          Sign in to your account
        </h1>
        <Button
          className="bg-white hover:bg-gray-100 text-black border-2 border-gray-200"
          onClick={() => handleLogin("google")}
        >
          <FcGoogle /> Login with Google
        </Button>
        <Button
          className="bg-white hover:bg-gray-100 text-black border-2 border-gray-200"
          onClick={() => handleLogin("github")}
        >
          <FaGithub /> Login with GitHub
        </Button>
      </div>
      <Toaster />
    </div>
  );
};

export default Login;
