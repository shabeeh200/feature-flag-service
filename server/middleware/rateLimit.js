const rateLimit = require('express-rate-limit');

const isTest = process.env.NODE_ENV === 'test';

const apiLimiter = rateLimit({
  windowMs: isTest ? 1_000 : 15 * 60 * 1_000,
  max: isTest ? 5 : 100,
  standardHeaders: true, // Include rate limit headers
  legacyHeaders: false,  // Disable `X-RateLimit-*` headers

  message: {
    message: 'Too many requests, please try again later.'
  }
});

module.exports = { apiLimiter };
