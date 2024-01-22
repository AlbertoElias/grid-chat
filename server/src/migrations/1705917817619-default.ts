import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1705917817619 implements MigrationInterface {
    name = 'Default1705917817619'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chats" DROP CONSTRAINT "FK_ae8951c0a763a060593606b7e2d"`);
        await queryRunner.query(`ALTER TABLE "chats" RENAME COLUMN "userId" TO "authorId"`);
        await queryRunner.query(`ALTER TABLE "chats" ADD CONSTRAINT "FK_9e4d4e35db1d18ec97a9ca07c65" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chats" DROP CONSTRAINT "FK_9e4d4e35db1d18ec97a9ca07c65"`);
        await queryRunner.query(`ALTER TABLE "chats" RENAME COLUMN "authorId" TO "userId"`);
        await queryRunner.query(`ALTER TABLE "chats" ADD CONSTRAINT "FK_ae8951c0a763a060593606b7e2d" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
