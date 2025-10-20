import StatCard from "@/components/stat-card";
import {
  DollarSign,
  Package,
  CreditCard,
  CircleHelp,
  Plus,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { products } from "@/lib/data";

const sellerProducts = products.filter(p => p.sellerId === 'user1');

export default function SellerDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Seller Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, here's your sales overview.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value="$45,231.89"
          icon={DollarSign}
          description="+20.1% from last month"
        />
        <StatCard
          title="Sales"
          value="+12,234"
          icon={CreditCard}
          description="+19% from last month"
        />
        <StatCard
          title="Pending Balance"
          value="$2,350.00"
          icon={CircleHelp}
          description="Awaiting payout"
        />
        <StatCard
          title="Total Products"
          value="57"
          icon={Package}
          description="2 products need attention"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Product History</CardTitle>
            <CardDescription>A list of your recent products.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sellerProducts.slice(0, 5).map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          product.status === 'Active' ? 'default' :
                          product.status === 'Sold' ? 'secondary' : 'outline'
                        }
                        className={product.status === 'Active' ? 'bg-green-500/20 text-green-700 dark:text-green-400' : ''}
                      >
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>
                      {product.isAuction ? "Auction" : "Direct Sale"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Personalize Store</CardTitle>
            <CardDescription>
              Update your store's appearance and information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="storeName" className="text-sm font-medium">Store Name</label>
              <input id="storeName" defaultValue="Vintage Finds" className="w-full p-2 border rounded-md bg-transparent" />
            </div>
            <div className="space-y-2">
              <label htmlFor="storeDesc" className="text-sm font-medium">Store Description</label>
              <textarea id="storeDesc" defaultValue="Curated collection of vintage..." className="w-full p-2 border rounded-md bg-transparent min-h-[100px]" />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Profile Picture & Banner</label>
                <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">Upload Picture</Button>
                    <Button variant="outline" className="flex-1">Upload Banner</Button>
                </div>
            </div>
            <Button className="w-full">Save Changes</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
