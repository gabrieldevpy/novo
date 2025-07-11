
'use client';

import { useState } from 'react';
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

const mockRoutes: RouteConfig[] = [];

const templates = {
    'Facebook Ads': {
        denyUserAgents: `facebookexternalhit\nFacebot`,
        denyIps: `# Facebook / Meta\n31.13.24.0/21\n69.63.176.0/20\n66.220.144.0/20\n69.171.224.0/19\n157.240.0.0/16`,
    },
    'Google Ads': {
        denyUserAgents: `Googlebot\nGooglebot-Image\nMediapartners-Google\nAdsBot-Google\nAdsBot-Google-Mobile`,
        denyIps: `# Googlebot\n66.249.64.0/19\n64.233.160.0/19\n72.14.192.0/18\n203.208.32.0/19\n74.125.0.0/16`,
    },
    'TikTok Ads': {
        denyUserAgents: `TikTokBot`,
        denyIps: `# TikTok\n47.242.0.0/16\n161.117.0.0/16\n170.33.0.0/16`,
    },
};

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
                        {mockRoutes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No routes created yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            mockRoutes.map((route) => (
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
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

function CreateRouteDialog() {
    const [denyUserAgents, setDenyUserAgents] = useState('');
    const [denyIps, setDenyIps] = useState('');

    const applyTemplate = (templateName: keyof typeof templates) => {
        const template = templates[templateName];
        setDenyUserAgents(template.denyUserAgents);
        setDenyIps(template.denyIps);
    };

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
                        <Button variant="outline" onClick={() => applyTemplate('Facebook Ads')}>Facebook Ads Template</Button>
                        <Button variant="outline" onClick={() => applyTemplate('Google Ads')}>Google Ads Template</Button>
                        <Button variant="outline" onClick={() => applyTemplate('TikTok Ads')}>TikTok Ads Template</Button>
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
                        <Textarea id="denyUserAgents" value={denyUserAgents} onChange={e => setDenyUserAgents(e.target.value)} placeholder="facebookexternalhit/1.1" className="col-span-3 min-h-[80px]" />
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="denyIps" className="text-right pt-2">
                           Deny IPs
                        </Label>
                        <Textarea id="denyIps" value={denyIps} onChange={e => setDenyIps(e.target.value)} placeholder="66.249.64.0/19" className="col-span-3 min-h-[80px]" />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit">Save Route</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
