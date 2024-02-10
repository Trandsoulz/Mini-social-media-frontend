"use client";

import Navbar from "@/app/components/Navbar";
import { isLoggedIn } from "@/isLoggedIn";
import axios from "axios";
import { getCookie } from "cookies-next";
import Image from "next/image";
import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const token = getCookie("x-auth-token");

  const router = useRouter();
  const [userPost, setUserPost] = useState<any>([]);

  useEffect(() => {
    try {
      const URL = `${process.env.NEXT_PUBLIC_API_URL}/post/getuserposts`;

      const getUserPosts = async () => {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const { data: res } = await axios.get(URL, config);

        // console.log(res);
        return res;
      };

      const fetchData = async () => {
        const { userPosts: data } = await getUserPosts();
        setUserPost(data);
        console.log(data);
      };

      fetchData();
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  const handleDelete = async (id: any) => {
    console.log(id);

    const URL = `${process.env.NEXT_PUBLIC_API_URL}/post/deletepost/${id}`;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const deletePost = async () => {
      await axios.delete(URL, config);
    };

    try {
      deletePost();

      toast.success("Deleted successfully");

      setTimeout(() => {
        toast.message("Please reload for changes to take effect");
      }, 1500);
    } catch (err) {
      console.error("An error occured while trying to delete");
      toast.error(" An error occured");
    }
  };
  return (
    <>
      <Navbar />
      <main className="p-9 mx-auto w-fit">
        <h1 className="text-lg text-center font-semibold">
          Your uploads will reflect here
        </h1>

        {/* <h1>It is meant to be protected</h1> */}

        {/* <h1>If you can see it, it means you're authorised</h1> */}

        {}

        {!userPost ? (
          <>
            {" "}
            <h1>This user does not have any post </h1>
          </>
        ) : userPost ? (
          <>
            {userPost.map(
              ({
                _id,
                description,
                images,
              }: {
                _id: number;
                description: string;
                images: string;
              }) => (
                <>
                  <Dialog>
                    <DialogTrigger className="block" key={_id}>
                      <section className=" my-7 w-fit px-4 rounded-lg border-4 ">
                        <Image
                          src={images[0]}
                          priority
                          alt={`${description}`}
                          height={270}
                          width={280}
                          className="py-5"
                        />
                        <h1 className="border-4 mb-4 rounded w-[280px] py-2 text-center">
                          {" "}
                          {description}
                        </h1>
                      </section>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-[425px]">
                      <DialogDescription>
                        Are you sure you want to delete it?
                      </DialogDescription>
                      <DialogFooter className="flex ">
                        <DialogClose asChild>
                          <button
                            onClick={() => handleDelete(_id)}
                            className="px-2 py-1 bg-slate-800 text-white rounded-md"
                          >
                            Yes
                          </button>
                        </DialogClose>
                        <DialogClose asChild>
                          <button>No</button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </>
              )
            )}
          </>
        ) : (
          <>
            <section className="h-[250px] flex justify-center items-center">
              <h1 className="">Loading...</h1>
            </section>
          </>
        )}
      </main>
    </>
  );
};

export default Dashboard;
