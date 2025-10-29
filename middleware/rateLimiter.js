// Rate limiting middleware to prevent API abuse

const rateLimitStore = new Map();

// Clean up old entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, data] of rateLimitStore.entries()) {
        if (now - data.resetTime > 0) {
            rateLimitStore.delete(key);
        }
    }
}, 5 * 60 * 1000);

/**
 * Rate limiter middleware
 * @param {Object} options - Configuration options
 * @param {number} options.windowMs - Time window in milliseconds
 * @param {number} options.maxRequests - Maximum requests per window
 * @param {string} options.message - Error message
 */
export function rateLimiter(options = {}) {
    const {
        windowMs = 60 * 1000, // 1 minute
        maxRequests = 60, // 60 requests per minute
        message = 'Too many requests, please try again later.'
    } = options;

    return (req, res, next) => {
        // Get identifier (IP address or user ID)
        const identifier = req.user?.userId || req.ip || req.connection.remoteAddress;
        const key = `${identifier}:${req.path}`;
        
        const now = Date.now();
        const record = rateLimitStore.get(key);

        if (!record) {
            // First request
            rateLimitStore.set(key, {
                count: 1,
                resetTime: now + windowMs
            });
            return next();
        }

        if (now > record.resetTime) {
            // Window expired, reset
            rateLimitStore.set(key, {
                count: 1,
                resetTime: now + windowMs
            });
            return next();
        }

        if (record.count >= maxRequests) {
            // Rate limit exceeded
            const retryAfter = Math.ceil((record.resetTime - now) / 1000);
            res.setHeader('Retry-After', retryAfter);
            res.setHeader('X-RateLimit-Limit', maxRequests);
            res.setHeader('X-RateLimit-Remaining', 0);
            res.setHeader('X-RateLimit-Reset', new Date(record.resetTime).toISOString());
            
            return res.status(429).json({
                error: message,
                retryAfter: retryAfter
            });
        }

        // Increment count
        record.count++;
        rateLimitStore.set(key, record);

        // Set rate limit headers
        res.setHeader('X-RateLimit-Limit', maxRequests);
        res.setHeader('X-RateLimit-Remaining', maxRequests - record.count);
        res.setHeader('X-RateLimit-Reset', new Date(record.resetTime).toISOString());

        next();
    };
}

// Specific rate limiters for different endpoints
export const authLimiter = rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 attempts
    message: 'Too many authentication attempts, please try again later.'
});

export const chatLimiter = rateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 20, // 20 messages per minute
    message: 'Too many messages, please slow down.'
});

export const apiLimiter = rateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60, // 60 requests per minute
    message: 'Too many API requests, please try again later.'
});
