"use client";

import { RegisterProps } from "@/app/types/registerProps";
import axios from "axios";
import { setCookie } from "cookies-next";
import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { tree } from "next/dist/build/templates/app-page";

const Signup = () => {
  const router = useRouter();

  const [password, setPassword] = useState<boolean>(true);
  const [confirm_password, setConfirm_Password] = useState<boolean>(true);
  const [loading, setLoading] = useState<Boolean>(false);
  const [registerDetails, setRegisterDetails] = useState<RegisterProps>({
    full_name: "",
    email: "",
    phone_number: null,
    password: "",
    confirm_password: "",
  });

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    // Get the user input from the onchange input tag, and set it to the state variable.
    setRegisterDetails({
      ...registerDetails,
      [e.target.name]: e.target.value,
    });
  };

  const SubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Set Loading state
    setLoading(true);

    // Turn phone_number to number

    console.log(typeof registerDetails.phone_number);

    // User validation. Check if the passwords are more than 8 chars long, and if they're thesame

    if (
      registerDetails.password.length < 8 ||
      (registerDetails.confirm_password?.length &&
        registerDetails.confirm_password.length < 8)
    ) {
      setLoading(false);
      toast.error("Passwords must be above 8 chars long");
    } else if (registerDetails.password !== registerDetails.confirm_password) {
      setLoading(false);
      toast.error("Password mismatch");
    } else {
      // Delete the confirm password field, cos it's no longer needed. Turn phone_number to number
      delete registerDetails["confirm_password"];

      // console.log(registerDetails);

      // Create the post request
      try {
        const URL = `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`;

        const postData = async (payload: RegisterProps) => {
          const res = await axios.post(URL, payload);
          return res;
        };

        const res = await postData(registerDetails);

        // Get token from the authorization headers and set to cookies
        const token = res.headers.authorization.split(" ")[1];
        setCookie("x-auth-token", `${token}`);
        // Replace router
        router.refresh();
        router.replace("/dashboard");

        // cookies().set('token', res.data.token, { secure: true })
        console.log(res);

        setLoading(false);
        toast.success(`You've successfully signed up`);
      } catch (error) {
        const { err }: any = error;
        console.log(registerDetails);
        console.log(err?.data?.message);
        setLoading(false);
        toast.error(
          `There was an error trying to sign you up. ${err?.data?.message} `
        );
      }
    }
  };

  return (
    <>
      {/* <h1>This is the signup page</h1> */}
      <form action="" onSubmit={SubmitHandler}>
        <section className="w-1/2 ">
          <label htmlFor="full_name">Full Name</label>
          <input
            type="text"
            required
            name="full_name"
            className="border p-3 h-12 bg-[#ecebf382] rounded-md text-sm md:text-base block outline-none"
            onChange={handleInput}
          />
        </section>

        <section className="w-1/2 ">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            required
            name="email"
            className="border p-3 h-12 bg-[#ecebf382] rounded-md text-sm md:text-base block outline-none"
            onChange={handleInput}
          />
        </section>

        <section className=" w-1/2 ">
          <label htmlFor="phone_number">Phone Number</label>
          <input
            type="text"
            required
            name="phone_number"
            className="border p-3 h-12 bg-[#ecebf382] rounded-md text-sm md:text-base block outline-none"
            onChange={handleInput}
          />
        </section>

        <section className="w-1/2 ">
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
              className="relative right-11 top-3 cursor-pointer text-sm "
              onClick={() => setPassword(!password)}
            >
              {" "}
              {password ? "Show" : "Hide"}{" "}
            </p>
          </div>
        </section>

        <section className="w-1/2">
          <label htmlFor="confirm_password">Confirm Password</label>
          <div className="flex">
            <input
              type={confirm_password ? "password" : "text"}
              required
              name="confirm_password"
              className="border p-3 h-12 bg-[#ecebf382] rounded-md text-sm md:text-base block outline-none"
              onChange={handleInput}
            />
            <p
              className="relative right-11 top-3 cursor-pointer text-sm"
              onClick={() => setConfirm_Password(!confirm_password)}
            >
              {" "}
              {confirm_password ? "Show" : "Hide"}{" "}
            </p>
          </div>
        </section>

        <button
          className=" py-2 text-center px-6 bg-blue-500 text-white my-4 text-base sm:text-lg rounded-md disabled:opacity-75"
          disabled={loading ? true : false}
        >
          {loading ? "Loading..." : "Submit"}
        </button>
      </form>
    </>
  );
};

export default Signup;
