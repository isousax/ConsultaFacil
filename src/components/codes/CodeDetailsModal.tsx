import { useEffect, useState } from 'react';
import { X, Calendar, User, MapPin, FileText, Hash, Loader2 } from 'lucide-react';
import { codesService } from '../../services/codesService';
import type { CodeDetails } from '../../types';
import { Card } from '../ui/Card';
import { clsx } from 'clsx';

interface CodeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  codeId: string;
  codeNumber: string;
}

export const CodeDetailsModal = ({ isOpen, onClose, codeId, codeNumber }: CodeDetailsModalProps) => {
  const [details, setDetails] = useState<CodeDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && codeId) {
      loadDetails();
    }
  }, [isOpen, codeId]);

  const loadDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await codesService.getCodeDetails(codeId);
      setDetails(response.details);
    } catch (err) {
      setError('Erro ao carregar detalhes da consulta');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="absolute inset-0" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Detalhes da Consulta</h2>
              <p className="text-blue-100 text-sm mt-1">Código: {codeNumber}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-600">Carregando detalhes...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-2xl flex items-center justify-center">
                <X className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Erro ao carregar</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={loadDetails}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          ) : details ? (
            <div className="space-y-4">
              {/* Paciente */}
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-blue-700 uppercase tracking-wider mb-1">
                      Paciente
                    </p>
                    <p className="text-lg font-bold text-gray-900 break-words">
                      {details.patientName}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Procedimento */}
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-600 rounded-lg">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-purple-700 uppercase tracking-wider mb-1">
                      Procedimento
                    </p>
                    <p className="text-base font-semibold text-gray-900 break-words">
                      {details.procedure}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Datas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-200">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-600 rounded-lg">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-green-700 uppercase tracking-wider mb-1">
                        Data da Solicitação
                      </p>
                      <p className="text-base font-bold text-gray-900">
                        {details.requestDate}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-200">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-orange-600 rounded-lg">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-orange-700 uppercase tracking-wider mb-1">
                        Data da Consulta
                      </p>
                      <p className="text-base font-bold text-gray-900">
                        {details.appointmentDate}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Locais */}
              <Card className="bg-gradient-to-br from-gray-50 to-gray-100/50 border-gray-200">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-600 rounded-lg">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-700 uppercase tracking-wider mb-1">
                        Unidade Solicitante
                      </p>
                      <p className="text-base font-semibold text-gray-900 break-words">
                        {details.requestingUnit}
                      </p>
                    </div>
                  </div>

                  <div className="h-px bg-gray-300"></div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-600 rounded-lg">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-700 uppercase tracking-wider mb-1">
                        Local de Atendimento
                      </p>
                      <p className="text-base font-semibold text-gray-900 break-words">
                        {details.serviceLocation}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* ID Interno */}
              <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 border-indigo-200">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-indigo-600 rounded-lg">
                    <Hash className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-indigo-700 uppercase tracking-wider mb-1">
                      ID Interno
                    </p>
                    <p className="text-base font-mono font-bold text-gray-900">
                      {details.internalId}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 rounded-b-2xl border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
