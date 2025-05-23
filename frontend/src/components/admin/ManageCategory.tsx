import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import { BACKEND_URL } from "@/utils/backend";

// ShadCN UI components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Icons
import { Pencil, Trash2, Search, Tag, RotateCcw, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryType {
  id: string;
  vehicleCat: string;
  creationDate: string;
}

const ManageCategory = () => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(
    null
  );
  const [editValue, setEditValue] = useState("");
  const [updating, setUpdating] = useState(false);

  const fetchCategories = async () => {
    const token = Cookies.get("adminToken");
    if (!token) {
      toast.error("Admin token not found!");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/api/admin/category/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(response.data);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to fetch categories";
      toast.error(msg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category: CategoryType) => {
    setSelectedCategory(category);
    setEditValue(category.vehicleCat);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (category: CategoryType) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const confirmEdit = async () => {
    if (!selectedCategory || !editValue.trim()) return;

    const token = Cookies.get("adminToken");
    if (!token) {
      toast.error("Admin token not found!");
      return;
    }

    try {
      setUpdating(true);
      const res = await axios.patch(
        `${BACKEND_URL}/api/admin/category/${selectedCategory.id}`,
        { vehicleCat: editValue },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === selectedCategory.id ? { ...cat, ...res.data } : cat
        )
      );

      toast.success("Category updated successfully!");
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Update failed", error);
      toast.error("Failed to update category");
    } finally {
      setUpdating(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedCategory) return;

    const token = Cookies.get("adminToken");
    if (!token) {
      toast.error("Admin token not found!");
      return;
    }

    try {
      setUpdating(true);
      await axios.delete(
        `${BACKEND_URL}/api/admin/category/${selectedCategory.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Category deleted successfully!");
      fetchCategories();
      setIsDeleteDialogOpen(false);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to delete category";
      toast.error(msg);
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((category) =>
    category.vehicleCat.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <div>
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Vehicle Categories
            </h2>
            <p className="text-muted-foreground mt-1">
              Manage all vehicle categories in your system
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-full"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={fetchCategories}
              className="flex-shrink-0 hover:cursor-pointer"
              title="Refresh"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="rounded-md border overflow-hidden">
          {loading ? (
            <div className="p-4 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between items-center">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-16 text-center">No.</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="hidden md:table-cell">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Created</span>
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-8 text-muted-foreground"
                    >
                      {searchQuery
                        ? "No matching categories found"
                        : "No categories available"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map((category, index) => (
                    <TableRow
                      key={category.id}
                      className="group hover:bg-muted/50"
                    >
                      <TableCell className="text-center font-medium">
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-primary" />
                          <span className="font-medium">
                            {category.vehicleCat}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {formatDate(category.creationDate)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:cursor-pointer opacity-70 group-hover:opacity-100"
                            onClick={() => handleEdit(category)}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0  hover:cursor-pointer text-destructive opacity-70 group-hover:opacity-100 hover:text-destructive/90"
                            onClick={() => handleDelete(category)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Category count badge */}
        <div className="mt-4 flex justify-between items-center">
          <Badge variant="outline" className="text-xs py-1 px-2">
            <span className="font-medium">{filteredCategories.length}</span>
            <span className="ml-1 text-muted-foreground">
              {filteredCategories.length === 1 ? "category" : "categories"}{" "}
              {searchQuery && " matched"}
            </span>
          </Badge>
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchQuery("")}
              className="h-8 text-xs hover:cursor-pointer"
            >
              Clear filter
            </Button>
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Vehicle Category</DialogTitle>
            <DialogDescription>
              Update the name of this vehicle category.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category-name" className="text-right">
                Name
              </Label>
              <Input
                id="category-name"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="col-span-3"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="hover:cursor-pointer"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={updating}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmEdit}
              disabled={!editValue.trim() || updating}
              className="ml-2 hover:cursor-pointer"
            >
              {updating ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the category "
              <span className="font-medium">
                {selectedCategory?.vehicleCat}
              </span>
              "? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              className="hover:cursor-pointer"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={updating}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={updating}
              className="ml-2 hover:cursor-pointer"
            >
              {updating ? "Deleting..." : "Delete Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageCategory;
