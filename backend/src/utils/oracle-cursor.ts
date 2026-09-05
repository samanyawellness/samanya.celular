import oracledb from 'oracledb';

/**
 * Lee todas las filas de un cursor SYS_REFCURSOR retornado por un procedimiento o función PL/SQL
 * y lo cierra de forma segura.
 */
export async function readResultSet<T = any>(
  resultSet: oracledb.ResultSet<any> | undefined,
  maxRows = 1000
): Promise<T[]> {
  if (!resultSet) {
    return [];
  }

  const rows: T[] = [];
  try {
    let batch: any[];
    do {
      batch = await resultSet.getRows(maxRows);
      if (batch && batch.length > 0) {
        rows.push(...batch);
      }
    } while (batch && batch.length === maxRows);
    return rows;
  } finally {
    try {
      await resultSet.close();
    } catch (err) {
      console.error('Error al cerrar ResultSet de Oracle:', err);
    }
  }
}
