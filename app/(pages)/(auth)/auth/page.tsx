import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Signup from "./components/Signup";
import Login from "./components/Login";

const Auth = () => {
  return (
    <>
      <section className="px-6 py-4">
        <h1 className="my-8 text-xl font-semibold">
          This is the Authentication page
        </h1>

        <Tabs defaultValue="login" className="md:w-[50%]">
          <TabsList className="w-1/2">
            <TabsTrigger value="login">Log In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Login />
          </TabsContent>
          <TabsContent value="signup">
            <Signup />
          </TabsContent>
        </Tabs>
      </section>
    </>
  );
};

export default Auth;
