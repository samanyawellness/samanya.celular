import { withConnection } from '../../config/oracle.js';

export class DevicesRepository {
  async registerOrUpdateToken(
    userId: number,
    token: string,
    platform: 'ANDROID' | 'IOS' | 'WEB'
  ): Promise<void> {
    return withConnection(async (connection) => {
      const sql = `
        MERGE INTO SMY_DISPOSITIVOS_PUSH d
        USING (SELECT :userId AS id_usuario, :token AS token_dispositivo, :platform AS plataforma FROM DUAL) s
        ON (d.TOKEN_DISPOSITIVO = s.token_dispositivo)
        WHEN MATCHED THEN
          UPDATE SET d.ID_USUARIO = s.id_usuario,
                     d.PLATAFORMA = s.plataforma,
                     d.ACTIVO = 'S',
                     d.FECHA_ULTIMO_USO = CAST(SYSTIMESTAMP AT TIME ZONE '-05:00' AS DATE),
                     d.ID_USUARIO_ULTIMA_MODIFICACION = s.id_usuario
        WHEN NOT MATCHED THEN
          INSERT (
              ID_USUARIO,
              TOKEN_DISPOSITIVO,
              PLATAFORMA,
              FECHA_ULTIMO_USO,
              ACTIVO,
              FECHA_CREACION,
              ID_USUARIO_ULTIMA_MODIFICACION
          ) VALUES (
              s.id_usuario,
              s.token_dispositivo,
              s.plataforma,
              CAST(SYSTIMESTAMP AT TIME ZONE '-05:00' AS DATE),
              'S',
              CAST(SYSTIMESTAMP AT TIME ZONE '-05:00' AS DATE),
              s.id_usuario
          )
      `;

      await connection.execute(
        sql,
        {
          userId,
          token,
          platform
        },
        { autoCommit: true }
      );
    });
  }

  async deactivateToken(token: string, userId: number): Promise<void> {
    return withConnection(async (connection) => {
      const sql = `
        UPDATE SMY_DISPOSITIVOS_PUSH
           SET ACTIVO = 'N',
               ID_USUARIO_ULTIMA_MODIFICACION = :userId
         WHERE TOKEN_DISPOSITIVO = :token
      `;

      await connection.execute(sql, { token, userId }, { autoCommit: true });
    });
  }

  async getActiveTokensByUser(userId: number): Promise<string[]> {
    return withConnection(async (connection) => {
      const sql = `
        SELECT TOKEN_DISPOSITIVO
          FROM SMY_DISPOSITIVOS_PUSH
         WHERE ID_USUARIO = :userId
           AND ACTIVO = 'S'
      `;

      const result = await connection.execute<{ TOKEN_DISPOSITIVO: string }>(
        sql,
        { userId },
        { outFormat: 4002 } // oracledb.OUT_FORMAT_OBJECT
      );
      if (!result.rows) return [];
      return (result.rows as { TOKEN_DISPOSITIVO: string }[]).map((r) => r.TOKEN_DISPOSITIVO);
    });
  }
}
