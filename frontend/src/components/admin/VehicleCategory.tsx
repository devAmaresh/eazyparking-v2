import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AddCategory from "./AddCategory";
import ManageCategory from "./ManageCategory";

const VehicleCategory = () => {
  const [activeTab, setActiveTab] = useState("manage");

  const handleCategoryAdded = () => {
    // Switch to manage tab and toggle refresh trigger
    setActiveTab("manage");
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full p-5">
      <center>
        <TabsList className="bg-zinc-200 dark:bg-zinc-800">
          <TabsTrigger value="manage" className="w-44 hover:cursor-pointer">
            Manage Category
          </TabsTrigger>
          <TabsTrigger value="add" className="w-44 hover:cursor-pointer">
            Add Category
          </TabsTrigger>
        </TabsList>
      </center>
      <TabsContent value="add">
        <AddCategory onCategoryAdded={handleCategoryAdded} />
      </TabsContent>
      <TabsContent value="manage">
        <ManageCategory />
      </TabsContent>
    </Tabs>
  );
};

export default VehicleCategory;
