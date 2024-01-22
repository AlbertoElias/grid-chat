import { Entity, PrimaryGeneratedColumn, PrimaryColumn, Column, OneToMany, ManyToOne, JoinColumn, BaseEntity } from 'typeorm'

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
    id: string

  @Column({ type: 'text', unique: true })
    username: string

  @OneToMany(() => Chat, chat => chat.id)
    chats: Chat[]
}

@Entity('chats')
export class Chat extends BaseEntity {
  @PrimaryColumn()
    id: string

  @ManyToOne(() => User, user => user.chats)
  @JoinColumn({ name: 'author' })
    author: User

  @Column({ type: 'text' })
    content: string

  @Column({ type: 'timestamptz' })
    createdAt: Date
}
