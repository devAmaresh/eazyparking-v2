import { useParams } from "react-router-dom";

import VehicleForm from "@/components/admin/VehicleForm";

const AdminBook = () => {
  const { id } = useParams();

  return <VehicleForm parkingLotId={id} />;
};

export default AdminBook;
