import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1705917853030 implements MigrationInterface {
    name = 'Default1705917853030'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chats" DROP CONSTRAINT "FK_9e4d4e35db1d18ec97a9ca07c65"`);
        await queryRunner.query(`ALTER TABLE "chats" RENAME COLUMN "authorId" TO "author"`);
        await queryRunner.query(`ALTER TABLE "chats" ADD CONSTRAINT "FK_0ee0aeb9a42fd98fd2e45d17ade" FOREIGN KEY ("author") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chats" DROP CONSTRAINT "FK_0ee0aeb9a42fd98fd2e45d17ade"`);
        await queryRunner.query(`ALTER TABLE "chats" RENAME COLUMN "author" TO "authorId"`);
        await queryRunner.query(`ALTER TABLE "chats" ADD CONSTRAINT "FK_9e4d4e35db1d18ec97a9ca07c65" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
