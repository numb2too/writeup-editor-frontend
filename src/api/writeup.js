const API_BASE_URL = 'http://localhost:8080'

export async function getWriteup() {
    const response = await fetch(`${API_BASE_URL}/api/writeup`)
    const result = await response.json()
    if (!result.success) throw new Error(result.message)
    return result.data
}

export async function saveToJson(articles) {
    const response = await fetch(`${API_BASE_URL}/api/saveToJson`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articles)
    })
    const result = await response.json()
    if (!result.success) throw new Error(result.message)
    return result
}

export async function detectNewFolders() {
    const response = await fetch(`${API_BASE_URL}/api/detectNewFolders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    })
    const result = await response.json()
    if (!result.success) throw new Error(result.message)
    return result
}