import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import { Select, Input, DatePicker, Button, Form } from "antd";
import { BACKEND_URL } from "../../utils/backend";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const VehicleForm = ({ parkingLotId }: any) => {
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [form] = Form.useForm();
  const token = Cookies.get("adminToken");
  const navigate = useNavigate();
  useEffect(() => {
    fetchUsers();
    fetchCategories();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `${BACKEND_URL}/api/admin/showRegisteredUsers`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(res.data);
    } catch (error) {
      toast.error("Failed to load users");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/admin/category/get-all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data);
    } catch (error) {
      toast.error("Failed to load categories");
    }
  };

  const handleSubmit = async (values: any) => {
    if (new Date(values.inTime) <= new Date()) {
      toast.error("In time should be greater than current time");
      return;
    }

    const payload = {
      parkingLotId,
      customerId: values.userId,
      vehicleCategoryId: values.vehicleCategoryId,
      vehicleCompanyName: values.vehicleCompanyName,
      registrationNumber: values.registrationNumber,
      inTime: values.inTime.toISOString(),
    };

    try {
      setSubmitting(true);
      await axios.post(`${BACKEND_URL}/api/admin/book`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Booking successful!");
      form.resetFields();
      navigate("/admin/vehicle");
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Booking failed!";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          Admin Vehicle Booking
        </h2>

        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
          initialValues={{}}
        >
          <Form.Item
            name="userId"
            label="Select User"
            rules={[{ required: true, message: "Please select a user" }]}
          >
            <Select
              showSearch
              placeholder="Select a user"
              optionFilterProp="children"
              filterOption={(input, option) =>
                String(option?.children)
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {users.map((user: any) => (
                <Option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName} ({user.email})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="vehicleCategoryId"
            label="Vehicle Category"
            rules={[
              { required: true, message: "Please select a vehicle category" },
            ]}
          >
            <Select placeholder="Select vehicle category">
              {categories.map((cat: any) => (
                <Option key={cat.id} value={cat.id}>
                  {cat.vehicleCat}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="vehicleCompanyName"
            label="Vehicle Company"
            rules={[
              { required: true, message: "Please enter vehicle company" },
            ]}
          >
            <Input placeholder="e.g., Hyundai" />
          </Form.Item>

          <Form.Item
            name="registrationNumber"
            label="Registration Number"
            rules={[
              { required: true, message: "Please enter registration number" },
            ]}
          >
            <Input placeholder="e.g., MH12AB1234" />
          </Form.Item>

          <Form.Item
            name="inTime"
            label="In Time"
            rules={[{ required: true, message: "Please select in time" }]}
          >
            <DatePicker
              showTime
              style={{ width: "100%" }}
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              }
              disabledTime={(current) => {
                const now = dayjs();
                if (current && current.isSame(dayjs(), "day")) {
                  return {
                    disabledHours: () =>
                      Array.from({ length: 24 }, (_, i) =>
                        i < now.hour() ? i : -1
                      ).filter((i) => i !== -1),
                    disabledMinutes: (selectedHour) =>
                      selectedHour === now.hour()
                        ? Array.from({ length: 60 }, (_, i) =>
                            i <= now.minute() ? i : -1
                          ).filter((i) => i !== -1)
                        : [],
                  };
                }
                return {};
              }}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={submitting}>
              Book Vehicle
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default VehicleForm;
