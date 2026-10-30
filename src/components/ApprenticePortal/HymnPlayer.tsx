import React, { useState } from 'react';
import { SENA_INSTITUTIONAL_INFO } from '../../data/senaData';
import { soundFx } from '../../utils/audioSynth';
import { Play, Square, Music, Sparkles } from 'lucide-react';
import { SenaLogo, SenaEscudo } from '../../assets/senaLogo';

export const HymnPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeStanzaIndex, setActiveStanzaIndex] = useState<number | null>(null);
  const [stopFn, setStopFn] = useState<(() => void) | null>(null);

  const handlePlayAnthem = () => {
    if (isPlaying) {
      if (stopFn) stopFn();
      setIsPlaying(false);
      setActiveStanzaIndex(null);
      return;
    }

    setIsPlaying(true);
    setActiveStanzaIndex(0);

    const cancel = soundFx.playAnthemPreview(() => {
      setIsPlaying(false);
      setActiveStanzaIndex(null);
    });

    setStopFn(() => cancel);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="mb-6 flex items-start gap-4">
        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0 shadow-2xs">
          <SenaEscudo className="w-10 h-10 object-contain" />
          <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
          <SenaLogo className="w-9 h-9 object-contain" />
        </div>
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Identidad Institucional</span>
            <span aria-hidden="true">·</span>
            <span>Símbolos Patrios del SENA</span>
            <span aria-hidden="true">·</span>
            <span>Acuerdo Institucional</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Himno Oficial del SENA
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
            Compuesto por Luis Alfredo Sánchez (letra) y Daniel Marlez (música). El himno infunde el espíritu de superación, trabajo técnico y amor por la patria colombiana.
          </p>
        </div>
      </div>

      {/* Audio Controller Bar */}
      <div className="bg-emerald-900 dark:bg-emerald-950 border border-emerald-800 text-white rounded-xl p-5 mb-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-700 dark:bg-emerald-900 flex items-center justify-center shrink-0">
            <Music className="w-5 h-5 text-emerald-200" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-emerald-300 font-medium">Melodía Institucional</div>
            <div className="text-base font-semibold">Marcha Triunfal del Aprendiz</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePlayAnthem}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-[#39A900] hover:bg-[#329600] text-white transition-colors cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Square className="w-4 h-4 fill-white" />
                <span>Detener Melodía</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Escuchar Acordes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Lyrics Presentation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chorus Card */}
        <div className={`p-6 rounded-xl border transition-all ${
          activeStanzaIndex === 0
            ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 shadow-xs'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#39A900]">
              Coro Principal (Al unísono)
            </span>
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="font-serif text-base leading-relaxed text-slate-800 dark:text-slate-100 whitespace-pre-line italic">
            {SENA_INSTITUTIONAL_INFO.hymn.chorus}
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            Se canta con la mano derecha en el pecho, de pie y con postura de respeto institucional.
          </div>
        </div>

        {/* Stanzas */}
        <div className="space-y-4">
          {SENA_INSTITUTIONAL_INFO.hymn.stanzas.map((stanza) => (
            <div
              key={stanza.number}
              className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors"
            >
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                Estrofa {stanza.number}
              </div>
              <div className="font-serif text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line">
                {stanza.lyrics}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
