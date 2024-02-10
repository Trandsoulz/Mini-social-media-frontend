"use client";

import Navbar from "@/app/components/Navbar";
import axios from "axios";
import Image from "next/image";
import { SyntheticEvent, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { GoXCircleFill } from "react-icons/go";
import { getCookie } from "cookies-next";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const Upload = () => {
  const router = useRouter();
  const [files, setFiles] = useState<any>([]);
  const [loading, setLaoding] = useState<boolean>(false);
  const imageUrls: string[] = [];
  const [formData, setFormData] = useState<any>({});
  const onDrop = useCallback((acceptedFiles: (Blob | MediaSource)[]) => {
    // Get the accepted files, and save it state

    if (acceptedFiles?.length) {
      setFiles((files: any[]) => [
        ...files,
        ...acceptedFiles.map((file: Blob | MediaSource) =>
          Object.assign(file, { preview: URL.createObjectURL(file) })
        ),
      ]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 5,
    accept: {
      "image/*": [],
    },
  });

  const removeFile = (name: string) => {
    // console.log(key);

    setFiles((files: File[]) =>
      files.filter((file: { name: string }) => file.name !== name)
    );
  };

  const handleOnChange = (e: {
    target: {
      value: any;
      name: any;
    };
  }) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitData = async () => {
    const token = getCookie("x-auth-token");
    const payload = {
      ...formData,
      images: imageUrls,
    };

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const URL = `${process.env.NEXT_PUBLIC_API_URL}/post/createpost`;

    const res = axios.post(URL, payload, config);

    return res;
  };

  const submitHandler = async (e: SyntheticEvent) => {
    e.preventDefault();
    setLaoding(true);
    // console.log("Submitted");

    // Loop through each files in the files array, and perform this function

    for (const dataItem of files) {
      const ImgData = new FormData();
      // files.forEach((file: any) => ImgData.append("file", file));
      ImgData.append("file", dataItem);
      ImgData.append(
        "upload_preset",
        `${process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_NAME}`
      );
      const URL = `${process.env.NEXT_PUBLIC_CLOUDINARY_URL}`;

      // console.log(ImgData);
      try {
        const { data: image } = await axios.post(URL, ImgData);
        imageUrls.push(image?.secure_url);
        // console.log(image?.secure_url);
      } catch (err) {
        console.log(err);
        setLaoding(false);
        toast.error("An error occured");
      }
    }

    const { data: res } = await submitData();
    // console.log(res);
    // console.log(formData);
    // console.log(imageUrls);
    toast.success("Post successfuly created");
    setTimeout(() => {
      router.replace("/dashboard");
    }, 1000);
    setLaoding(false);
  };

  return (
    <>
      <Navbar />
      <section className="px-6 py-4">
        <h1>This the Upload page</h1>

        <form onSubmit={submitHandler} method="">
          <div className="mt-3">
            <label>
              Description: <br />
              <textarea
                required
                onChange={handleOnChange}
                disabled={loading ? true : false}
                rows={2}
                cols={32}
                name="description"
                className="p-2 px-3 border-slate-500 rounded-sm border-2 focus:border-slate-400 focus:outline-none"
                placeholder="Please type in your description"
              />
            </label>
          </div>
          {/* <div className="mt-3">
            <label>
              Age:
              <input
                type="text"
                name="age"
                className="ml-[3.1rem] border-slate-500 rounded-sm placeholder:p-4 border-2 focus:border-slate-400 focus:outline-none"
                placeholder="Input age"
              />
            </label>
          </div> */}
          <div className="mt-3" {...getRootProps()}>
            <label>
              Images: <br />
              <input
                {...getInputProps()}
                name="images"
                required
                disabled={loading ? true : false}
              />
              {isDragActive ? (
                <p className="p-9 border-2 rounded-md border-dashed border-slate-500 inline-block">
                  Drop the photo files here ...
                </p>
              ) : (
                <p className="p-9 border-2 rounded-md border-dashed border-slate-500 inline-block">
                  Drag &apos;n&apos; drop some photo files here, or click to select files
                </p>
              )}
              {/* <ul>{acceptedFileItems}</ul> */}
            </label>
          </div>
          {/* Preview */}
          <ul
            className={` ${
              files.length !== 0 ? "border-2 p-2 mt-3 " : ""
            } inline-block`}
          >
            {files?.map((file: any) => (
              <li key={file.name} className="w-40 inline-block p-2">
                <div>
                  <GoXCircleFill
                    className="scale-150 relative right-1 top-2 cursor-pointer text-red-700 bg-white rounded-full"
                    onClick={() => removeFile(file.name)}
                  />
                </div>
                <Image
                  src={file.preview}
                  width={70}
                  height={70}
                  className="inline-block"
                  alt={`${file.name}`}
                  onLoad={() => {
                    URL.revokeObjectURL(file.preview);
                  }}
                />
                <div></div>
              </li>
            ))}
          </ul>
          <br />
          <button
            className="mt-3 px-4 py-2 rounded-sm disabled:bg-blue-400/50 text-white bg-blue-400"
            disabled={loading ? true : false}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </section>
    </>
  );
};

export default Upload;
