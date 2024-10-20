"use client";
import React, { useEffect, useState } from "react";
import { BiLike, BiRepost } from "react-icons/bi";
import { createSupabaseBrowserClient } from "../lib/supabase/browser-client";
import useSession from "../lib/supabase/use-session";
import { toast, Toaster } from "sonner";

interface IPost {
  id: number;
  created_by: string;
  title: string;
  content: string;
  like_count: number;
  repost_count: number;
  email: string;
}

const UserPost = () => {
  const user = useSession()?.user;

  const [getPosts, setGetPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const supabase = createSupabaseBrowserClient();

  const fetchPosts = async () => {
    const { data, error } = await supabase.from("posts").select("*");
    if (error) {
      console.error("Error fetching posts:", error.message);
      setLoading(false);
      return;
    }
    if (data) {
      setGetPosts(data);
    }
    setLoading(false);
  };

  const updateLikeCount = async (
    idNbr: number,
    value: number,
    email: string
  ) => {
    const newLikeCount = value + 1;

    if (email === user?.email) {
      const { error } = await supabase
        .from("posts")
        .update({ like_count: newLikeCount })
        .eq("id", idNbr)
        .eq("email", email)
        .select();
      if (error) {
        console.error("Error updating like_count:", error.message);
        return;
      }

      setGetPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === idNbr
            ? { ...post, like_count: post.like_count + 1 }
            : post
        )
      );
    } else {
      toast.error(` please loggedIn as ${email}`, {
        style: {},
        duration: 5000,
        position: "top-center",
      });
    }
  };

  const updateRepostCount = async (
    idNbr: number,
    value: number,
    email: string
  ) => {
    const newRepostCount = value + 1;

    if (email === user?.email) {
      const { error } = await supabase
        .from("posts")
        .update({ repost_count: newRepostCount })
        .eq("id", idNbr)
        .eq("email", email)
        .select();
      if (error) {
        console.error("Error updating repost_count:", error.message);
        return;
      }

      setGetPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === idNbr
            ? { ...post, repost_count: post.repost_count + 1 }
            : post
        )
      );
    } else {
      toast.error(` please loggedIn as ${email}`, {
        style: {},
        duration: 5000,
        position: "top-center",
      });
    }
  };

  useEffect(() => {
    fetchPosts();

    const channel = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "posts" },
        (payload) => {
          console.log("Change received!", payload);
          fetchPosts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return <div className="text-center">Loading posts...</div>;
  }

  return (
    <>
      <h1 className="text-center text-2xl ">User Post List</h1>
      <div className="flex flex-col-reverse mx-40">
        {getPosts.map((list) => (
          <div
            className="bg-[#ffffff] border-2 border-gray-200 rounded-lg gap-6 flex flex-col my-2 p-6 w-full"
            key={list.id}
          >
            <div className="flex flex-col">
              <h1 className="truncate text-xl capitalize">{list.title}</h1>
              <p className="italic text-[12px] text-gray-700">
                created by {list.email}
              </p>
              <p
                className="flex-grow overflow-hidden mt-6 text-justify text-gray-700"
                dangerouslySetInnerHTML={{ __html: list.content }}
              />
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <div className="flex items-center gap-2 cursor-pointer">
                <BiLike
                  onClick={() =>
                    updateLikeCount(list.id, list.like_count, list.email)
                  }
                  className="text-xl hover:scale-105 transition ease-in-out hover:text-red-500"
                />
                {list.like_count}
              </div>
              <div className="flex items-center gap-2 cursor-pointer">
                <BiRepost
                  onClick={() =>
                    updateRepostCount(list.id, list.repost_count, list.email)
                  }
                  className="text-2xl hover:scale-105 transition ease-in-out hover:text-sky-500"
                />
                {list.repost_count}
              </div>
            </div>
          </div>
        ))}
      </div>
      <Toaster />
    </>
  );
};

export default UserPost;
