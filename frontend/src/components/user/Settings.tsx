import Profile from './Profile';
import ChangePassword from './ChangePassword';
import { Tabs,TabsContent, TabsList, TabsTrigger } from '../ui/tabs';


const Profiledata = () => {


  return (
    <Tabs defaultValue="profile" className="w-full p-10">
      <center>
        <TabsList className="bg-zinc-200 dark:bg-zinc-800">
          <TabsTrigger value="profile" className="hover:cursor-pointer w-44">
            Profile
          </TabsTrigger>
          <TabsTrigger value="changepwd" className="hover:cursor-pointer w-44">
            Change Password
          </TabsTrigger>
        </TabsList>
        </center>
      <TabsContent value="profile">
      <Profile/>
      </TabsContent>
      <TabsContent value="changepwd">
        <ChangePassword />
      </TabsContent>
    </Tabs>
    
  );
};

export default Profiledata;
