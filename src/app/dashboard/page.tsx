import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Bot, FileDown, Filter, User } from 'lucide-react';
import type { LogEntry } from '@/lib/types';
import Link from 'next/link';

const mockLogs: LogEntry[] = [
  { id: '1', ip: '203.0.113.1', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ...', route: '/promo-1', type: 'human', timestamp: '2023-10-27T10:00:00Z' },
  { id: '2', ip: '198.51.100.2', userAgent: 'Googlebot/2.1 (+http://www.google.com/bot.html)', route: '/promo-2', type: 'bot', botType: 'Google', timestamp: '2023-10-27T10:01:00Z' },
  { id: '3', ip: '203.0.113.2', userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0_3 like Mac OS X) ...', route: '/promo-1', type: 'human', timestamp: '2023-10-27T10:02:00Z' },
  { id: '4', ip: '198.51.100.3', userAgent: 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', route: '/offer-3', type: 'bot', botType: 'Facebook', timestamp: '2023-10-27T10:03:00Z' },
  { id: '5', ip: '203.0.113.3', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) ...', route: '/main-offer', type: 'human', timestamp: '2023-10-27T10:04:00Z' },
  { id: '6', ip: '198.51.100.4', userAgent: 'Mozilla/5.0 (compatible; AhrefsBot/7.0; +http://ahrefs.com/robot/)', route: '/promo-1', type: 'bot', botType: 'Ahrefs', timestamp: '2023-10-27T10:05:00Z' },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Accesses</CardTitle>
            <User className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,345</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Bots Blocked</CardTitle>
            <Bot className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4,567</div>
            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Routes</CardTitle>
            <RouteIcon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Manage your cloaked routes</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle>Recent Activity Logs</CardTitle>
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <div className="flex items-center space-x-2">
                <Switch id="emergency-mode" />
                <Label htmlFor="emergency-mode" className="text-destructive">Emergency Mode</Label>
              </div>
              <Button asChild variant="outline">
                <Link href="/dashboard/check">Run Manual Check</Link>
              </Button>
              <div className="flex gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 gap-1">
                        <Filter className="w-3.5 h-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Filter</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>IP Address</DropdownMenuItem>
                      <DropdownMenuItem>Route</DropdownMenuItem>
                      <DropdownMenuItem>Type (Bot/Human)</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <FileDown className="w-3.5 h-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Export</span>
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-4">
              <Input placeholder="Filter by IP, route, user agent..." />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead className="hidden md:table-cell">User Agent</TableHead>
                  <TableHead className="hidden sm:table-cell">Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <Badge variant={log.type === 'bot' ? 'destructive' : 'secondary'}>
                        <div className="flex items-center gap-2">
                            {log.type === 'bot' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                            <span className="capitalize">{log.botType || log.type}</span>
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono">{log.ip}</TableCell>
                    <TableCell className="font-mono">{log.route}</TableCell>
                    <TableCell className="hidden md:table-cell max-w-xs truncate font-mono text-xs">{log.userAgent}</TableCell>
                    <TableCell className="hidden sm:table-cell">{new Date(log.timestamp).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
