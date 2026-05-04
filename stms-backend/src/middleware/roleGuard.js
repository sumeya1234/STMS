module.exports = (requiredRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(403).json({ message: 'Access denied: No role provided.' });
        }

        if (!requiredRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied: You do not have permission to perform this action.' });
        }

        next();
    };
};
