import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/backend";
import { Link as LinkR } from "react-router-dom";
import * as React from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Spin } from "antd";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";


// Shadcn components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import ForgotPassword from "../components/auth/ForgotPassword";
import GoogleButton from "@/components/auth/GoogleButton";

// Form validation schema
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long.",
  }),
  remember: z.boolean().default(false).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function SignIn() {
  const navigate = useNavigate();
  
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  React.useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setError("");
    setSuccess("");

    try {
      setLoading(true);
      const res = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        email: data.email,
        password: data.password,
      });

      setSuccess("Login successful!");
      Cookies.set("token", res.data.token, {
        expires: data.remember ? 7 : 1,
      });
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div className="flex min-h-screen flex-col justify-between bg-gradient-to-br from-white to-gray-100 p-4 dark:from-black dark:to-gray-900 sm:p-8">

      
      <motion.div
        className="mx-auto w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="border-none bg-white/95 backdrop-blur-sm dark:bg-gray-950/90 shadow-lg dark:shadow-gray-900/30">
          <CardHeader>
            <motion.div variants={itemVariants}>
              <CardTitle className="text-3xl font-bold text-center">
                Sign in
              </CardTitle>
            </motion.div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="your@email.com"
                            type="email"
                            autoComplete="email"
                            className="bg-transparent"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="••••••"
                            type="password"
                            autoComplete="current-password"
                            className="bg-transparent"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="flex items-center justify-between"
                >
                  <FormField
                    control={form.control}
                    name="remember"
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="remember"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <Label
                          htmlFor="remember"
                          className="text-sm text-gray-600 dark:text-gray-400"
                        >
                          Remember me
                        </Label>
                      </div>
                    )}
                  />
                  <button
                    type="button"
                    onClick={handleClickOpen}
                    className="text-sm text-primary underline-offset-4 hover:underline"
                  >
                    Forgot password?
                  </button>
                </motion.div>

                {error && (
                  <motion.p
                    variants={itemVariants}
                    className="text-center text-sm text-red-500"
                  >
                    {error}
                  </motion.p>
                )}
                {success && (
                  <motion.p
                    variants={itemVariants}
                    className="text-center text-sm text-green-500"
                  >
                    {success}
                  </motion.p>
                )}

                <motion.div variants={itemVariants}>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <Spin /> : "Sign In"}
                  </Button>
                </motion.div>
              </form>
            </Form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500 dark:bg-gray-950 dark:text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>

              <motion.div variants={itemVariants} className="mt-6">
                <GoogleButton />
              </motion.div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <motion.p
              variants={itemVariants}
              className="text-center text-sm text-gray-600 dark:text-gray-400"
            >
              Don&apos;t have an account?{" "}
              <LinkR
                to="/register"
                className="text-primary underline-offset-4 hover:underline"
              >
                Sign up
              </LinkR>
            </motion.p>
            <motion.p
              variants={itemVariants}
              className="text-center text-sm text-gray-600 dark:text-gray-400"
            >
              Back to{" "}
              <LinkR
                to="/"
                className="text-primary underline-offset-4 hover:underline"
              >
                Home
              </LinkR>
            </motion.p>
          </CardFooter>
        </Card>
      </motion.div>
      <div className="h-8" /> {/* Spacer */}
      <ForgotPassword open={open} handleClose={handleClose} />
    </div>
  );
}
