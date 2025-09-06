import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { SavingsGoals } from './components/SavingsGoals';
import { TransactionHistory } from './components/TransactionHistory';
import { AutoSaveSettings } from './components/AutoSaveSettings';
import { StatsDashboard } from './components/StatsDashboard';

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  color: string;
}

interface Transaction {
  id: string;
  type: 'roundup' | 'manual' | 'goal' | 'investment';
  amount: number;
  description: string;
  date: string;
  originalAmount?: number;
}

interface Settings {
  roundUpEnabled: boolean;
  weeklyAutoSave: boolean;
  weeklyAmount: number;
  investmentPercentage: number;
  maxDailyRoundUp: number;
  autoInvestEnabled: boolean;
}

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Estados de la aplicación
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      name: 'Vacaciones de Verano',
      targetAmount: 3000,
      currentAmount: 1250,
      deadline: '2025-06-15',
      color: 'bg-blue-500'
    },
    {
      id: '2',
      name: 'Fondo de Emergencia',
      targetAmount: 10000,
      currentAmount: 4800,
      deadline: '2025-12-31',
      color: 'bg-green-500'
    },
    {
      id: '3',
      name: 'Nueva Laptop',
      targetAmount: 1500,
      currentAmount: 680,
      deadline: '2025-04-30',
      color: 'bg-purple-500'
    }
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'roundup',
      amount: 0.75,
      description: 'Compra en Starbucks',
      date: '2025-01-15T10:30:00',
      originalAmount: 4.25
    },
    {
      id: '2',
      type: 'roundup',
      amount: 1.20,
      description: 'Supermercado',
      date: '2025-01-15T08:15:00',
      originalAmount: 23.80
    },
    {
      id: '3',
      type: 'manual',
      amount: 50,
      description: 'Ahorro manual',
      date: '2025-01-14T20:00:00'
    },
    {
      id: '4',
      type: 'goal',
      amount: 100,
      description: 'Aporte a Vacaciones de Verano',
      date: '2025-01-14T19:30:00'
    },
    {
      id: '5',
      type: 'investment',
      amount: 200,
      description: 'Inversión automática en ETFs',
      date: '2025-01-13T09:00:00'
    },
    {
      id: '6',
      type: 'roundup',
      amount: 0.45,
      description: 'Gasolina',
      date: '2025-01-13T16:45:00',
      originalAmount: 45.55
    },
    {
      id: '7',
      type: 'manual',
      amount: 75,
      description: 'Ahorro de bonificación',
      date: '2025-01-12T14:20:00'
    }
  ]);

  const [settings, setSettings] = useState<Settings>({
    roundUpEnabled: true,
    weeklyAutoSave: true,
    weeklyAmount: 50,
    investmentPercentage: 20,
    maxDailyRoundUp: 10,
    autoInvestEnabled: true
  });

  // Datos calculados
  const totalSaved = transactions
    .filter(t => t.type !== 'investment')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const todaysSavings = transactions
    .filter(t => {
      const today = new Date().toDateString();
      return new Date(t.date).toDateString() === today && t.type !== 'investment';
    })
    .reduce((sum, t) => sum + t.amount, 0);
  
  const weeklyProgress = transactions
    .filter(t => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(t.date) > weekAgo && t.type !== 'investment';
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyGoal = 500;

  // Datos para estadísticas
  const monthlyData = [
    { month: 'Septiembre', saved: 120, invested: 24 },
    { month: 'Octubre', saved: 180, invested: 36 },
    { month: 'Noviembre', saved: 220, invested: 44 },
    { month: 'Diciembre', saved: 350, invested: 70 },
    { month: 'Enero', saved: totalSaved, invested: 200 }
  ];

  const savingsByType = [
    { name: 'Redondeo', value: 125, color: '#10B981' },
    { name: 'Manual', value: 225, color: '#3B82F6' },
    { name: 'Semanal', value: 200, color: '#8B5CF6' },
    { name: 'Metas', value: 150, color: '#F59E0B' }
  ];

  const weeklyProgressData = [
    { day: 'Lunes', amount: 5.25 },
    { day: 'Martes', amount: 3.80 },
    { day: 'Miércoles', amount: 7.45 },
    { day: 'Jueves', amount: 2.15 },
    { day: 'Viernes', amount: 8.90 },
    { day: 'Sábado', amount: 12.30 },
    { day: 'Domingo', amount: 4.65 }
  ];

  const totalStats = {
    totalSaved: totalSaved,
    totalInvested: 200,
    averageDaily: 8.75,
    bestMonth: 'Diciembre'
  };

  const handleAddGoal = (newGoal: Omit<Goal, 'id'>) => {
    const goal: Goal = {
      ...newGoal,
      id: Date.now().toString()
    };
    setGoals([...goals, goal]);
  };

  // Simular nuevas transacciones de redondeo
  useEffect(() => {
    if (!settings.roundUpEnabled) return;

    const interval = setInterval(() => {
      // Simular una nueva transacción de redondeo ocasionalmente
      if (Math.random() > 0.95) { // 5% de probabilidad cada segundo
        const purchases = [
          { desc: 'Café', original: 3.45 },
          { desc: 'Transporte', original: 12.80 },
          { desc: 'Almuerzo', original: 15.25 },
          { desc: 'Farmacia', original: 8.90 },
          { desc: 'Combustible', original: 45.60 }
        ];
        
        const purchase = purchases[Math.floor(Math.random() * purchases.length)];
        const roundupAmount = Math.ceil(purchase.original) - purchase.original;
        
        if (roundupAmount > 0) {
          const newTransaction: Transaction = {
            id: Date.now().toString(),
            type: 'roundup',
            amount: roundupAmount,
            description: purchase.desc,
            date: new Date().toISOString(),
            originalAmount: purchase.original
          };
          
          setTransactions(prev => [newTransaction, ...prev].slice(0, 50)); // Mantener solo las últimas 50
        }
      }
    }, 30000); // Revisar cada 30 segundos

    return () => clearInterval(interval);
  }, [settings.roundUpEnabled]);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            totalSaved={totalSaved}
            monthlyGoal={monthlyGoal}
            todaysSavings={todaysSavings}
            weeklyProgress={weeklyProgress}
          />
        );
      case 'goals':
        return (
          <SavingsGoals
            goals={goals}
            onAddGoal={handleAddGoal}
          />
        );
      case 'history':
        return (
          <TransactionHistory
            transactions={transactions}
          />
        );
      case 'stats':
        return (
          <StatsDashboard
            monthlyData={monthlyData}
            savingsByType={savingsByType}
            weeklyProgress={weeklyProgressData}
            totalStats={totalStats}
          />
        );
      case 'settings':
        return (
          <AutoSaveSettings
            settings={settings}
            onSettingsChange={setSettings}
          />
        );
      default:
        return <div>Tab no encontrada</div>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-primary">💰 MiAhorro</h1>
            <p className="text-sm text-muted-foreground">Ahorra sin pensar</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Balance Total</p>
            <p className="text-primary">${totalSaved.toFixed(2)}</p>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="pb-20">
        {renderActiveTab()}
      </main>

      {/* Navegación Inferior */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
}