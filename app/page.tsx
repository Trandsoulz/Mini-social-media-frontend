"use client";

import Link from "next/link";
import Navbar from "./components/Navbar";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import Image from "next/image";

const Home = () => {
  const token = getCookie("x-auth-token");

  const [userPost, setUserPost] = useState<any>([]);

  useEffect(() => {
    try {
      const URL = `${process.env.NEXT_PUBLIC_API_URL}/post/getallposts`;

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
        const { posts: data } = await getUserPosts();
        setUserPost(data);
        console.log(data);
      };

      fetchData();
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <>
      <Navbar />
      <main className=" mx-auto w-1/5">
        <section className="px-6 py-4">
          {userPost ? (
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
                    <section
                      key={_id}
                      className=" my-7 w-fit px-4 rounded-lg border-4 "
                    >
                      <Image
                        src={images[0]}
                        priority
                        alt={`${description}`}
                        height={200}
                        width={200}
                        className="py-5 "
                      />
                      <h1 className="border-4 mb-4 rounded w-[200px] py-2 text-center">
                        {" "}
                        {description}
                      </h1>
                    </section>
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
        </section>
      </main>
    </>
  );
};

export default Home;
