import { BACKEND_URL } from "@/utils/backend";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const GoogleButton = () => {
  const navigate = useNavigate();
  const responseMessage = async (response: any) => {
    const token = response.credential;
    try {
      const res = await axios.post(`${BACKEND_URL}/api/user/googleAuth`, {
        token,
      });
      console.log(res.data);
      if (res.status === 200) {
        Cookies.set("token", res.data.token, { expires: 7 });
        toast.success("Login successful!");
        navigate("/dashboard");
      } else if (res.status === 201) {
        Cookies.set("token", res.data.token, { expires: 7 });
        toast.success("SignUp successful!");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error during Google login:", error);
    }
  };
  const errorMessage = () => {
    console.log("An error occurred during Google login.");
  };
  return (
    <div>
      <GoogleLogin
        onSuccess={responseMessage}
        onError={errorMessage}
        useOneTap={false}
      />
    </div>
  );
};

export default GoogleButton;
