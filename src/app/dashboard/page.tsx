import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Bot, FileDown, Filter, User, Route as RouteIcon, ShieldCheck } from 'lucide-react';
import type { LogEntry } from '@/lib/types';
import Link from 'next/link';

const mockLogs: LogEntry[] = [];

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
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">No data available yet</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Bots Blocked</CardTitle>
            <Bot className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">No data available yet</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Routes</CardTitle>
            <RouteIcon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
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
                {mockLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No activity logs found.
                    </TableCell>
                  </TableRow>
                ) : (
                  mockLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                            {log.type === 'bot' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                            <span className="capitalize">{log.botType || log.type}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">{log.ip}</TableCell>
                      <TableCell className="font-mono">{log.route}</TableCell>
                      <TableCell className="hidden md:table-cell max-w-xs truncate font-mono text-xs">{log.userAgent}</TableCell>
                      <TableCell className="hidden sm:table-cell">{new Date(log.timestamp).toLocaleString()}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
