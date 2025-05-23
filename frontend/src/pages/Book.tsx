
import { useParams } from "react-router-dom";

import VehicleForm from "@/components/user/VehicleForm";

const Book = () => {
  const { id } = useParams();

  return (
  
      <VehicleForm parkingLotId={id} />

  );
};

export default Book;
