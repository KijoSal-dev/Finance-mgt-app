import React, { useState } from 'react';
import { 
  PlusCircle, Wallet, TrendingUp, Target, CreditCard, 
  ShoppingBag, Car, Home, Coffee, Gamepad2, MoreHorizontal, 
  ArrowUpRight, ArrowDownRight, Edit3, Trash2, Check, X,
  PieChart as PieChartIcon, BarChart3, Goal
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Area, AreaChart } from 'recharts';
import './App.css';

const FinanceApp = () => {
  // Show intro card first
  const [started, setStarted] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const [transactions, setTransactions] = useState([
    { id: 1, type: 'expense', amount: 85.50, category: 'Food', description: 'Grocery shopping', date: '2024-05-24', icon: 'ShoppingBag' },
    { id: 2, type: 'income', amount: 3200.00, category: 'Salary', description: 'Monthly salary', date: '2024-05-23', icon: 'Wallet' },
    { id: 3, type: 'expense', amount: 45.20, category: 'Transport', description: 'Gas station', date: '2024-05-22', icon: 'Car' },
    { id: 4, type: 'expense', amount: 12.80, category: 'Food', description: 'Coffee shop', date: '2024-05-22', icon: 'Coffee' },
    { id: 5, type: 'expense', amount: 890.00, category: 'Housing', description: 'Rent payment', date: '2024-05-21', icon: 'Home' },
    { id: 6, type: 'expense', amount: 29.99, category: 'Entertainment', description: 'Streaming service', date: '2024-05-20', icon: 'Gamepad2' }
  ]);

  const [budgets, setBudgets] = useState([
    { category: 'Food', allocated: 400, spent: 98.30, color: '#10B981' },
    { category: 'Transport', allocated: 200, spent: 45.20, color: '#3B82F6' },
    { category: 'Entertainment', allocated: 150, spent: 29.99, color: '#8B5CF6' },
    { category: 'Housing', allocated: 1000, spent: 890.00, color: '#EF4444' },
    { category: 'Shopping', allocated: 300, spent: 0, color: '#F59E0B' }
  ]);

  const [goals, setGoals] = useState([
    { id: 1, title: 'Emergency Fund', target: 5000, current: 2350, color: '#10B981' },
    { id: 2, title: 'Vacation', target: 2000, current: 480, color: '#3B82F6' },
    { id: 3, title: 'New Laptop', target: 1500, current: 750, color: '#8B5CF6' }
  ]);

  const [newTransaction, setNewTransaction] = useState({
    type: 'expense',
    amount: '',
    category: 'Food',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [newGoal, setNewGoal] = useState({
    title: '',
    target: '',
    current: ''
  });

  const categoryIcons = {
    Food: ShoppingBag,
    Transport: Car,
    Entertainment: Gamepad2,
    Housing: Home,
    Shopping: ShoppingBag,
    Salary: Wallet,
    Coffee: Coffee
  };

  const categoryColors = {
    Food: '#10B981',
    Transport: '#3B82F6',
    Entertainment: '#8B5CF6',
    Housing: '#EF4444',
    Shopping: '#F59E0B',
    Salary: '#10B981'
  };

  // Calculate totals
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  // Prepare chart data
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const pieChartData = Object.entries(expensesByCategory).map(([category, amount]) => ({
    name: category,
    value: amount,
    color: categoryColors[category] || '#6B7280'
  }));

  const weeklyData = [
    { day: 'Mon', income: 0, expenses: 45 },
    { day: 'Tue', income: 3200, expenses: 98 },
    { day: 'Wed', income: 0, expenses: 30 },
    { day: 'Thu', income: 0, expenses: 85 },
    { day: 'Fri', income: 0, expenses: 12 },
    { day: 'Sat', income: 0, expenses: 890 },
    { day: 'Sun', income: 0, expenses: 0 }
  ];

  const handleAddTransaction = () => {
    if (!newTransaction.amount || !newTransaction.description) return;
    const transaction = {
      id: Date.now(),
      ...newTransaction,
      amount: parseFloat(newTransaction.amount),
      icon: categoryIcons[newTransaction.category]?.name || 'MoreHorizontal'
    };
    setTransactions([transaction, ...transactions]);
    setNewTransaction({
      type: 'expense',
      amount: '',
      category: 'Food',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
    setShowAddTransaction(false);
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setNewTransaction({
      type: transaction.type,
      amount: transaction.amount.toString(),
      category: transaction.category,
      description: transaction.description,
      date: transaction.date
    });
    setShowAddTransaction(true);
  };

  const handleUpdateTransaction = () => {
    if (!newTransaction.amount || !newTransaction.description) return;
    const updatedTransaction = {
      ...editingTransaction,
      ...newTransaction,
      amount: parseFloat(newTransaction.amount)
    };
    setTransactions(transactions.map(t =>
      t.id === editingTransaction.id ? updatedTransaction : t
    ));
    setEditingTransaction(null);
    setNewTransaction({
      type: 'expense',
      amount: '',
      category: 'Food',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
    setShowAddTransaction(false);
  };

  const handleDeleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const handleAddGoal = () => {
    if (!newGoal.title || !newGoal.target) return;
    const goal = {
      id: Date.now(),
      ...newGoal,
      target: parseFloat(newGoal.target),
      current: parseFloat(newGoal.current || 0),
      color: ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B'][goals.length % 4]
    };
    setGoals([...goals, goal]);
    setNewGoal({ title: '', target: '', current: '' });
    setShowAddGoal(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getIcon = (iconName) => {
    const icons = {
      ShoppingBag,
      Car,
      Gamepad2,
      Home,
      Wallet,
      Coffee,
      MoreHorizontal
    };
    return icons[iconName] || MoreHorizontal;
  };

  // Navigation Tabs Component - Improved Version
const NavigationTabs = () => (
  <div className="flex items-center bg-white rounded-2xl p-4 shadow-sm border border-slate-400">
    {[
      { id: 'dashboard', icon: TrendingUp, label: 'Dashboard' },
      { id: 'transactions', icon: CreditCard, label: 'Transactions' },
      { id: 'budgets', icon: BarChart3, label: 'Budgets' },
      { id: 'goals', icon: Goal, label: 'Goals' }
    ].map((tab, index) => (
      <React.Fragment key={tab.id}>
        <button
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center space-x-2 px-5 py-3 rounded-xl transition-all duration-300 ${
            activeTab === tab.id
              ? 'bg-blue-50 text-blue-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <tab.icon size={25} />
          <span className="font-medium">{tab.label}</span>
        </button>
        {index < 3 && (
          <div className="w-px h-6 bg-slate-200 mx-1"></div>
        )}
      </React.Fragment>
    ))}
  </div>
);

  // Intro Card
  if (!started) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-2">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center transform transition-all duration-200 hover:scale-[1.02]">
          <div className="w-5 h-5 bg-blue-80 rounded-full flex items-center justify-center mx-auto mb-5">
            <img
              src="image1.png"
              alt="Finance Logo"
              className="w-16 h-16 object-contain rounded-full shadow"
            />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">FinanceFlow</h1>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Your personal finance companion. Track your income, expenses, budgets, and goals in one place.
          </p>
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3.5 rounded-xl transition-colors duration-300 shadow-md hover:shadow-lg"
            onClick={() => setStarted(true)}
          >
            Get Started
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                                <h1 className="text-xl font-bold text-slate-900">FinanceFlow</h1>
              </div>
            </div>
            <NavigationTabs />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-100 text-sm font-medium">Total Balance</p>
                    <p className="text-3xl font-bold mt-1">{formatCurrency(balance)}</p>
                  </div>
                  <Wallet className="w-10 h-10 text-emerald-200 opacity-90" />
                </div>
                <div className="flex items-center mt-6 text-emerald-100">
                  <ArrowUpRight size={16} />
                  <span className="ml-1 text-sm">+12.5% this month</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Income</p>
                    <p className="text-3xl font-bold mt-1">{formatCurrency(totalIncome)}</p>
                  </div>
                  <ArrowUpRight className="w-10 h-10 text-blue-200 opacity-90" />
                </div>
                <div className="flex items-center mt-6 text-blue-100">
                  <ArrowUpRight size={16} />
                  <span className="ml-1 text-sm">+5.2% from last month</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-rose-500 to-rose-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-rose-100 text-sm font-medium">Expenses</p>
                    <p className="text-3xl font-bold mt-1">{formatCurrency(totalExpenses)}</p>
                  </div>
                  <ArrowDownRight className="w-10 h-10 text-rose-200 opacity-90" />
                </div>
                <div className="flex items-center mt-6 text-rose-100">
                  <ArrowDownRight size={16} />
                  <span className="ml-1 text-sm">-2.1% from last month</span>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Spending by Category */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-slate-900">Spending by Category</h3>
                  <PieChartIcon className="w-5 h-5 text-slate-400" />
                </div>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        labelLine={false}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Weekly Overview */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-slate-900">Weekly Overview</h3>
                  <TrendingUp className="w-5 h-5 text-slate-400" />
                </div>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="day" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Area
                        type="monotone"
                        dataKey="income"
                        stackId="1"
                        stroke="#10B981"
                        fill="url(#incomeGradient)"
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="expenses"
                        stackId="2"
                        stroke="#EF4444"
                        fill="url(#expenseGradient)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-center space-x-6 mt-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <span className="text-sm text-slate-600">Income</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <span className="text-sm text-slate-600">Expenses</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Recent Transactions</h3>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center"
                >
                  View All
                  <ArrowUpRight size={16} className="ml-1" />
                </button>
              </div>
              <div className="divide-y divide-slate-200">
                {transactions.slice(0, 5).map(transaction => {
                  const IconComponent = getIcon(transaction.icon);
                  return (
                    <div
                      key={transaction.id}
                      className="py-4 first:pt-0 last:pb-0 flex items-center justify-between group hover:bg-slate-50 -mx-2 px-2 rounded-lg transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: `${categoryColors[transaction.category]}20` }}
                        >
                          <IconComponent
                            size={18}
                            style={{ color: categoryColors[transaction.category] }}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{transaction.description}</p>
                          <p className="text-sm text-slate-500">{transaction.category} • {transaction.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Transactions</h2>
                <p className="text-slate-600 mt-1">Manage your income and expenses</p>
              </div>
              <button
                onClick={() => setShowAddTransaction(true)}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl transition-colors shadow-md"
              >
                <PlusCircle size={20} />
                <span>Add Transaction</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="divide-y divide-slate-200">
                {transactions.map(transaction => {
                  const IconComponent = getIcon(transaction.icon);
                  return (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 group hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: `${categoryColors[transaction.category]}20` }}
                        >
                          <IconComponent
                            size={18}
                            style={{ color: categoryColors[transaction.category] }}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{transaction.description}</p>
                          <p className="text-sm text-slate-500">{transaction.category} • {transaction.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className={`font-semibold ${
                            transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEditTransaction(transaction)}
                            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteTransaction(transaction.id)}
                            className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Budgets Tab */}
        {activeTab === 'budgets' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Budget Overview</h2>
              <p className="text-slate-600 mt-1">Track your spending against budgets</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {budgets.map((budget, index) => {
                const percentage = (budget.spent / budget.allocated) * 100;
                return (
                  <div key={index} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-slate-900">{budget.category}</h3>
                      <div className="text-right">
                        <p className="text-sm text-slate-500">
                          {formatCurrency(budget.spent)} / {formatCurrency(budget.allocated)}
                        </p>
                        <p className={`text-sm font-medium ${
                          percentage > 80 ? 'text-red-600' : percentage > 60 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {percentage.toFixed(1)}% used
                        </p>
                      </div>
                    </div>
                    
                    <div className="w-full bg-slate-200 rounded-full h-2.5 mb-4">
                      <div
                        className="h-2.5 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(percentage, 100)}%`,
                          backgroundColor: percentage > 80 ? '#EF4444' : percentage > 60 ? '#F59E0B' : budget.color
                        }}
                      />
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Remaining</span>
                      <span className={`font-medium ${
                        budget.allocated - budget.spent < 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {formatCurrency(budget.allocated - budget.spent)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">Budget Performance</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={budgets} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="category" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Bar dataKey="allocated" fill="#E5E7EB" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="spent" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center space-x-6 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-300 rounded-full" />
                  <span className="text-sm text-slate-600">Allocated</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  <span className="text-sm text-slate-600">Spent</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Goals Tab */}
        {activeTab === 'goals' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Financial Goals</h2>
                <p className="text-slate-600 mt-1">Track your savings progress</p>
              </div>
              <button
                onClick={() => setShowAddGoal(true)}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl transition-colors shadow-md"
              >
                <PlusCircle size={20} />
                <span>Add Goal</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {goals.map(goal => {
                const percentage = (goal.current / goal.target) * 100;
                return (
                  <div key={goal.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-slate-900">{goal.title}</h3>
                      <Target className="w-5 h-5 text-slate-400" />
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-slate-600 mb-2">
                        <span>Saved</span>
                        <span>Target</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2.5">
                        <div
                          className="h-2.5 rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(percentage, 100)}%`,
                            backgroundColor: goal.color
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-sm text-slate-600 mt-2">
                        <span>{formatCurrency(goal.current)}</span>
                        <span>{formatCurrency(goal.target)}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                      <span className="text-sm text-slate-600">{percentage.toFixed(1)}% complete</span>
                      <span className="text-sm font-medium text-slate-900">
                        {formatCurrency(goal.target - goal.current)} to go
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Add Transaction Modal */}
      {showAddTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md animate-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-900">
                {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
              </h3>
              <button
                onClick={() => {
                  setShowAddTransaction(false);
                  setEditingTransaction(null);
                  setNewTransaction({
                    type: 'expense',
                    amount: '',
                    category: 'Food',
                    description: '',
                    date: new Date().toISOString().split('T')[0]
                  });
                }}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Type Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setNewTransaction({...newTransaction, type: 'expense'})}
                    className={`flex-1 py-3 px-4 rounded-xl border transition-colors ${
                      newTransaction.type === 'expense'
                        ? 'bg-red-50 border-red-200 text-red-700'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Expense
                  </button>
                  <button
                    onClick={() => setNewTransaction({...newTransaction, type: 'income'})}
                    className={`flex-1 py-3 px-4 rounded-xl border transition-colors ${
                      newTransaction.type === 'income'
                        ? 'bg-green-50 border-green-200 text-green-700'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Income
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                <select
                  value={newTransaction.category}
                  onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {newTransaction.type === 'expense' ? (
                    <>
                      <option value="Food">Food</option>
                      <option value="Transport">Transport</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Housing">Housing</option>
                      <option value="Shopping">Shopping</option>
                    </>
                  ) : (
                    <>
                      <option value="Salary">Salary</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Investment">Investment</option>
                      <option value="Other">Other</option>
                    </>
                  )}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <input
                  type="text"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter description"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
                <input
                  type="date"
                  value={newTransaction.date}
                  onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddTransaction(false);
                  setEditingTransaction(null);
                  setNewTransaction({
                    type: 'expense',
                    amount: '',
                    category: 'Food',
                    description: '',
                    date: new Date().toISOString().split('T')[0]
                  });
                }}
                className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={editingTransaction ? handleUpdateTransaction : handleAddTransaction}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Check size={18} />
                <span>{editingTransaction ? 'Update' : 'Add'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Goal Modal */}
      {showAddGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md animate-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-900">Add New Goal</h3>
              <button
                onClick={() => {
                  setShowAddGoal(false);
                  setNewGoal({ title: '', target: '', current: '' });
                }}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Goal Title</label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Emergency Fund"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Target Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={newGoal.target}
                  onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Current Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={newGoal.current}
                  onChange={(e) => setNewGoal({...newGoal, current: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddGoal(false);
                  setNewGoal({ title: '', target: '', current: '' });
                }}
                className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddGoal}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Check size={18} />
                <span>Add Goal</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceApp;