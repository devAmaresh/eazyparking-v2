import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AddCategory from "./AddCategory";
import ManageCategory from "./ManageCategory";

// UI Components
import { Card, CardContent } from "@/components/ui/card";

// Icons
import { Plus, List, Tag } from "lucide-react";

const VehicleCategory = () => {
  const [activeTab, setActiveTab] = useState("manage");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCategoryAdded = () => {
    // Switch to manage tab and toggle refresh trigger
    setActiveTab("manage");
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="p-6 min-h-screen bg-background text-foreground transition-colors">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Tag className="h-7 w-7 text-primary" />
          Vehicle Categories
        </h1>
        <p className="text-muted-foreground mt-1">
          Create and manage vehicle categories for your parking system
        </p>
      </div>

      <Card className="bg-card border shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="flex justify-center border-b px-2">
              <TabsList className="h-10 p-1 dark:bg-black backdrop-blur-sm rounded-md">
                <TabsTrigger
                  value="manage"
                  className="rounded-md hover:cursor-pointer px-5 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm font-medium text-muted-foreground data-[state=active]:text-foreground transition-all gap-1.5"
                >
                  <List className="h-4 w-4 " />
                  Manage Categories
                </TabsTrigger>
                <TabsTrigger
                  value="add"
                  className="rounded-md  hover:cursor-pointer px-5 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm font-medium text-muted-foreground data-[state=active]:text-foreground transition-all gap-1.5"
                >
                  <Plus className="h-4 w-4" />
                  Add Category
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-4">
              <TabsContent value="manage" className="m-0 mt-2">
                <ManageCategory key={refreshTrigger} />
              </TabsContent>
              <TabsContent value="add" className="m-0 mt-2">
                <AddCategory onCategoryAdded={handleCategoryAdded} />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default VehicleCategory;
