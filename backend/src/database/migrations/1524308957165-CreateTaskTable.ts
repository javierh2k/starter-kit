import { MigrationInterface, QueryRunner, Table } from 'typeorm';

import { fixForPostgres } from '../../lib/env/utils';

export class CreateTaskTable1524308957165 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        const table = new Table({
            name: 'task',
            columns: fixForPostgres([
                {
                    name: 'id',
                    type: 'varchar',
                    length: 255,
                    isPrimary: true,
                    isNullable: false,
                },
                {
                    name: 'title',
                    type: 'varchar',
                    length: 255,
                    isPrimary: false,
                    isNullable: false,
                },
                {
                    name: 'is_completed',
                    type: 'boolean',
                    isPrimary: false,
                    isNullable: false,
                },
                {
                    name: 'user_id',
                    type: 'varchar',
                    length: 255,
                    isPrimary: false,
                    isNullable: false,
                },
                {
                    name: 'created',
                    type: 'TIMESTAMP',
                    isNullable: false,
                    default: 'NOW()',
                },
                {
                    name: 'modified',
                    type: 'TIMESTAMP',
                    isNullable: false,
                    default: 'NOW()',
                },
                {
                    name: 'deleted',
                    type: 'TIMESTAMP',
                    isNullable: true,
                },
            ]),
        });

        await queryRunner.createTable(table);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('task');
    }
}
