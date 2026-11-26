import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Target, Compass, Award } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">
            Brand Identity & Philosophy
          </span>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter text-white">
            KARYA LOKAL,<br />
            <span className="text-zinc-500">RASA ANAK MUDA.</span>
          </h1>
          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
            KALARA DISTRO lahir di Bandung dari keinginan mendalam untuk mengubah cara generasi muda
            memandang streetwear lokal Indonesia: berani, presisi, dan tidak berkompromi pada kualitas.
          </p>
        </div>

        {/* Narrative Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="aspect-[4/5] bg-zinc-950 border border-zinc-800 overflow-hidden relative">
            <img
              src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop"
              alt="Streetwear Studio"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-6 text-sm text-zinc-400 font-light leading-relaxed">
            <h2 className="text-2xl font-black uppercase tracking-tight text-white">
              Bukan Sekadar Pakaian, Ini Representasi Jati Diri
            </h2>
            <p>
              Tagline kami — <span className="text-white font-semibold">"WEAR YOUR STYLE, SHOW YOUR IDENTITY"</span> —
              bukan sekadar slogan pemasaran. Ini adalah manifestasi dari kebebasan berekspresi pemuda masa kini
              yang ingin tampil berani di ruang urban.
            </p>
            <p>
              Setiap helai kain katun heavyweight 240+ GSM kami lewati proses pemilihan ketat, mulai dari knitting
              lokal Jawa Barat, teknik pewarnaan reactive dye yang awet, hingga jahitan rantai berstandar ekspor.
            </p>
            <div className="border-l-2 border-white pl-4 text-xs font-mono text-zinc-300">
              "Kami merancang setiap potongan pakaian seolah kami sendiri yang akan memakainya di atas panggung kehidupan jalanan setiap hari."
            </div>
          </div>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-zinc-900">
          <div className="bg-zinc-950 border border-zinc-900 p-8 space-y-3">
            <Target size={24} className="text-white" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Visi Kami</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Menjadi pionir brand streetwear independen lokal terdepan yang mengangkat identitas budaya pemuda Indonesia ke ranah global.
            </p>
          </div>
          <div className="bg-zinc-950 border border-zinc-900 p-8 space-y-3">
            <Compass size={24} className="text-white" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Dedikasi Material</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Mengutamakan katun combed 240 GSM, fleece 380 GSM, dan YKK hardware untuk memastikan ketahanan dan siluet boxy yang kokoh.
            </p>
          </div>
          <div className="bg-zinc-950 border border-zinc-900 p-8 space-y-3">
            <Award size={24} className="text-white" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Komunitas & Kreativitas</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Mendukung kolaborasi dengan ilustrator independen, musisi underground, dan fotografer jalanan lokal Bandung.
            </p>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center pt-10">
          <Link
            to="/shop"
            className="inline-flex items-center space-x-2 bg-white text-black font-black uppercase tracking-widest text-xs px-8 py-4 hover:bg-zinc-200 transition-all shadow-xl"
          >
            <span>Jelajahi Koleksi KALARA Sekarang</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};
