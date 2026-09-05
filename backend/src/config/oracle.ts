import oracledb from 'oracledb';
import { env } from './env.js';

// Configuración global de Oracle Client
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.autoCommit = false;
oracledb.fetchAsString = [oracledb.CLOB];

let poolInitialized = false;

export async function initOraclePool(): Promise<void> {
  if (poolInitialized) return;

  try {
    console.log(`🔌 Conectando a Oracle Database (${env.DB_USER}@${env.DB_CONNECT_STRING})...`);
    await oracledb.createPool({
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      connectString: env.DB_CONNECT_STRING,
      poolMin: env.DB_POOL_MIN,
      poolMax: env.DB_POOL_MAX,
      poolIncrement: env.DB_POOL_INCREMENT,
      poolAlias: 'samanya_pool'
    });
    poolInitialized = true;
    console.log('✅ Pool de conexiones Oracle inicializado exitosamente (samanya_pool)');
  } catch (error) {
    console.error('❌ Error al inicializar pool de conexiones Oracle:', error);
    throw error;
  }
}

export async function closeOraclePool(): Promise<void> {
  if (!poolInitialized) return;

  try {
    const pool = oracledb.getPool('samanya_pool');
    await pool.close(10);
    poolInitialized = false;
    console.log('🔌 Pool de conexiones Oracle cerrado correctamente.');
  } catch (error) {
    console.error('❌ Error al cerrar pool de Oracle:', error);
  }
}

export async function withConnection<T>(
  action: (connection: oracledb.Connection) => Promise<T>
): Promise<T> {
  const pool = oracledb.getPool('samanya_pool');
  const connection = await pool.getConnection();

  try {
    return await action(connection);
  } finally {
    try {
      await connection.close();
    } catch (err) {
      console.error('Error al liberar conexión al pool:', err);
    }
  }
}
