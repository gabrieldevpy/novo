
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Bot, FileDown, Filter, User, Route as RouteIcon, Users, ShieldAlert, Loader2 } from 'lucide-react';
import type { LogEntry } from '@/lib/types';
import Link from 'next/link';
import { useEffect, useState, useTransition } from 'react';
import { getDashboardStats, type DashboardStats } from './actions';
import { Badge } from '@/components/ui/badge';

const initialState: DashboardStats = {
  totalAccesses: 0,
  botsBlocked: 0,
  humanAccesses: 0,
  activeRoutes: 0,
  recentLogs: [],
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(initialState);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const fetchedStats = await getDashboardStats();
      setStats(fetchedStats);
    });
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Acessos Totais</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isPending ? <Loader2 className="h-6 w-6 animate-spin" /> : <div className="text-2xl font-bold">{stats.totalAccesses}</div>}
            <p className="text-xs text-muted-foreground">Humanos e bots combinados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Bots Bloqueados</CardTitle>
            <Bot className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isPending ? <Loader2 className="h-6 w-6 animate-spin" /> : <div className="text-2xl font-bold">{stats.botsBlocked}</div>}
            <p className="text-xs text-muted-foreground">Acessos de bots identificados</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Acessos Humanos</CardTitle>
            <User className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {isPending ? <Loader2 className="h-6 w-6 animate-spin" /> : <div className="text-2xl font-bold">{stats.humanAccesses}</div>}
            <p className="text-xs text-muted-foreground">Acessos legítimos permitidos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Rotas Ativas</CardTitle>
            <RouteIcon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isPending ? <Loader2 className="h-6 w-6 animate-spin" /> : <div className="text-2xl font-bold">{stats.activeRoutes}</div>}
            <p className="text-xs text-muted-foreground">Gerencie suas rotas cloaked</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle>Logs de Atividade Recentes</CardTitle>
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <div className="flex items-center space-x-2">
                <Switch id="emergency-mode" />
                <Label htmlFor="emergency-mode" className="text-destructive flex items-center gap-1"><ShieldAlert className="w-4 h-4" /> Modo de Emergência</Label>
              </div>
              <Button asChild variant="outline">
                <Link href="/dashboard/check">Fazer Verificação Manual</Link>
              </Button>
              <div className="flex gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 gap-1">
                        <Filter className="w-3.5 h-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Filtrar</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Endereço IP</DropdownMenuItem>
                      <DropdownMenuItem>Rota</DropdownMenuItem>
                      <DropdownMenuItem>Tipo (Bot/Humano)</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <FileDown className="w-3.5 h-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Exportar</span>
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-4">
              <Input placeholder="Filtrar por IP, rota, user agent..." />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Endereço IP</TableHead>
                  <TableHead>Rota</TableHead>
                  <TableHead className="hidden md:table-cell">User Agent</TableHead>
                  <TableHead className="hidden sm:table-cell">Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isPending && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                       <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                )}
                {!isPending && stats.recentLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Nenhum log de atividade encontrado. Crie uma rota e acesse-a para ver os dados aqui.
                    </TableCell>
                  </TableRow>
                ) : (
                  stats.recentLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <Badge variant={log.type === 'bot' ? 'destructive' : 'default'} className={log.type === 'human' ? "border-accent text-accent-foreground" : ""}>
                           <div className="flex items-center gap-2">
                              {log.type === 'bot' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                              <span className="capitalize">{log.botType || log.type}</span>
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono">{log.ip}</TableCell>
                      <TableCell className="font-mono">/r/{log.route}</TableCell>
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
