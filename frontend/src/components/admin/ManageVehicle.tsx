import * as React from "react";

import InVehicle from "./InVehicle";
import OutVehicle from "./OutVehicle";
import History from "./History";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import ChangePassword from './ChangePassword';
import Cookies from "js-cookie";
import axios from "axios";
import { BACKEND_URL } from "@/utils/backend";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const Profiledata = () => {
  return (
    <Tabs defaultValue="in" className="w-full p-10">
      <center>
        <TabsList className="bg-zinc-200 dark:bg-zinc-800">
          <TabsTrigger value="in" className="hover:cursor-pointer w-44">
            In-Vehicle
          </TabsTrigger>
          <TabsTrigger value="out" className="hover:cursor-pointer w-44">
            Out-Vehicle
          </TabsTrigger>
          <TabsTrigger value="history" className="hover:cursor-pointer w-44">
            History
          </TabsTrigger>
        </TabsList>
      </center>

      <TabsContent value="in">
        <InVehicle />
      </TabsContent>

      <TabsContent value="out">
        <OutVehicle />
      </TabsContent>

      <TabsContent value="history">
        <History />
      </TabsContent>
    </Tabs>
  );
};

export default Profiledata;
