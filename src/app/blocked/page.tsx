import { Bot } from "lucide-react";

export default function BlockedPage() {
  return (
    <>
      <meta httpEquiv="refresh" content="3;url=https://google.com" />
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground text-center p-4">
        <Bot className="w-24 h-24 text-destructive mb-4" />
        <h1 className="text-4xl font-bold">Acesso Restrito</h1>
        <p className="mt-4 text-lg text-muted-foreground">Nossos sistemas identificaram esta solicitação como tráfego automatizado.</p>
        <p className="mt-1 text-muted-foreground">Você será redirecionado para uma página segura em breve.</p>
      </div>
    </>
  );
}
