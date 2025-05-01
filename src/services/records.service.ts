import { dbPool } from '../config/database';
import { Record, Status } from '../models/record.model';

export class RecordsService {
  static async create(data: {
    name: string;
    age: number;
    status: Status;
  }): Promise<Record> {
    const { name, age, status } = data;
    const result = await dbPool.query<Record>(
      `INSERT INTO records (name, age, status) VALUES ($1,$2,$3) RETURNING *`,
      [name, age, status]
    );
    return result.rows[0];
  }

  static async findById(id: string): Promise<Record | null> {
    const result = await dbPool.query<Record>(
      `SELECT * FROM records WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  static async update(
    id: string,
    data: Partial<Pick<Record, 'name' | 'age' | 'status'>>
  ): Promise<Record | null> {
    // build dynamic SET clause
    const fields = [];
    const values: any[] = [];
    let idx = 1;
    for (const [key, val] of Object.entries(data)) {
      fields.push(`${key}=$${idx++}`);
      values.push(val);
    }
    if (fields.length === 0) return await this.findById(id);

    values.push(id);
    const result = await dbPool.query<Record>(
      `UPDATE records SET ${fields.join(',')}, last_updated=NOW() WHERE id=$${idx} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }

  static async delete(id: string): Promise<void> {
    await dbPool.query(`DELETE FROM records WHERE id=$1`, [id]);
  }


    /** Fetch all records */
    static async findAll(): Promise<Record[]> {
      const { rows } = await dbPool.query(
        `SELECT * FROM records ORDER BY last_updated DESC`
      );
      return rows;
    }
}
