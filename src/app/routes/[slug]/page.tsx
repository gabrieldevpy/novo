import { PartyPopper } from "lucide-react";

export default function RealContentPage({ params }: { params: { slug: string } }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-teal-500 text-white text-center p-4">
        <PartyPopper className="w-24 h-24 mb-4" />
      <h1 className="text-5xl font-bold">Bem-vindo, Usuário Valioso!</h1>
      <p className="mt-4 text-xl">Você acessou com sucesso o conteúdo real para a rota:</p>
      <p className="mt-2 text-2xl font-mono bg-teal-600 px-4 py-2 rounded-lg">{params.slug}</p>
      <p className="mt-6 text-lg">Esta é a página legítima "whitehat".</p>
    </div>
  );
}
