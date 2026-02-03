const API_URL = 'https://expense-tracker-lj0q.onrender.com'

export const getTransaction = async () => {
    const response = await fetch(API_URL)
    return response.json()
}

export const createTransaction = async(transaction) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify(transaction)
    })
    return response.json()
}

export const deleteTransaction = async(id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    }) 
    return response.json()
}