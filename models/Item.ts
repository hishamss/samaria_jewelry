import { Table, Column, Model, AllowNull, HasMany, Unique } from 'sequelize-typescript'
import { Size } from "./Size"

@Table
export class Item extends Model {


    @AllowNull(false)
    @Unique
    @Column name!: string;

    @AllowNull(false)
    @Column type!: string;


    @Column description!: string;


    @AllowNull(false)
    @Column price!: number;


    @AllowNull(false)
    @Column numOfOtherImage!: number;

    @HasMany(() => Size, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    })
    sizes!: Size[];

}