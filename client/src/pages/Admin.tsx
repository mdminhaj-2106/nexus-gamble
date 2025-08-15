import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Users, DollarSign, Settings } from "lucide-react";

interface User {
  id: number;
  username: string;
  balance: number;
}

const Admin = () => {
  const [editingBalance, setEditingBalance] = useState<{ userId: number; balance: string } | null>(null);
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  const updateBalanceMutation = useMutation({
    mutationFn: async ({ userId, balance }: { userId: number; balance: number }) => {
      const response = await fetch(`/api/admin/users/${userId}/balance`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ balance }),
      });
      if (!response.ok) throw new Error("Failed to update balance");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setEditingBalance(null);
      toast({
        title: "Balance Updated",
        description: "User balance has been successfully updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update user balance.",
        variant: "destructive",
      });
    },
  });

  const totalBalance = users.reduce((sum, user) => sum + user.balance, 0);
  const totalUsers = users.length;

  const handleBalanceSubmit = (userId: number) => {
    if (!editingBalance || editingBalance.userId !== userId) return;
    
    const balance = parseInt(editingBalance.balance);
    if (isNaN(balance) || balance < 0) {
      toast({
        title: "Invalid Balance",
        description: "Please enter a valid positive number.",
        variant: "destructive",
      });
      return;
    }

    updateBalanceMutation.mutate({ userId, balance });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading admin panel...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Admin Panel</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card data-testid="stats-total-users">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="total-users-count">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered players</p>
          </CardContent>
        </Card>

        <Card data-testid="stats-total-balance">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="total-credits">₡{totalBalance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all users</p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>View and manage user accounts and balances</CardDescription>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-8" data-testid="no-users-message">
              <p className="text-muted-foreground">No users registered yet.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} data-testid={`user-row-${user.id}`}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell className="font-medium" data-testid={`username-${user.id}`}>
                      {user.username}
                    </TableCell>
                    <TableCell data-testid={`balance-${user.id}`}>
                      {editingBalance?.userId === user.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={editingBalance.balance}
                            onChange={(e) => setEditingBalance({ ...editingBalance, balance: e.target.value })}
                            className="w-24"
                            data-testid={`balance-input-${user.id}`}
                          />
                          <Button
                            size="sm"
                            onClick={() => handleBalanceSubmit(user.id)}
                            disabled={updateBalanceMutation.isPending}
                            data-testid={`save-balance-${user.id}`}
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingBalance(null)}
                            data-testid={`cancel-balance-${user.id}`}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        `₡${user.balance.toLocaleString()}`
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.balance > 0 ? "default" : "destructive"} data-testid={`status-${user.id}`}>
                        {user.balance > 0 ? "Active" : "No Credits"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {editingBalance?.userId !== user.id && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingBalance({ userId: user.id, balance: user.balance.toString() })}
                          data-testid={`edit-balance-${user.id}`}
                        >
                          Edit Balance
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;