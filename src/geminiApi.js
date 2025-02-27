export const getGeminiResponse = async (text) => {
  const response = await fetch('https://api.google.com/gemini/v1/your-endpoint', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `AIzaSyAI0PpMwk4Il0j9v7cb6r93zYeDapokwPE`
    },
    body: JSON.stringify({ query: text })
  })
  const data = await response.json()
  return data.result
}
