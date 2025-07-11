'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { checkMyStatus, type CheckResult } from './actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Bot, Loader2, Shield, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function CheckPage() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<CheckResult | null>(null);

  const handleCheck = () => {
    startTransition(async () => {
      const checkResult = await checkMyStatus();
      setResult(checkResult);
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Verificação Manual de Bot</CardTitle>
          <CardDescription>
            Verifique o status da sua conexão atual. Esta ferramenta analisa a assinatura do seu navegador para determinar se você aparece como um humano ou um bot.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button onClick={handleCheck} disabled={isPending} size="lg">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verificando...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Verificar Meu Status
              </>
            )}
          </Button>

          {result && (
            <div className="mt-6 text-left">
              <Alert variant={result.isBot ? 'destructive' : 'default'} className={!result.isBot ? "border-accent" : ""}>
                {result.isBot ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                <AlertTitle className="flex items-center gap-2">
                  {result.isBot ? 'Resultado: Bot Detectado' : 'Resultado: Humano Verificado'}
                  <Badge variant="outline">{Math.round(result.confidence * 100)}% de confiança</Badge>
                  {result.botType && <Badge variant="secondary">{result.botType}</Badge>}
                </AlertTitle>
                <AlertDescription className="mt-2">
                  <p className="font-semibold mb-2">{result.isBot ? "Você seria bloqueado pelo cloaker." : "Você está passando como um humano."}</p>
                  <p className="text-sm text-muted-foreground mb-4">{result.reason}</p>
                  <div className="p-2 bg-muted/50 rounded-md">
                    <p className="text-xs font-semibold">Seu User Agent:</p>
                    <p className="text-xs font-mono break-all text-muted-foreground">{result.userAgent}</p>
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
