// A refused request (4xx) carries a message that says what to change, such as an expired transfer; anything else does not
export const getRejectionMessage = (response, data) => {
    const isRejected = response.status >= 400 && response.status < 500;
    const message = typeof data?.message === 'string' ? data.message.trim() : '';

    return isRejected && message ? message : null;
};

// Reads a response body, treating a server error page that is not JSON as no body
export const readJson = (response) => response.json().catch(() => null);

// Thrown for a failed response, keeping the server's message only when it is worth showing as it is
export class TransferRequestError extends Error {
    constructor(rejectionMessage) {
        super(rejectionMessage || 'Transfer request failed');
        this.rejectionMessage = rejectionMessage;
    }
}

// What the toast says: the server's own reason for a refusal, otherwise the action's plain message
export const getToastMessage = (error, fallback) =>
    error instanceof TransferRequestError && error.rejectionMessage ? error.rejectionMessage : fallback;

// fetchWithAuth sends an expired session to the login page itself, so no toast is needed
export const isSessionExpired = (error) => error?.message === 'Session expired';