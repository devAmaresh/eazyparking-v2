import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import { BACKEND_URL } from "@/utils/backend";

// ShadCN UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Icons
import { Tag, Plus, Loader2, CheckCircle2 } from "lucide-react";

interface AddCategoryProps {
  onCategoryAdded: () => void;
}

const AddCategory = ({ onCategoryAdded }: AddCategoryProps) => {
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [recentlyAdded, setRecentlyAdded] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!category.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    const token = Cookies.get("adminToken");
    if (!token) {
      toast.error("No token found. Please log in.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${BACKEND_URL}/api/admin/category/add`,
        { vehicleCat: category },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        toast.success("Category added successfully!");
        setRecentlyAdded([...recentlyAdded, category]);
        setCategory("");
        onCategoryAdded();
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to add category";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center w-full">
      <Card className="w-full max-w-md shadow-sm border">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Tag className="h-4 w-4 text-primary" />
            </div>
            <CardTitle>Add New Category</CardTitle>
          </div>
          <CardDescription>
            Create a new vehicle category for your parking management system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} id="add-category-form">
            <div className="grid w-full gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category Name</Label>
                <div className="relative">
                  <Input
                    id="category"
                    type="text"
                    placeholder="e.g., 2 Wheeler, SUV, Sedan"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="pl-10"
                  />
                  <Tag className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Give your category a clear and descriptive name.
                </p>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-start">
          <Button
            type="submit"
            form="add-category-form"
            disabled={loading || !category.trim()}
            className="w-full"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Adding...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span>Add Category</span>
              </div>
            )}
          </Button>

          {recentlyAdded.length > 0 && (
            <div className="mt-4 w-full">
              <div className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Recently Added</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentlyAdded.slice(-5).map((cat, idx) => (
                  <div
                    key={idx}
                    className="bg-primary/10 text-primary rounded-full px-2.5 py-1 text-xs font-medium"
                  >
                    {cat}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default AddCategory;
