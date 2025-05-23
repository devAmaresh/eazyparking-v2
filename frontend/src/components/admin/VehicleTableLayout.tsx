import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Label } from "@/components/ui/label";

// Icons
import { Search, RotateCcw, AlertCircle } from "lucide-react";

interface Column<T> {
  key: string;
  header: React.ReactNode;
  cell: (item: T, index: number) => React.ReactNode;
  sortable?: boolean;
  searchable?: boolean;
}

interface VehicleTableLayoutProps<T> {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  data: T[];
  columns: Column<T>[];
  loading: boolean;
  error?: string;
  onSearch: (query: string) => void;
  searchQuery: string;
  onRefresh: () => void;
  emptyMessage: string;
  actionComponent?: React.ReactNode;
}

export function VehicleTableLayout<T>({
  title,
  subtitle,
  icon,
  data,
  columns,
  loading,
  error,
  onSearch,
  searchQuery,
  onRefresh,
  emptyMessage,
  actionComponent,
}: VehicleTableLayoutProps<T>) {
  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* Header with search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            {icon}
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-8 w-full"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={onRefresh}
            className="flex-shrink-0 hover:cursor-pointer"
            title="Refresh"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          {actionComponent}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-destructive/10 text-destructive rounded-lg p-3 flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Table with data */}
      <div className="rounded-md border border-border overflow-hidden">
        {loading ? (
          <div className="p-4 space-y-4">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-1/6" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/5" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                  <Skeleton className="h-0.5 w-full" />
                </div>
              ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  {columns.map((column) => (
                    <TableHead key={column.key} className={column.key === 'action' ? 'text-right' : ''}>
                      {column.header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="text-center py-10 text-muted-foreground"
                    >
                      {emptyMessage}
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((item, idx) => (
                    <TableRow key={idx} className="group hover:bg-muted/50">
                      {columns.map((column) => (
                        <TableCell 
                          key={`${idx}-${column.key}`}
                          className={column.key === 'action' ? 'text-right' : ''}
                        >
                          {column.cell(item, idx)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Count badge */}
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="text-xs py-1 px-2">
          <span className="font-medium">{data.length}</span>
          <span className="ml-1 text-muted-foreground"> records</span>
        </Badge>
      </div>
    </div>
  );
}

// Common elements for vehicle management components
export const RemarkDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  remark: string;
  setRemark: (value: string) => void;
  title: string;
  description: string;
  confirmText: string;
  loading: boolean;
}> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  remark, 
  setRemark,
  title,
  description,
  confirmText,
  loading
}) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="remark">Remark</Label>
          <Input
            id="remark"
            placeholder="Enter your remark"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            className="w-full"
          />
        </div>
      </div>
      <DialogFooter className="flex space-x-2 justify-end">
        <Button variant="outline" onClick={onClose} disabled={loading} className="hover:cursor-pointer">
          Cancel
        </Button>
        <Button onClick={onConfirm} disabled={loading} className="hover:cursor-pointer">
          {loading ? "Processing..." : confirmText}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export const StatusBadge: React.FC<{
  status: "upcoming" | "parked" | "completed" | string;
  text?: string;
}> = ({ status, text }) => {
  const getStatusConfig = () => {
    switch (status) {
      case "upcoming":
        return {
          color: "bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30",
          text: text || "Upcoming",
        };
      case "parked":
        return {
          color: "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30",
          text: text || "Parked",
        };
      case "completed":
        return {
          color: "bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30",
          text: text || "Completed",
        };
      default:
        return {
          color: "bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-500/30",
          text: text || status,
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Badge variant="outline" className={`${config.color} font-medium`}>
      {config.text}
    </Badge>
  );
};
