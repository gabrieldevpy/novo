
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
        denyUserAgents: `facebookexternalhit/1.1\nFacebot\nfacebookexternalhit\nFacebot\nfacebookcatalog/1.0`,
        denyIps: `# Facebook / Meta\n31.13.24.0/21\n69.63.176.0/20\n66.220.144.0/20\n69.171.224.0/19\n157.240.0.0/16`,
    },
    'Google Ads': {
        denyUserAgents: `Googlebot\nAdsBot-Google\nGooglebot-Image\nMediapartners-Google\nAdsBot-Google\nAdsBot-Google-Mobile`,
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
                        <CardTitle>Rotas Cloaked</CardTitle>
                        <CardDescription>Gerencie e crie suas rotas cloaked.</CardDescription>
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
                            <TableHead className="hidden md:table-cell">Redirecionamento de Bot</TableHead>
                            <TableHead className="hidden lg:table-cell">URL Real</TableHead>
                            <TableHead className="hidden sm:table-cell">Criado Em</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockRoutes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    Nenhuma rota criada ainda.
                                </TableCell>
                            </TableRow>
                        ) : (
                            mockRoutes.map((route) => (
                                <TableRow key={route.id}>
                                    <TableCell>
                                        <Badge variant={route.active ? 'default' : 'outline'} className={route.active ? 'bg-accent text-accent-foreground' : ''}>
                                            {route.active ? 'Ativo' : 'Inativo'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-mono">/{route.slug}</TableCell>
                                    <TableCell className="hidden md:table-cell font-mono text-xs">{route.redirectBotTo}</TableCell>
                                    <TableCell className="hidden lg:table-cell font-mono text-xs">{route.realUrl}</TableCell>
                                    <TableCell className="hidden sm:table-cell">{new Date(route.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem>Editar</DropdownMenuItem>
                                                <DropdownMenuItem><Copy className="w-4 h-4 mr-2" />Clonar</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive">Excluir</DropdownMenuItem>
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
                    Criar Rota
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Criar Nova Rota Cloaked</DialogTitle>
                    <DialogDescription>
                        Configure uma nova rota. Comece com um modelo ou do zero.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex gap-2 mb-4">
                        <Button variant="outline" onClick={() => applyTemplate('Facebook Ads')}>Modelo Facebook Ads</Button>
                        <Button variant="outline" onClick={() => applyTemplate('Google Ads')}>Modelo Google Ads</Button>
                        <Button variant="outline" onClick={() => applyTemplate('TikTok Ads')}>Modelo TikTok Ads</Button>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="slug" className="text-right">
                            Slug
                        </Label>
                        <Input id="slug" placeholder="meu-produto-incrivel" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="realUrl" className="text-right">
                           URL de Destino (Humano)
                        </Label>
                        <Input id="realUrl" placeholder="https://seusite.com/oferta" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="redirectBotTo" className="text-right">
                            URL de Redirecionamento de Bot
                        </Label>
                        <Input id="redirectBotTo" defaultValue="https://google.com" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="allowBots" className="text-right">
                            Comportamento
                        </Label>
                        <Select defaultValue='block'>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Selecione o comportamento" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="block">Bloquear todos os bots (recomendado)</SelectItem>
                                <SelectItem value="allow">Permitir todos os bots (cloaking desativado)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="denyUserAgents" className="text-right pt-2">
                           Negar User Agents
                        </Label>
                        <Textarea id="denyUserAgents" value={denyUserAgents} onChange={e => setDenyUserAgents(e.target.value)} placeholder="facebookexternalhit/1.1" className="col-span-3 min-h-[80px]" />
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="denyIps" className="text-right pt-2">
                           Negar IPs
                        </Label>
                        <Textarea id="denyIps" value={denyIps} onChange={e => setDenyIps(e.target.value)} placeholder="66.249.64.0/19" className="col-span-3 min-h-[80px]" />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit">Salvar Rota</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
