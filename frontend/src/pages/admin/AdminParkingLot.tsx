import ManageParkingLot from "@/components/admin/ManageParkingLot";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddParkingLot from "@/components/admin/AddParkingLot";

const AdminParkingLot = () => {


  return (
   
      <Tabs defaultValue="manage-parking-lot" className="py-5 px-10">
        <center>
          <TabsList className="bg-zinc-200 dark:bg-zinc-800">
            <TabsTrigger
              value="manage-parking-lot"
              className="hover:cursor-pointer w-44"
            >
              Manage Parking Lot
            </TabsTrigger>
            <TabsTrigger
              value="add-parking-lot"
              className="hover:cursor-pointer w-44"
            >
              Add Parking Lot
            </TabsTrigger>
          </TabsList>
        </center>
        <TabsContent value="manage-parking-lot">
          <ManageParkingLot />
        </TabsContent>
        <TabsContent value="add-parking-lot">
          <AddParkingLot />
        </TabsContent>
      </Tabs>

  );
};

export default AdminParkingLot;
