import { MigrationInterface, QueryRunner, Table } from 'typeorm';

import { fixForPostgres } from '../../lib/env/utils';

export class CreateUserTable1511105183653 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        const table = new Table({
            name: 'user',
            columns: fixForPostgres([
                {
                    name: 'id',
                    type: 'varchar',
                    length: '255',
                    isPrimary: true,
                    isNullable: false,
                },
                {
                    name: 'first_name',
                    type: 'varchar',
                    length: '255',
                    isPrimary: false,
                    isNullable: false,
                },
                {
                    name: 'last_name',
                    type: 'varchar',
                    length: '255',
                    isPrimary: false,
                    isNullable: false,
                },
                {
                    name: 'email',
                    type: 'varchar',
                    length: '255',
                    isPrimary: false,
                    isNullable: false,
                },
                {
                    name: 'username',
                    type: 'varchar',
                    length: '255',
                    isPrimary: false,
                    isNullable: false,
                },
                {
                    name: 'password',
                    type: 'varchar',
                    length: '255',
                    isPrimary: false,
                    isNullable: false,
                },
                {
                    name: 'status',
                    type: 'varchar',
                    isNullable: false,
                    default: "'ACTIVE'",
                },
                {
                    name: 'gender',
                    type: 'varchar',
                    isNullable: false,
                    default: "'MALE'",
                },
                {
                    name: 'created',
                    type: 'timestamp',
                    isNullable: false,
                },
                {
                    name: 'modified',
                    type: 'timestamp',
                    isNullable: false,
                    default: 'now()',
                },
                {
                    name: 'deleted',
                    type: 'timestamp',
                    isNullable: true,
                },
            ]),
        });
        await queryRunner.createTable(table);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('user');
    }
}
