import StatCard from "@/components/stat-card";
import {
  DollarSign,
  Users,
  MousePointerClick,
  BadgePercent,
  Link as LinkIcon,
  Tag
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function AffiliateDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Affiliate Dashboard</h1>
        <p className="text-muted-foreground">Track your referrals and earnings.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Clicks"
          value="12,832"
          icon={MousePointerClick}
          description="+15% from last month"
        />
        <StatCard
          title="Registrations"
          value="1,204"
          icon={Users}
          description="+8% from last month"
        />
        <StatCard
          title="Sales"
          value="458"
          icon={DollarSign}
          description="+12% from last month"
        />
        <StatCard
          title="Commission"
          value="$1,289.40"
          icon={BadgePercent}
          description="Total earnings this month"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Marketing & Referral Tools</CardTitle>
            <CardDescription>Generate links and track your campaigns.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="font-medium text-sm flex items-center gap-2"><LinkIcon className="w-4 h-4"/> Your Referral Link</label>
              <div className="flex gap-2">
                <Input readOnly value="https://mercadito.online/?ref=aff123" />
                <Button variant="outline">Copy</Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="font-medium text-sm flex items-center gap-2"><Tag className="w-4 h-4"/> Campaign Tag (Optional)</label>
              <div className="flex gap-2">
                <Input placeholder="e.g., socialmedia_promo" />
                <Button>Generate Link</Button>
              </div>
              <p className="text-xs text-muted-foreground">Add a tag to track performance of specific campaigns.</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Finance Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-baseline">
                <span className="text-muted-foreground">Total Generated</span>
                <span className="font-bold text-lg">$5,670.50</span>
            </div>
            <div className="flex justify-between items-baseline">
                <span className="text-muted-foreground">Total Paid</span>
                <span className="font-bold text-lg">$4,100.00</span>
            </div>
            <div className="flex justify-between items-baseline text-primary">
                <span >Pending Balance</span>
                <span className="font-bold text-lg">$1,570.50</span>
            </div>
            <Button className="w-full">Request Payment</Button>
          </CardContent>
        </Card>
      </div>

       <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>A record of your past payments.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Transaction ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>2023-10-05</TableCell>
                  <TableCell>$500.00</TableCell>
                  <TableCell><Badge className="bg-green-500/20 text-green-700 dark:text-green-400">Paid</Badge></TableCell>
                  <TableCell>txn_123abc</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2023-09-05</TableCell>
                  <TableCell>$450.00</TableCell>
                  <TableCell><Badge className="bg-green-500/20 text-green-700 dark:text-green-400">Paid</Badge></TableCell>
                  <TableCell>txn_456def</TableCell>
                </TableRow>
                 <TableRow>
                  <TableCell>2023-08-05</TableCell>
                  <TableCell>$550.00</TableCell>
                  <TableCell><Badge className="bg-green-500/20 text-green-700 dark:text-green-400">Paid</Badge></TableCell>
                  <TableCell>txn_789ghi</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

    </div>
  );
}
