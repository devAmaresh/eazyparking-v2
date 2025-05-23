import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import InVehicle from "./InVehicle";
import OutVehicle from "./OutVehicle";
import History from "./History";


// Icons
import { Car, LogOut, History as HistoryIcon } from "lucide-react";

const ManageVehicle = () => {
  const [activeTab, setActiveTab] = useState("in");

  return (
    <div className="p-6 min-h-screen bg-background text-foreground transition-colors">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          Vehicle Management
        </h1>
        <p className="text-muted-foreground mt-1">
          Track and manage vehicles across different states in your parking
          system
        </p>
      </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="flex justify-center">
              <TabsList className="h-11 dark:bg-zinc-800 backdrop-blur-sm rounded-t-lg border border-border/40 border-b-0">
                <TabsTrigger
                  value="in"
                  className="hover:cursor-pointer"
                >
                  <Car className="h-4 w-4" />
                  <span>In-Vehicle</span>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary transform scale-x-0 transition-transform data-[state=active]:scale-x-100"></div>
                </TabsTrigger>
                <TabsTrigger
                  value="out"
                  className="hover:cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Out-Vehicle</span>
                  <div className=" hover:cursor-pointer absolute bottom-0 left-0 right-0 h-0.5 bg-primary transform scale-x-0 transition-transform data-[state=active]:scale-x-100"></div>
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="hover:cursor-pointer"
                >
                  <HistoryIcon className="h-4 w-4" />
                  <span>History</span>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary transform scale-x-0 transition-transform data-[state=active]:scale-x-100"></div>
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-0">
              <TabsContent value="in" className="m-0 mt-0 p-4">
                <InVehicle />
              </TabsContent>
              <TabsContent value="out" className="m-0 mt-0 p-4">
                <OutVehicle />
              </TabsContent>
              <TabsContent value="history" className="m-0 mt-0 p-4">
                <History />
              </TabsContent>
            </div>
          </Tabs>

    </div>
  );
};

export default ManageVehicle;
