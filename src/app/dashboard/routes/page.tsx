
'use client';

import { useState, useTransition, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import type { RouteConfig } from '@/lib/types';
import { Copy, MoreHorizontal, PlusCircle, Loader2 } from 'lucide-react';
import { createRoute, getRoutes } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';


const templates = {
    'Facebook Ads': {
        denyUserAgents: `facebookexternalhit/1.1\nFacebot\nfacebookcatalog/1.0`,
        denyIps: `# Facebook / Meta\n31.13.24.0/21\n69.63.176.0/20\n66.220.144.0/20\n69.171.224.0/19\n157.240.0.0/16`,
    },
    'Google Ads': {
        denyUserAgents: `Googlebot\nAdsBot-Google\nGooglebot-Image\nMediapartners-Google`,
        denyIps: `# Googlebot\n66.249.64.0/19\n64.233.160.0/19\n72.14.192.0/18\n203.208.32.0/19\n74.125.0.0/16`,
    },
    'TikTok Ads': {
        denyUserAgents: `TikTokBot`,
        denyIps: `# TikTok\n47.242.0.0/16\n161.117.0.0/16\n170.33.0.0/16`,
    },
};

export default function RoutesPage() {
    const [routes, setRoutes] = useState<RouteConfig[]>([]);
    const [isPending, startTransition] = useTransition();
    
    const fetchRoutes = () => {
        startTransition(async () => {
            const fetchedRoutes = await getRoutes();
            setRoutes(fetchedRoutes);
        });
    }

    useEffect(() => {
        fetchRoutes();
    }, []);

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Rotas Cloaked</CardTitle>
                        <CardDescription>Gerencie e crie suas rotas cloaked.</CardDescription>
                    </div>
                    <CreateRouteDialog onRouteCreated={fetchRoutes}/>
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
                        {isPending && (
                             <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
                                </TableCell>
                            </TableRow>
                        )}
                        {!isPending && routes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    Nenhuma rota criada ainda.
                                </TableCell>
                            </TableRow>
                        ) : (
                            routes.map((route) => (
                                <TableRow key={route.id}>
                                    <TableCell>
                                        <Badge variant={route.active ? 'default' : 'outline'} className={route.active ? 'bg-accent text-accent-foreground' : ''}>
                                            {route.active ? 'Ativo' : 'Inativo'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-mono">/{route.slug}</TableCell>
                                    <TableCell className="hidden md:table-cell font-mono text-xs truncate max-w-xs">{route.redirectBotTo}</TableCell>
                                    <TableCell className="hidden lg:table-cell font-mono text-xs truncate max-w-xs">{route.realUrl}</TableCell>
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

const routeSchema = z.object({
  slug: z.string().min(1, 'Slug é obrigatório.').regex(/^[a-z0-9-]+$/, 'Use apenas letras minúsculas, números e hifens.'),
  realUrl: z.string().url('URL de destino inválida.'),
  redirectBotTo: z.string().url('URL de redirecionamento inválida.'),
  behavior: z.enum(['block', 'allow']),
  denyUserAgents: z.string().optional(),
  denyIps: z.string().optional(),
});

type RouteFormValues = z.infer<typeof routeSchema>;

function CreateRouteDialog({ onRouteCreated }: { onRouteCreated: () => void }) {
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const form = useForm<RouteFormValues>({
        resolver: zodResolver(routeSchema),
        defaultValues: {
            slug: '',
            realUrl: '',
            redirectBotTo: 'https://google.com',
            behavior: 'block',
            denyUserAgents: '',
            denyIps: '',
        },
    });

    const applyTemplate = (templateName: keyof typeof templates) => {
        const template = templates[templateName];
        form.setValue('denyUserAgents', template.denyUserAgents);
        form.setValue('denyIps', template.denyIps);
    };

    const onSubmit: SubmitHandler<RouteFormValues> = (data) => {
        startTransition(async () => {
            const result = await createRoute(data);
            if (result.success) {
                toast({
                    title: 'Sucesso!',
                    description: `A rota /${result.route?.slug} foi criada.`,
                });
                onRouteCreated();
                setIsOpen(false);
                form.reset();
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Erro ao criar rota',
                    description: result.error,
                });
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                <div className="flex gap-2 mb-4 pt-4">
                    <Button variant="outline" size="sm" onClick={() => applyTemplate('Facebook Ads')}>Modelo Facebook Ads</Button>
                    <Button variant="outline" size="sm" onClick={() => applyTemplate('Google Ads')}>Modelo Google Ads</Button>
                    <Button variant="outline" size="sm" onClick={() => applyTemplate('TikTok Ads')}>Modelo TikTok Ads</Button>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                        <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-4 items-center gap-4">
                                    <FormLabel className="text-right">Slug</FormLabel>
                                    <div className="col-span-3">
                                        <FormControl>
                                            <Input placeholder="meu-produto-incrivel" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="realUrl"
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-4 items-center gap-4">
                                    <FormLabel className="text-right">URL de Destino (Humano)</FormLabel>
                                    <div className="col-span-3">
                                        <FormControl>
                                            <Input placeholder="https://seusite.com/oferta" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="redirectBotTo"
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-4 items-center gap-4">
                                    <FormLabel className="text-right">URL de Redirecionamento (Bot)</FormLabel>
                                    <div className="col-span-3">
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="behavior"
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-4 items-center gap-4">
                                    <FormLabel className="text-right">Comportamento</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="col-span-3">
                                                <SelectValue placeholder="Selecione o comportamento" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="block">Bloquear todos os bots (recomendado)</SelectItem>
                                            <SelectItem value="allow">Permitir todos os bots (cloaking desativado)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="denyUserAgents"
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-4 items-start gap-4">
                                    <FormLabel className="text-right pt-2">Negar User Agents</FormLabel>
                                    <div className="col-span-3">
                                        <FormControl>
                                            <Textarea placeholder="facebookexternalhit/1.1" className="min-h-[80px]" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="denyIps"
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-4 items-start gap-4">
                                    <FormLabel className="text-right pt-2">Negar IPs</FormLabel>
                                    <div className="col-span-3">
                                        <FormControl>
                                            <Textarea placeholder="66.249.64.0/19" className="min-h-[80px]" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="ghost">Cancelar</Button>
                            </DialogClose>
                            <Button type="submit" disabled={isPending}>
                                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Salvar Rota
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

    