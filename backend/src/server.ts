import { createApp } from './app.js';
import { env } from './config/env.js';
import { initOraclePool, closeOraclePool } from './config/oracle.js';

async function bootstrap() {
  try {
    // 1. Inicializar conexión a Oracle
    await initOraclePool();

    // 2. Crear aplicación Express
    const app = createApp();

    // 3. Iniciar servidor HTTP
    const server = app.listen(env.PORT, () => {
      console.log(`🚀 Servidor SAMANYA OS API escuchando en el puerto ${env.PORT} [${env.NODE_ENV}]`);
      console.log(`🔗 Endpoint de salud: http://localhost:${env.PORT}/api/health`);
    });

    // 4. Manejo elegante de apagado (Graceful Shutdown)
    const handleShutdown = async (signal: string) => {
      console.log(`\n🛑 Recibida señal ${signal}. Cerrando servidor y pool Oracle...`);
      server.close(async () => {
        await closeOraclePool();
        console.log('🏁 Proceso finalizado correctamente.');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => handleShutdown('SIGINT'));
    process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  } catch (error) {
    console.error('💥 Error crítico al arrancar la API de SAMANYA OS:', error);
    process.exit(1);
  }
}

bootstrap();
