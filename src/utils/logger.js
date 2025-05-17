// LOG LEVELS
const LOG_LEVELS = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error'
};

// LOGGER CONFIGURATION
const config = {
  enabled: true,
  minLevel: LOG_LEVELS.DEBUG,
  useColors: true,
  timestamp: true
};

// Colors for each log level
const COLORS = {
  [LOG_LEVELS.DEBUG]: '#9E9E9E', // gris
  [LOG_LEVELS.INFO]: '#2196F3',  // azul
  [LOG_LEVELS.WARN]: '#FF9800',  // naranja
  [LOG_LEVELS.ERROR]: '#F44336'  // rojo
};

// Function to get the current timestamp
const getTimestamp = () => {
  const now = new Date();
  return `[${now.toLocaleTimeString()}:${now.getMilliseconds().toString().padStart(3, '0')}]`;
};

// Function to log messages
const log = (level, message, data) => {
  if (!config.enabled || shouldSkipLog(level)) {
    return;
  }

  const logPrefix = createPrefix(level);
  
  // If data is provided, log it with details
  if (data !== undefined) {
    if (config.useColors) {
      console.groupCollapsed(`%c${logPrefix} ${message}`, `color: ${COLORS[level]}`);
      console.log('Detalles:', data);
      console.groupEnd();
    } else {
      console.groupCollapsed(`${logPrefix} ${message}`);
      console.log('Detalles:', data);
      console.groupEnd();
    }
  } else {
    // Only log the message
    if (config.useColors) {
      console.log(`%c${logPrefix} ${message}`, `color: ${COLORS[level]}`);
    } else {
      console.log(`${logPrefix} ${message}`);
    }
  }
};

// Verification to skip logs based on the minimum level
const shouldSkipLog = (level) => {
  const levels = Object.values(LOG_LEVELS);
  const configLevelIndex = levels.indexOf(config.minLevel);
  const currentLevelIndex = levels.indexOf(level);
  
  return currentLevelIndex < configLevelIndex;
};

// Create the prefix for the log message
const createPrefix = (level) => {
  let prefix = `[${level.toUpperCase()}]`;
  
  if (config.timestamp) {
    prefix = `${getTimestamp()} ${prefix}`;
  }
  
  return prefix;
};

// Export the logger object with methods for different log levels
const logger = {
  debug: (message, data) => log(LOG_LEVELS.DEBUG, message, data),
  info: (message, data) => log(LOG_LEVELS.INFO, message, data),
  warn: (message, data) => log(LOG_LEVELS.WARN, message, data),
  error: (message, data) => log(LOG_LEVELS.ERROR, message, data),
  
  // Configuration methods
  config: {
    enable: () => { config.enabled = true; },
    disable: () => { config.enabled = false; },
    setLevel: (level) => {
      if (Object.values(LOG_LEVELS).includes(level)) {
        config.minLevel = level;
      } else {
        console.error(`Nivel de log inválido: ${level}`);
      }
    },
    getConfig: () => ({ ...config }),
  },
  
  // Exports
  LEVELS: LOG_LEVELS
};

export default logger;