import React, { useState } from 'react';
import { Apprentice, Ficha } from '../../types/induction';
import { UserPlus, X, CheckCircle } from 'lucide-react';
import { soundFx } from '../../utils/audioSynth';
import { SenaLogo } from '../../assets/senaLogo';

interface AddApprenticeModalProps {
  activeFicha: Ficha;
  isOpen: boolean;
  onClose: () => void;
  onAddApprentice: (apprentice: Apprentice) => void;
}

export const AddApprenticeModal: React.FC<AddApprenticeModalProps> = ({
  activeFicha,
  isOpen,
  onClose,
  onAddApprentice,
}) => {
  const [name, setName] = useState('');
  const [docType, setDocType] = useState<'CC' | 'TI' | 'CE' | 'PEP'>('CC');
  const [docNumber, setDocNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !docNumber.trim() || !email.trim()) return;

    const newApprentice: Apprentice = {
      id: `app-${Date.now()}`,
      name: name.trim(),
      documentType: docType,
      documentNumber: docNumber.trim(),
      email: email.trim(),
      phone: phone.trim() || '300 000 0000',
      fichaId: activeFicha.id,
      progressPercent: 0,
      completedModules: [],
      evaluationAttempts: 0,
      commitmentSigned: false,
      status: 'no_iniciado',
    };

    onAddApprentice(newApprentice);
    soundFx.playSuccessChime();
    onClose();

    // Reset form
    setName('');
    setDocNumber('');
    setEmail('');
    setPhone('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <SenaLogo className="w-5 h-5" />
            <span className="text-sm font-bold text-slate-800">
              Registrar Nuevo Aprendiz a la Ficha {activeFicha.code}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Nombre Completo del Aprendiz *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Andrés Felipe Gómez Castro"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39A900]"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tipo Doc. *
              </label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value as 'CC' | 'TI' | 'CE' | 'PEP')}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39A900]"
              >
                <option value="CC">Cédula (CC)</option>
                <option value="TI">Tarjeta (TI)</option>
                <option value="CE">Cédula Ext. (CE)</option>
                <option value="PEP">Permiso (PEP)</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Número de Documento *
              </label>
              <input
                type="text"
                required
                placeholder="Ej: 1019283746"
                value={docNumber}
                onChange={(e) => setDocNumber(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39A900]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Correo Institucional o Personal *
            </label>
            <input
              type="email"
              required
              placeholder="Ej: afgomez@soy.sena.edu.co"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39A900]"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Teléfono de Contacto
            </label>
            <input
              type="tel"
              placeholder="Ej: 312 456 7890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39A900]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-[#39A900] hover:bg-[#329600] text-white transition-colors cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Matricular Aprendiz</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
