import { useEffect, useState } from "react";
import { Form, Input, Button, Select, DatePicker, Spin } from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import { LoadingOutlined } from "@ant-design/icons";
import { BACKEND_URL } from "../../utils/backend";
import dayjs from "dayjs";
// import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";

const VehicleForm = ({ parkingLotId }: any) => {
  const [vehicleCategories, setVehicleCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  // const navigate = useNavigate();

  // Fetch Vehicle Categories
  const fetchVehicles = async () => {
    try {
      console.log(BACKEND_URL)
      const response = await axios.get(
        `${BACKEND_URL}/api/admin/category/get-all`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      setVehicleCategories(response.data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      toast.error("Failed to fetch vehicle categories");
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  
  const handleSubmit = async (values: any) => {
    setLoading(true);
    const formData = { ...values, parkingLotId };
    console.log(formData);
  
    try {
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY); // Your publishable key
  
      const response = await axios.post(
        `${BACKEND_URL}/api/stripe/create-checkout-session`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
  
      const session = response.data;
      await stripe?.redirectToCheckout({ sessionId: session.id });
    } catch (error) {
      console.error("Error during payment session creation:", error);
      toast.error("Failed to initiate payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  // Validation rules
  const validateFutureDate = (_: any, value: any) => {
    if (value && value.isBefore(dayjs())) {
      return Promise.reject(new Error("In time must be a future date."));
    }
    return Promise.resolve();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100 dark:bg-black transition-colors duration-300">
      <div className="w-full max-w-md p-8 bg-white dark:bg-zinc-800 shadow-xl rounded-2xl">
        <h2 className="text-2xl font-bold mb-6 text-zinc-800 dark:text-white">
          Vehicle Entry Form
        </h2>
        <Form
          onFinish={handleSubmit}
          layout="vertical"
          initialValues={{
            vehicleCategory: "",
            vehicleCompanyName: "",
            registrationNumber: "",
            inTime: "",
          }}
          form={form}
        >
          <Form.Item
            label="Vehicle Category"
            name="vehicleCategory"
            rules={[
              { required: true, message: "Please select a vehicle category" },
            ]}
          >
            <Select
              placeholder="Select a category"
              className="w-full"
              options={vehicleCategories.map((category) => ({
                value: category.id,
                label: category.vehicleCat,
              }))}
            />
          </Form.Item>

          <Form.Item
            label="Vehicle Company Name"
            name="vehicleCompanyName"
            rules={[
              {
                required: true,
                message: "Please enter the vehicle company name",
              },
            ]}
          >
            <Input placeholder="Enter vehicle company name" />
          </Form.Item>

          <Form.Item
            label="Registration Number"
            name="registrationNumber"
            rules={[
              {
                required: true,
                message: "Please enter the registration number",
              },
            ]}
          >
            <Input placeholder="Enter registration number" />
          </Form.Item>

          <Form.Item
            label="In Time"
            name="inTime"
            rules={[
              { required: true, message: "Please select a valid time" },
              { validator: validateFutureDate },
            ]}
          >
            <DatePicker
              showTime
              style={{ width: "100%" }}
              placeholder="Select in time"
              format="YYYY-MM-DD HH:mm:ss"
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              }
              disabledTime={(current) => {
                const now = dayjs();
                if (current && current.isSame(now, "day")) {
                  return {
                    disabledHours: () => {
                      const hours = [];
                      for (let i = 0; i < now.hour(); i++) {
                        hours.push(i);
                      }
                      return hours;
                    },
                    disabledMinutes: (selectedHour) => {
                      if (selectedHour === now.hour()) {
                        const minutes = [];
                        for (let i = 0; i < now.minute(); i++) {
                          minutes.push(i);
                        }
                        return minutes;
                      }
                      return [];
                    },
                    disabledSeconds: (selectedHour, selectedMinute) => {
                      if (
                        selectedHour === now.hour() &&
                        selectedMinute === now.minute()
                      ) {
                        const seconds = [];
                        for (let i = 0; i < now.second(); i++) {
                          seconds.push(i);
                        }
                        return seconds;
                      }
                      return [];
                    },
                  };
                }
                return {};
              }}
            />
          </Form.Item>

          {loading ? (
            <div className="flex items-center justify-center mt-4">
              <Spin indicator={<LoadingOutlined spin />} tip="Booking..." />
            </div>
          ) : (
            <Button type="primary" htmlType="submit" block className="mt-4">
              Submit
            </Button>
          )}
        </Form>
      </div>
    </div>
  );
};

export default VehicleForm;
