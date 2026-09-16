"use client";

import { FaEnvelope, FaWhatsapp, FaArrowUpRightFromSquare } from "react-icons/fa6";

export default function CinemaxBlockedPage() {
  const email = "e.mena.baptista@gmail.com";
  const whatsappNumber = "927450909";
  const portfolioUrl = "https://eduardomena.vercel.app";

  return (
    <div className="min-h-screen w-full bg-[#121212] text-white flex flex-col items-center justify-center px-6 py-12 font-sans">
      {/* Conteúdo Principal */}
      <main className="w-full max-w-2xl flex flex-col gap-4 items-center text-center">
        {/* Título Principal */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">
          Olá, Humano!
        </h1>

        {/* Descrição em texto limpo sem backgrounds ou bordas */}
        <div className="w-[30rem] max-w-full mb-8 text-center">
          <p className="font-mono text-gray-100 text-sm md:text-base leading-relaxed">
            Este projecto foi desenvolvido por{" "}
            <strong className="text-white underline decoration-green-500 decoration-2">
              Eduardo Mena Baptista
            </strong>{" "}
            como proposta de aplicativo de venda de bilhetes para o{" "}
            <span className="text-white font-semibold">Cinemaz</span> e o{" "}
            <span className="text-white font-semibold">Zap Cinemas</span>. Entre em Contacto para saber mais:
          </p>
        </div>

        {/* Botões de Contacto Directo */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mb-4">
          {/* Botão Email */}
          <a
            href={`mailto:${email}`}
            className="w-[10rem] flex items-center justify-center gap-3 py-2.5 border-2 border-white text-white font-mono text-xs md:text-sm uppercase tracking-wider font-bold hover:bg-white hover:text-black transition-all duration-300"
          >
            <FaEnvelope className="text-base" />
            <span>E-mail</span>
          </a>

          {/* Botão WhatsApp */}
          <a
            href={`https://wa.me/244${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-[10rem] flex items-center justify-center gap-3 py-2.5 bg-green-600 border-2 border-green-500 text-white font-mono text-xs md:text-sm uppercase tracking-wider font-bold hover:bg-green-500 transition-all duration-300"
          >
            <FaWhatsapp className="text-lg" />
            <span>WhatsApp</span>
          </a>
        </div>
      </main>

      {/* Footer minimalista */}
      <footer className="text-center text-gray-600 font-mono text-xs pt-8">
        {/* Secção Veja o meu trabalho */}
        <div className="flex flex-col items-center gap-3">
          <span className="text-gray-500 font-mono text-xs uppercase tracking-widest pb-2">
            Veja o meu trabalho:_
            <a
              href={portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-xs gap-2 text-green-400 font-mono hover:text-green-300 transition-colors group underline underline-offset-8 decoration-green-500/50 hover:decoration-green-400"
            >
              <span> eduardomena.vercel.app</span>
              <FaArrowUpRightFromSquare className="text-xs transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </span>
        </div>
        © {new Date().getFullYear()} Eduardo Mena Baptista • Cinemax Prototype
      </footer>
    </div>
  );
}
