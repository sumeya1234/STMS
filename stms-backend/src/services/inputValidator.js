/**
 * InputValidator Module
 * Defensive validation layer for all incoming requests.
 */

// Validate email format
exports.isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Validate password strength (min 6 chars)
exports.isValidPassword = (password) => {
    return typeof password === 'string' && password.length >= 6;
};

// Validate role
exports.isValidRole = (role) => {
    return ['Teacher', 'Student'].includes(role);
};

// Validate study year (1-6)
exports.isValidYear = (year) => {
    const y = parseInt(year);
    return !isNaN(y) && y >= 1 && y <= 6;
};

// Validate due date is in the future
exports.isFutureDate = (dateStr) => {
    const date = new Date(dateStr);
    return !isNaN(date.getTime()) && date > new Date();
};

// Validate marks range
exports.isValidMarks = (marks) => {
    const m = parseFloat(marks);
    return !isNaN(m) && m > 0 && m <= 100;
};

// Validate required string fields are non-empty
exports.isNonEmpty = (value) => {
    return typeof value === 'string' && value.trim().length > 0;
};
