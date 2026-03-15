/**
 * Safe JSON parser that handles non-JSON responses
 * @param response The fetch response object
 * @returns Parsed JSON data
 */
export async function safeJsonParse(response: Response) {
  // Check if the response is OK
  if (!response.ok) {
    // Handle error responses
    try {
      const errorJson = await response.json();
      throw new Error(errorJson.message || `API error: ${response.status}`);
    } catch (jsonError) {
      // If response isn't JSON, use text instead
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText.substring(0, 200)}`);
    }
  }

  // Check content type to ensure we're getting JSON
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  } else {
    const text = await response.text();
    try {
      // Try to parse as JSON anyway in case Content-Type is wrong
      return JSON.parse(text);
    } catch {
      throw new Error(`Expected JSON but got: ${text.substring(0, 100)}...`);
    }
  }
}

/**
 * Fetch wrapper with built-in error handling and JSON parsing
 */
export async function fetchJson<T = any>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, options);
    return await safeJsonParse(response) as T;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}
