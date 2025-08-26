import React from 'react';
import Card from '../Card';

const DashboardLoading: React.FC = () => {
  return (
    <div className="min-h-screen pt-24 pb-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header do Dashboard */}
        <div className="text-center mb-12">
          <div className="h-16 bg-white/10 rounded-lg mb-4 animate-pulse"></div>
          <div className="h-6 bg-white/10 rounded-lg w-96 mx-auto animate-pulse"></div>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full mx-auto mb-4 animate-pulse"></div>
              <div className="h-6 bg-white/10 rounded-lg mb-2 animate-pulse"></div>
              <div className="h-8 bg-white/10 rounded-lg mb-1 animate-pulse"></div>
              <div className="h-4 bg-white/10 rounded-lg w-24 mx-auto animate-pulse"></div>
            </Card>
          ))}
        </div>

        {/* Ações Rápidas */}
        <Card gradient className="mb-8">
          <div className="h-8 bg-white/10 rounded-lg mb-6 w-48 mx-auto animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-white/10 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </Card>

        {/* Informações do Usuário */}
        <Card className="mb-8">
          <div className="h-8 bg-white/10 rounded-lg mb-6 w-64 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="h-6 bg-white/10 rounded-lg mb-4 w-32 animate-pulse"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 bg-white/10 rounded w-20 animate-pulse"></div>
                    <div className="h-4 bg-white/10 rounded w-24 animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="h-6 bg-white/10 rounded-lg mb-4 w-40 animate-pulse"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 bg-white/10 rounded w-28 animate-pulse"></div>
                    <div className="h-4 bg-white/10 rounded w-20 animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardLoading;
