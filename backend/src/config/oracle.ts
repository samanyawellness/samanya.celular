import fs from 'fs';
import path from 'path';
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
    const poolConfig: oracledb.PoolAttributes = {
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      connectString: env.DB_CONNECT_STRING,
      poolMin: env.DB_POOL_MIN,
      poolMax: env.DB_POOL_MAX,
      poolIncrement: env.DB_POOL_INCREMENT,
      poolAlias: 'samanya_pool'
    };

    if (env.DB_WALLET_LOCATION) {
      const walletPath = path.resolve(process.cwd(), env.DB_WALLET_LOCATION);
      process.env.TNS_ADMIN = walletPath;
      poolConfig.configDir = walletPath;
      poolConfig.walletLocation = walletPath;

      // Asegurar que sqlnet.ora apunte a la ruta absoluta correcta
      try {
        const sqlnetFile = path.join(walletPath, 'sqlnet.ora');
        if (fs.existsSync(sqlnetFile)) {
          const normalizedPath = walletPath.replace(/\\/g, '/');
          const sqlnetContent = fs.readFileSync(sqlnetFile, 'utf8');
          if (sqlnetContent.includes('?/network/admin') || !sqlnetContent.includes(normalizedPath)) {
            const updatedContent = `WALLET_LOCATION = (SOURCE = (METHOD = file) (METHOD_DATA = (DIRECTORY="${normalizedPath}")))\nSSL_SERVER_DN_MATCH=yes\n`;
            fs.writeFileSync(sqlnetFile, updatedContent, 'utf8');
          }
        }
      } catch (err) {
        console.warn('⚠️ No se pudo ajustar sqlnet.ora dinámicamente:', err);
      }

      if (env.DB_WALLET_PASSWORD) {
        poolConfig.walletPassword = env.DB_WALLET_PASSWORD;
      }

      console.log(`💼 Configurando conexión con Oracle Wallet en: ${walletPath}`);
    }

    console.log(`🔌 Conectando a Oracle Database (${env.DB_USER}@${env.DB_CONNECT_STRING})...`);
    await oracledb.createPool(poolConfig);
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
