
// A simple logger that only logs in development
const logger = {
  info: (...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ INFO:', ...args);
    }
  },
  warn: (...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ WARN:', ...args);
    }
  },
  error: (error: Error, context?: Record<string, any>) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ ERROR:', error.message, {
        context: context,
        stack: error.stack,
      });
    }
    // In the future, this could be extended to send errors to a monitoring service
    // like Sentry, LogRocket, etc.
  },
};

export default logger;
