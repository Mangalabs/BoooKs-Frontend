const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export class ApiError extends Error {
  constructor(message, status, retryAfter) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.retryAfter = retryAfter;
  }
}

async function request(path, options = {}) {
  const token = localStorage.getItem("boooks-token");
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (response.status === 204) return null;
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(
      payload.error || "Something went wrong",
      response.status,
      response.headers.get("Retry-After"),
    );
  }
  return payload.data ?? payload;
}

export const api = {
  signIn: (body) => request("/users/sign-in", { method: "POST", body: JSON.stringify(body) }),
  signUp: (body) => request("/users/sign-up", { method: "POST", body: JSON.stringify(body) }),
  me: () => request("/users/me"),
  collections: () => request("/collections"),
  createCollection: (name) => request("/collections", { method: "POST", body: JSON.stringify({ name }) }),
  renameCollection: (id, name) => request(`/collections/${id}`, { method: "PATCH", body: JSON.stringify({ name }) }),
  deleteCollection: (id) => request(`/collections/${id}`, { method: "DELETE" }),
  owners: (collectionId) => request(`/collections/${collectionId}/owners`),
  addOwner: (collectionId, email) => request(`/collections/${collectionId}/owners`, { method: "POST", body: JSON.stringify({ email }) }),
  removeOwner: (collectionId, email) => request(`/collections/${collectionId}/owners/${encodeURIComponent(email)}`, { method: "DELETE" }),
  books: (collectionId) => request(`/collections/${collectionId}/books`),
  locations: (collectionId) => request(`/collections/${collectionId}/locations`),
  createLocation: (collectionId, name) => request(`/collections/${collectionId}/locations`, { method: "POST", body: JSON.stringify({ name }) }),
  renameLocation: (id, name) => request(`/locations/${id}`, { method: "PATCH", body: JSON.stringify({ name }) }),
  deleteLocation: (id) => request(`/locations/${id}`, { method: "DELETE" }),
  lookup: (isbn) => request(`/books/lookup/${encodeURIComponent(isbn)}`),
  checkBook: (collectionId, isbn) => request(`/collections/${collectionId}/books/check/${encodeURIComponent(isbn)}`),
  addBook: (collectionId, body) => request(`/collections/${collectionId}/books`, { method: "POST", body: JSON.stringify(body) }),
  updateBook: (collectionId, book, body) => request(book.isbn ? `/collections/${collectionId}/books/${encodeURIComponent(book.isbn)}` : `/collections/${collectionId}/books/id/${book.id}`, { method: "PATCH", body: JSON.stringify(body) }),
  deleteBook: (collectionId, book) => request(book.isbn ? `/collections/${collectionId}/books/${encodeURIComponent(book.isbn)}` : `/collections/${collectionId}/books/id/${book.id}`, { method: "DELETE" }),
  assignLocation: (collectionId, book, locationId) => request(book.isbn ? `/collections/${collectionId}/books/${encodeURIComponent(book.isbn)}/location` : `/collections/${collectionId}/books/id/${book.id}/location`, { method: "PATCH", body: JSON.stringify({ locationId }) }),
};
