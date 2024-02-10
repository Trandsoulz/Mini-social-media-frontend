"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "sonner";

const ForgotPassword = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    // console.log("Handling the input");

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();

    try {
      const URL = `${process.env.NEXT_PUBLIC_API_URL}/auth/forgotpassword`;
      const payload = {
        ...formData,
      };
      const postData = async () => {
        const res = await axios.post(URL, payload);
        return res;
      };

      const { data: res } = await postData();
      console.log(res);
      toast.success(res.message);
      router.push("/resetpassword");

      setLoading(false);
      // toast.success();
    } catch (err) {
      setLoading(false);
      console.error(err);
      toast.error("An error occured. Try again, later");
    }

    // console.log(formData);
  };

  return (
    <>
      <h1 className="font-semibold text-lg p-8">You forgot your password</h1>
      <h1 className="py-1 px-8">
        You Lack retentive memory 👊🏽. But, that's a problem for another day
      </h1>
      <h1 className="py-1 px-8">Pls input your email.</h1>

      <form
        action=""
        onSubmit={submitHandler}
        className="flex h-[50vh] justify-center items-center"
      >
        <section>
          <label htmlFor="email"> Email</label>
          <input
            type="email"
            disabled={loading ? true : false}
            required
            placeholder="Input your email"
            name="email"
            className="border p-3 h-12 w-[270px] bg-[#ecebf382] rounded-md text-sm md:text-base block outline-none"
            onChange={handleInput}
          />

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

export default ForgotPassword;
