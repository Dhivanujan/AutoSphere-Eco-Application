import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Reads json serialized values from local persistent device storage
 * @param {string} key 
 * @param {any} defaultValue 
 */
export const getOfflineData = async (key, defaultValue = null) => {
  try {
    const val = await AsyncStorage.getItem(key);
    return val ? JSON.parse(val) : defaultValue;
  } catch (err) {
    console.error('Offline storage read error:', err);
    return defaultValue;
  }
};

/**
 * Writes json serialized values into local persistent device storage
 * @param {string} key 
 * @param {any} data 
 */
export const setOfflineData = async (key, data) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('Offline storage write error:', err);
  }
};

/**
 * Format numeric value to standard currency display
 * @param {number} value 
 */
export const formatCurrency = (value) => {
  return `$${parseFloat(value || 0).toFixed(2)}`;
};

/**
 * Retrieve hexadecimal color code from state status values
 * @param {string} status 
 * @param {object} colors theme colors reference
 */
export const getStatusColor = (status, colors) => {
  switch (status?.toLowerCase()) {
    case 'approved':
    case 'active':
    case 'completed':
    case 'online':
      return colors.success;
    case 'accepted':
    case 'in progress':
      return colors.info;
    case 'pending':
      return colors.pending;
    case 'rejected':
    case 'error':
    case 'cancelled':
    case 'offline':
      return colors.danger;
    default:
      return colors.textLight;
  }
};
