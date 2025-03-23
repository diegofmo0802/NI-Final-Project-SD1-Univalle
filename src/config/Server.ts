export interface ServerConfig {
    host: string;
    port: number;
    ssl: SSLOptions | null;
}
export interface SSLOptions {
    pubKey: string;
    privKey: string;
}
/**
 * Loads the server configurations from the environment variables.
 * @param env - The environment record
 * @param defaults - The default configuration record
 * @requires SERVER_HOST - The host of the server. Defaults to 'localhost'
 * @requires SERVER_PORT - The port of the server. Defaults to '80'
 * @requires SERVER_SSL - Whether the server should use SSL. Defaults to 'false'
 * @requires SERVER_CERT - The path to the SSL certificate. Required if SERVER_SSL is 'true'
 * @requires SERVER_KEY - The path to the SSL private key. Required if SERVER_SSL is 'true'
 */
export function loadServerConfig(env: Record<string, string | undefined> = process.env, defaults?: Record<string, string | undefined>): ServerConfig {
    const {
        SERVER_HOST = defaults?.SERVER_HOST || 'localhost',
        SERVER_PORT = defaults?.SERVER_PORT || '8080',
        SERVER_SSL =  defaults?.SERVER_SSL  || 'false',
        SERVER_CERT = defaults?.SERVER_CERT || '',
        SERVER_KEY =  defaults?.SERVER_KEY  || '',
    } = process.env;
    return {
        host: SERVER_HOST,
        port: parseInt(SERVER_PORT),
        ssl: SERVER_SSL.toLowerCase() === 'true' || SERVER_SSL === '1' ? {
            pubKey: SERVER_CERT,
            privKey: SERVER_KEY,
        } : null,
    }
}

export const ServerOptions = loadServerConfig(undefined, {
    SERVER_HOST: '127.0.0.1',
    SERVER_PORT: '3000',
    SERVER_SSL: 'false'
});
export default ServerOptions;