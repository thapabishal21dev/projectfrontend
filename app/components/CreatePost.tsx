"use client";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import { createSupabaseBrowserClient } from "../lib/supabase/browser-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import "react-quill/dist/quill.snow.css";
import useSession from "../lib/supabase/use-session";
import { toast, Toaster } from "sonner";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
interface IPost {
  title: string;
  content: string | null;
  email?: string;
}

const CreatePost = () => {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [addPost, setAddPost] = useState<IPost>({
    title: "",
    content: null,
  });
  const user = useSession()?.user;
  const userEmail = user?.email;
  const supabase = createSupabaseBrowserClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error: insertError } = await supabase.from("posts").insert({
      title: addPost.title,
      content: addPost.content,
      like_count: 0,
      repost_count: 0,
      email: userEmail,
    });

    if (insertError) {
      toast.error("error creating post", {
        style: {},
        duration: 3000,
        position: "top-center",
      });
      setLoading(false);
      return;
    }
    setLoading(false);
    toast.success("post created success", {
      style: {},
      duration: 3000,
      position: "top-center",
    });
    setAddPost({ title: "", content: null });
    setValue("");
  };

  return (
    <div className=" mx-56 ">
      <form onSubmit={handleSubmit}>
        <div className="bg-white w-full rounded px-6 mt-6 py-6 border-2 border-gray-200">
          <div>
            <h1 className="text-2xl text-center">Create a new Post</h1>
          </div>

          <div>
            <Label className="text-lg" htmlFor="title">
              Title
            </Label>
            <Input
              required
              value={addPost.title}
              onChange={(e) =>
                setAddPost((prevPost) => ({
                  ...prevPost,
                  title: e.target.value,
                }))
              }
              className="my-2 text-lg "
              type="text"
              placeholder="Enter Title"
            />
          </div>

          <div>
            <Label className="text-lg" htmlFor="content">
              Content
            </Label>
            <ReactQuill
              className="my-2 h-[100px] "
              theme="snow"
              value={value}
              onChange={(content) => {
                setValue(content);
                setAddPost((prevPost) => ({
                  ...prevPost,
                  content: content,
                }));
              }}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 mt-12"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Post"}
          </Button>
        </div>
      </form>
      <Toaster />
    </div>
  );
};

export default CreatePost;
