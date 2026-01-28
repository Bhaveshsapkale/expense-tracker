import { useState, useEffect } from 'react'
import { getTransaction, createTransaction, deleteTransaction } from './api'

function App() {
  const [transactions, setTransactions] = useState([])
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('expense')
  const [date, setDate] = useState('')
  const [filter, setFilter] = useState('all')

  const fetchTransaction = async () => {
    try{
      const data = await getTransaction()
      setTransactions(data)
    } catch(error ){
      console.log('Error fetching transaction: ', error)
    }
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!description.trim()) {
      alert('Please add a description')
      return
    }
    if (amount <= 0 || !amount) {
      alert('Amount must be greater than 0')
      return
    }
    const newTransaction = {
      description: description,
      amount: parseFloat(amount),
      category: category,
      date: date || new Date().toISOString().split('T')[0],
    }
    try{
      const savedTransaction = await createTransaction(newTransaction)
      setTransactions([...transactions, savedTransaction])
      setDescription('')
      setAmount('')
      setCategory('income')
      setDate('')
    } catch(error){
      console.log('Error creating transaction:: ', error)
      alert('failed to create transaction')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try{
        deleteTransaction(id)
        setTransactions(transactions.filter(transaction => transaction._id !== id))
      } catch(error){
        console.log('Error deleting transaction: ', error)
        alert('Failed to delete transaction.')
      }

    }
  }

  const totalIncome = transactions.reduce((total, transaction) => {
    return transaction.category === 'income' ? total + transaction.amount : total
  }, 0)

  const totalExpenses = transactions.reduce((total, transaction) => {
    return transaction.category === 'expense' ? total + transaction.amount : total
  }, 0)

  const balance = totalIncome - totalExpenses

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true
    return transaction.category === filter
  }) 

  useEffect(() =>{
    fetchTransaction()
  }, [])


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Expense Tracker</h1>
          <p className="text-slate-600">Manage your income and expenses efficiently</p>
        </header>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <p className="text-sm font-medium text-slate-600 mb-1">Balance</p>
            <p className={`text-3xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              ${balance.toFixed(2)}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <p className="text-sm font-medium text-slate-600 mb-1">Total Income</p>
            <p className="text-3xl font-bold text-green-600">${totalIncome.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
            <p className="text-sm font-medium text-slate-600 mb-1">Total Expenses</p>
            <p className="text-3xl font-bold text-red-600">${totalExpenses.toFixed(2)}</p>
          </div>
        </div>

        {/* Add Transaction Form */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-slate-800 mb-6">Add New Transaction</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>
              <input
                className="w-full bg-white px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-700"
                type="text"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Amount
              </label>
              <input
                className="w-full bg-white px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-700"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="$0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Category
              </label>
              <select
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-slate-700"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Date
              </label>
              <input
                className="w-full bg-white px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-700"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="md:col-span-4">
              <button
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors shadow-md hover:shadow-lg"
                type="submit"
              >
                Add Transaction
              </button>
            </div>
          </form>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-slate-800 mb-6">All Transactions</h2>
          {/* <label htmlFor="filter">Filter</label> */}
          <select name="filter" id="" onChange={(e) => setFilter(e.target.value)} value={filter}
            className=" px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-slate-700"
            >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

        </div>
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 text-lg">No transactions yet</p>
              <p className="text-slate-400 text-sm mt-2">Add your first transaction above</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Description</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Category</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Date</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Amount</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction, index) => (
                    <tr
                      key={transaction.id}
                      className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                      }`}
                    >
                      <td className="py-4 px-4">
                        <p className="font-medium text-slate-800">{transaction.description}</p>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            transaction.category === 'income'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {transaction.category === 'income' ? 'Income' : 'Expense'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-600 text-sm">
                        {transaction.date || 'N/A'}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <p
                          className={`font-semibold ${
                            transaction.category === 'income' ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {transaction.category === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                        </p>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors shadow-sm hover:shadow"
                          onClick={() => handleDelete(transaction.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
