const PREFIX = 'REACT_APP_'

// helping function to extract env vars
// remember that dotenv is preconfigured in CRA to include vars with 'REACT_APP_' prefix
const env = (key: String, defaultValue?: any) => {
  const envKey: string = PREFIX + key;
  return process.env[envKey] ?? defaultValue;
}

export default {

}