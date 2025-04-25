import { useEffect, useState } from "react";
import axios from "axios";
import { Form, Input, Button, Skeleton, Avatar, Popover } from "antd";
import { EditOutlined, SaveOutlined, CameraOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { BACKEND_URL } from "@/utils/backend";

const Profile = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [user, setUser] = useState<any>(null);
  const token = Cookies.get("token");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const {
          firstName,
          lastName,
          email,
          mobileNumber,
          regDate,
          profileImage,
        } = res.data;
        const profileData = {
          firstName,
          lastName,
          email,
          mobileNumber,
          profileImage,
          memberSince: new Date(regDate).toLocaleDateString(),
          status: "Active",
        };

        setUser(profileData);
        form.setFieldsValue(profileData);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);
  const [loaded, setLoaded] = useState(false);
  const handleSave = async () => {
    try {
      setSubmitting(true);
      const values = await form.validateFields();

      await axios.patch(
        `${BACKEND_URL}/api/user/profile`,
        {
          firstName: values.firstName,
          lastName: values.lastName,
          mobileNumber: values.mobileNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser({ ...user, ...values });
      setEditMode(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setSubmitting(false);
    }
  };
  const [imagePopoverOpen, setImagePopoverOpen] = useState(false);
  const [imageForm] = Form.useForm();

  const handleImageUrlSubmit = async () => {
    try {
      const values = await imageForm.validateFields();
      const newUrl = values.profileImageUrl;

      setSubmitting(true);

      await axios.patch(
        `${BACKEND_URL}/api/user/profile`,
        {
          profileImage: newUrl,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          mobileNumber: user.mobileNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser((prev: any) => ({
        ...prev,
        profileImage: newUrl,
      }));
      toast.success("Profile image updated!");
      setImagePopoverOpen(false);
      imageForm.resetFields();
    } catch (err) {
      console.error("Error updating image:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center  p-4 ">
      <div className="w-full max-w-lg bg-white dark:bg-zinc-800 rounded-xl shadow-xl p-6">
        <div className="text-center mb-2">
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white">
            Your Profile
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400">
            Manage your account information
          </p>
        </div>

        {loading ? (
          <div className="space-y-4 flex flex-col items-center">
            <Skeleton.Avatar active size={96} shape="circle" />
            <Skeleton active paragraph={{ rows: 4 }} />
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center mb-4">
              <Avatar
                size={96}
                src={
                  <img
                    src={
                      user?.profileImage ||
                      "https://avatar.iran.liara.run/public"
                    }
                    alt={"Avatar"}
                    loading="lazy"
                    onLoad={() => setLoaded(true)}
                    style={{
                      objectFit: "cover",
                      filter: loaded ? "none" : "blur(8px)",
                      transition: "filter 0.3s ease-out",
                    }}
                  />
                }
              />
              <Popover
                content={
                  <Form form={imageForm} onFinish={handleImageUrlSubmit}>
                    <Form.Item
                      name="profileImageUrl"
                      rules={[
                        {
                          required: true,
                          message: "Please enter an image URL",
                        },
                        {
                          type: "url",
                          message: "Please enter a valid URL",
                        },
                      ]}
                    >
                      <Input placeholder="Enter image URL" />
                    </Form.Item>

                    <center>
                      <Button
                        type="dashed"
                        size="small"
                        htmlType="submit"
                        icon={<SaveOutlined />}
                        loading={submitting}
                        disabled={submitting}
                      >
                        Save
                      </Button>
                    </center>
                  </Form>
                }
                title="Change Profile Image"
                trigger="click"
                open={imagePopoverOpen}
                onOpenChange={setImagePopoverOpen}
              >
                <Button icon={<CameraOutlined />} size="small" className="mt-2">
                  Change Photo
                </Button>
              </Popover>
            </div>

            <Form
              form={form}
              layout="vertical"
              disabled={!editMode}
              className="-space-y-2"
            >
              <div className="flex justify-between gap-x-3">
                <Form.Item
                  label="First Name"
                  name="firstName"
                  rules={[
                    { required: true, message: "Please input your first name" },
                  ]}
                  className="w-1/2"
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Last Name"
                  name="lastName"
                  rules={[
                    { required: true, message: "Please input your last name" },
                  ]}
                  className="w-1/2"
                >
                  <Input />
                </Form.Item>
              </div>
              <Form.Item
                label="Email Address"
                name="email"
                rules={[
                  { required: true, message: "Please input your email" },
                  { type: "email", message: "Enter a valid email" },
                ]}
              >
                <Input readOnly />
              </Form.Item>

              <Form.Item
                label="Mobile Number"
                name="mobileNumber"
                rules={[
                  {
                    required: true,
                    message: "Please input your mobile number",
                  },
                  {
                    pattern: /^\d+$/,
                    message: "Mobile number must be digits only",
                  },
                  {
                    len: 10,
                    message: "Mobile number must be 10 digits long",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Form>

            <div className=" space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
              <div className="flex justify-between">
                <span className="font-medium">Member Since</span>
                <span>{user.memberSince}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Account Status</span>
                <span className="text-green-500 font-bold">{user.status}</span>
              </div>
            </div>

            <Button
              type="primary"
              block
              className="mt-6 flex items-center justify-center gap-2"
              icon={editMode ? <SaveOutlined /> : <EditOutlined />}
              onClick={editMode ? handleSave : () => setEditMode(true)}
              loading={submitting}
              disabled={submitting}
            >
              {editMode ? "Save Changes" : "Edit Profile"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
