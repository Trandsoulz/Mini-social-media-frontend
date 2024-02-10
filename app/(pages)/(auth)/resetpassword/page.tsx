"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, ChangeEvent, FormEvent } from "react";
import { toast } from "sonner";

// const submitHandler = async (formData) => {
//   "use server";
//   console.log(formData);

//   console.log("Hello World");
// };

const ResetPassword = () => {
  const router = useRouter();

  const [password, setPassword] = useState<boolean>(true);
  const [confirm_password, setConfirm_Password] = useState<boolean>(true);
  const [formData, setFormData] = useState<any>({
    token: "",
    password: "",
    confirm_password: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Set Loading state
    setLoading(true);

    // User validation. Check if the passwords are more than 8 chars long, and if they're thesame
    if (
      formData.password.length < 8 ||
      (formData.confirm_password?.length &&
        formData.confirm_password.length < 8)
    ) {
      setLoading(false);
      toast.error("Passwords must be above 8 chars long");
    } else if (formData.password !== formData.confirm_password) {
      setLoading(false);
      toast.error("Password mismatch");
    } else {
      // Delete the confirm password field, cos it's no longer needed. Turn phone_number to number
      delete formData["confirm_password"];
    }

    try {
      const URL = `${process.env.NEXT_PUBLIC_API_URL}/auth/resetpassword`;

      const postData = async () => {
        const payload = formData;

        const { data: res } = await axios.patch(URL, payload);
        return res;
      };

      const { message: res } = await postData();
      toast.success(res);
      router.replace("/auth");
    } catch (err) {
      console.log(err);
      setLoading(false);
    }

    // console.log(formData);
    setLoading(false);
  };

  return (
    <>
      <h1 className="p-8">This is the reset password page</h1>

      <form
        // action={}
        onSubmit={submitHandler}
        className="flex h-[50vh] justify-center items-center"
      >
        <section>
          <label htmlFor="token"> Token</label>
          <input
            type="text"
            disabled={loading ? true : false}
            required
            placeholder="Input your token"
            name="token"
            className="border p-3 h-12 w-[270px] bg-[#ecebf382] rounded-md text-sm md:text-base block outline-none"
            onChange={handleInput}
          />

          <label htmlFor="password"> Password</label>
          <div className="flex">
            <input
              type={password ? "password" : "text"}
              disabled={loading ? true : false}
              required
              name="password"
              className="border p-3 h-12 w-[270px] bg-[#ecebf382] rounded-md text-sm md:text-base block outline-none"
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

          <label htmlFor="confirm_password">Confirm Password</label>
          <div className="flex">
            <input
              type={confirm_password ? "password" : "text"}
              required
              name="confirm_password"
              className="border p-3 h-12 w-[270px] bg-[#ecebf382] rounded-md text-sm md:text-base block outline-none"
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

          <button
            className=" py-2 text-center px-6 bg-blue-500 text-white my-4 text-base sm:text-lg rounded-md disabled:opacity-75"
            disabled={loading ? true : false}
          >
            {loading ? "Loading... " : "Submit"}
          </button>
        </section>
      </form>
    </>
  );
};

export default ResetPassword;
