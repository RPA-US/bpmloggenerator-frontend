const PREFIX = 'REACT_APP_'

// helping function to extract env vars
// remember that dotenv is preconfigured in CRA to include vars with 'REACT_APP_' prefix
const env = (key: String, defaultValue?: any) => {
  const envKey: string = PREFIX + key;
  return process.env[envKey] ?? defaultValue;
}

export default {
  API_BASE_URL: env('API_BASE_URL'),
  PREFIX: env('PREFIX', ''),
  CREATING_EXPERIMENT_RELOAD_TIME: 4000,
  PUBLIC_LINK_PART: env('PUBLIC_LINK_PART', ''),
  DEFAULT_NOTIFICATION_TIMEOUT: env('DEFAULT_NOTIFICATION_TIMEOUT', 5000),
}