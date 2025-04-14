import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../utils/backend";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";

const VehicleForm = ({ parkingLotId }: any) => {
  const [formData, setFormData] = useState({
    vehicleCategory: "",
    vehicleCompanyName: "",
    registrationNumber: "",
    inTime: "",
    parkingLotId: parkingLotId,
  });
  console.log(parkingLotId);
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log(formData);

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/user/book`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      console.log("Form submitted successfully:", response.data);

      toast.success("Vehicle booked successfully!");

      // Reset form
      setFormData({
        vehicleCategory: "",
        vehicleCompanyName: "",
        registrationNumber: "",
        inTime: "",
        parkingLotId: parkingLotId,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to book vehicle. Please try again.");
    }
  };
  const [vehicleCategories, setVehicleCategories] = useState([]);
  const fetchVehicles = async () => {
    try {
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
    }
  };
  useEffect(() => {
    fetchVehicles();
  }, []);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          Vehicle Entry Form
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Vehicle Category
            </label>
            <select
              name="vehicleCategory"
              value={formData.vehicleCategory}
              onChange={handleChange}
              className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            >
              <option value="" disabled>
                Select a category
              </option>
              {vehicleCategories.map((category: any) => (
                <option key={category.id} value={category.id}>
                  {category.vehicleCat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Vehicle Company Name
            </label>
            <input
              type="text"
              name="vehicleCompanyName"
              value={formData.vehicleCompanyName}
              onChange={handleChange}
              className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Registration Number
            </label>
            <input
              type="text"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleChange}
              className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              In Time
            </label>
            <input
              type="datetime-local"
              name="inTime"
              value={formData.inTime}
              onChange={handleChange}
              className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default VehicleForm;
