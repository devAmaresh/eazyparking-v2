import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Profile from "@/components/admin/Profile";
import ChangePassword from "@/components/admin/ChangePassword";

const Dashboard = () => {
  return (
    <Tabs defaultValue="manage-parking-lot" className="py-5 px-10">
      <center>
        <TabsList className="bg-zinc-200 dark:bg-zinc-800">
          <TabsTrigger
            value="manage-parking-lot"
            className="hover:cursor-pointer w-44"
          >
            Admin Profile
          </TabsTrigger>
          <TabsTrigger
            value="add-parking-lot"
            className="hover:cursor-pointer w-44"
          >
            Change Password
          </TabsTrigger>
        </TabsList>
      </center>
      <TabsContent value="manage-parking-lot">
        <Profile />
      </TabsContent>
      <TabsContent value="add-parking-lot">
        <ChangePassword />
      </TabsContent>
    </Tabs>
  );
};

export default Dashboard;
