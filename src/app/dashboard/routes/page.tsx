import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import type { RouteConfig } from '@/lib/types';
import { Copy, MoreHorizontal, PlusCircle } from 'lucide-react';

const mockRoutes: RouteConfig[] = [
    { id: '1', slug: 'promo-1', redirectBotTo: 'https://google.com', active: true, template: 'Facebook Ads', createdAt: '2023-10-26T10:00:00Z', totalAccesses: 5210, botsBlocked: 1340 },
    { id: '2', slug: 'promo-2', redirectBotTo: 'https://bing.com', active: true, template: 'Google Ads', createdAt: '2023-10-25T11:30:00Z', totalAccesses: 890, botsBlocked: 612 },
    { id: '3', slug: 'offer-3', redirectBotTo: 'https://yahoo.com', active: false, template: 'TikTok Ads', createdAt: '2023-10-24T09:00:00Z', totalAccesses: 1532, botsBlocked: 211 },
    { id: '4', slug: 'main-offer', redirectBotTo: 'https://duckduckgo.com', active: true, template: 'Custom', createdAt: '2023-10-23T14:00:00Z', totalAccesses: 10231, botsBlocked: 3452 },
];

export default function RoutesPage() {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Cloaked Routes</CardTitle>
                        <CardDescription>Manage and create your cloaked routes.</CardDescription>
                    </div>
                    <CreateRouteDialog />
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Status</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead className="hidden md:table-cell">Bot Redirect</TableHead>
                            <TableHead className="hidden lg:table-cell">Template</TableHead>
                            <TableHead className="hidden sm:table-cell">Created At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockRoutes.map((route) => (
                            <TableRow key={route.id}>
                                <TableCell>
                                    <Badge variant={route.active ? 'default' : 'outline'} className={route.active ? 'bg-accent text-accent-foreground' : ''}>
                                        {route.active ? 'Active' : 'Inactive'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="font-mono">/{route.slug}</TableCell>
                                <TableCell className="hidden md:table-cell font-mono text-xs">{route.redirectBotTo}</TableCell>
                                <TableCell className="hidden lg:table-cell">{route.template}</TableCell>
                                <TableCell className="hidden sm:table-cell">{new Date(route.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem>Edit</DropdownMenuItem>
                                            <DropdownMenuItem><Copy className="w-4 h-4 mr-2" />Clone</DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

function CreateRouteDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Create Route
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Create New Cloaked Route</DialogTitle>
                    <DialogDescription>
                        Set up a new route. Start with a template or from scratch.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex gap-2 mb-4">
                        <Button variant="outline">Facebook Ads Template</Button>
                        <Button variant="outline">Google Ads Template</Button>
                        <Button variant="outline">TikTok Ads Template</Button>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="slug" className="text-right">
                            Slug
                        </Label>
                        <Input id="slug" placeholder="my-awesome-product" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="redirectBotTo" className="text-right">
                            Bot Redirect URL
                        </Label>
                        <Input id="redirectBotTo" defaultValue="https://google.com" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="allowBots" className="text-right">
                            Behavior
                        </Label>
                        <Select defaultValue='block'>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select behavior" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="block">Block all bots (recommended)</SelectItem>
                                <SelectItem value="allow">Allow all bots (cloaking disabled)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="denyUserAgents" className="text-right pt-2">
                           Deny User Agents
                        </Label>
                        <Textarea id="denyUserAgents" placeholder="Googlebot/2.1&#10;facebookexternalhit/1.1" className="col-span-3 min-h-[80px]" />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit">Save Route</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

const RouteIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="6" cy="18" r="3"/><circle cx="18" cy="6" r="3"/><path d="M6 15V6c0-1.1.9-2 2-2h5"/><path d="m13 14 3-3 3 3"/><path d="M16 11V6"/></svg>
)
