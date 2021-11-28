import { Table, Column, Model, AllowNull } from 'sequelize-typescript'

@Table
export class Item extends Model {

    @AllowNull(false)
    @Column name!: string;

    @AllowNull(false)
    @Column type!: string;


    @Column description!: string;


    @AllowNull(false)
    @Column quantity!: string;


    @AllowNull(false)
    @Column price!: number;


    @AllowNull(false)
    @Column numOfOtherImage!: number;


}