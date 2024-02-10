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
  }, [token]);

  return (
    <>
      <Navbar />
      <main className="flex justify-center">
        <section>
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
                      className="w-fit my-7 px-4 rounded-lg border-4 "
                    >
                      <Image
                        src={images[0]}
                        priority
                        alt={`${description}`}
                        height={200}
                        width={250}
                        className="py-5 "
                      />
                      <h1 className="border-4 mb-4 rounded w-[250px] py-2 text-center">
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
