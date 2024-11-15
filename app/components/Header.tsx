"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "../lib/supabase/browser-client";
import useSession from "../lib/supabase/use-session";
import { toast, Toaster } from "sonner";

const Header = () => {
  const supabase = createSupabaseBrowserClient();
  const user = useSession()?.user;
  const router = useRouter();
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
    toast.success("User logOut", {
      style: {},
      duration: 3000,
      position: "top-center",
    });
  };
  return (
    <div className=" bg-[#292727fb] items-center py-2 border-b-2 border-b-slate-600 ">
      {user ? (
        <div className=" flex items-center mx-56 py-2 flex-col">
          <h1 className=" text-xl text-white ">
            Welcome
            <span className=" text-green-500 px-2">
              {user?.user_metadata?.full_name}
            </span>
          </h1>
          <p className=" text-green-500 px-2 text-lg">{user?.email}</p>
          <Button
            onClick={handleLogout}
            className=" bg-green-500 hover:bg-green-600"
          >
            logOut
          </Button>
        </div>
      ) : (
        <div className="  justify-center  flex py-4">loading User...</div>
      )}
      <Toaster />
    </div>
  );
};

export default Header;
