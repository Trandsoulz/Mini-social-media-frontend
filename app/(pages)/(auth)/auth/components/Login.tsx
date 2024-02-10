"use client";

import { LoginProps } from "@/app/types/registerProps";
import axios from "axios";
import { setCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "sonner";

const Login = () => {
  const router = useRouter();
  const [password, setPassword] = useState<boolean>(true);
  const [formData, setFormData] = useState<LoginProps>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    // Set Loading state
    setLoading(true);

    e.preventDefault();
    // console.log(formData);

    if (formData.password.length < 8) {
      toast.error("Password is less than 8 char");
    }

    try {
      // Make a post request to the server

      const URL = `${process.env.NEXT_PUBLIC_API_URL}/auth/login`;

      const logUser = async (payload: LoginProps) => {
        const res = await axios.post(URL, payload);

        return res;
      };
      const res = await logUser(formData);

      // Get bearer token from req.headers and set it to cookies
      const token = res?.headers?.authorization?.split(" ")[1];
      setCookie("x-auth-token", `${token}`);

      // Replace router
      router.refresh();
      router.replace("/");

      // Set Loading state
      setLoading(false);
      toast.success(`You've successfully logged in`);
      console.log(res);
    } catch (error: any) {
      // Set Loading state
      setLoading(false);
      // console.log();
      const errMessage = error?.response?.data?.message;
      // console.log(error);
      if (error?.code === "ERR_NETWORK") {
        toast.error("An error occured");
      } else {
        toast.error(errMessage);
      }
    }
  };

  return (
    // <h1>This is the login form</h1>

    <form action="" onSubmit={handleSubmit}>
      <section >
        <label htmlFor="email">Email</label>
        <input
          type="email"
          required
          name="email"
          className="border p-3 h-12 bg-[#ecebf382] rounded-md text-sm md:text-base block outline-none"
          onChange={handleInput}
        />
      </section>
      <section >
        <label htmlFor="password">Password</label>
        <div className="flex">
          <input
            type={password ? "password" : "text"}
            required
            name="password"
            className="border p-3 h-12 bg-[#ecebf382] rounded-md text-sm md:text-base block outline-none"
            onChange={handleInput}
          />
          <p
            className="relative right-11 top-3 cursor-pointer text-sm"
            onClick={() => setPassword(!password)}
          >
            {" "}
            {password ? "Show" : "Hide"}{" "}
          </p>
        </div>

        <Link
          href={"/forgotpassword"}
          className="text-slate-400 pt-2 pl-[4.25rem] md:pl-[5.75rem] "
        >
          {" "}
          forgot password
        </Link>
      </section>

      <button
        className=" py-2 text-center px-6 bg-blue-500 text-white my-4 text-base sm:text-lg rounded-md disabled:opacity-75"
        disabled={loading ? true : false}
      >
        {loading ? "Loading... " : "Submit"}
      </button>
    </form>
  );
};

export default Login;
