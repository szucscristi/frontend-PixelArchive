import axios from 'axios'

/**
 * @param {string} text   original English text
 * @param {string} target e.g. 'RO'
 * @returns {Promise<string>} the translated text
 */
export async function translateText(text, target) {
  const { data } = await axios.post('/api/translate', {
    text,
    target
  })
  return data.translated
}
