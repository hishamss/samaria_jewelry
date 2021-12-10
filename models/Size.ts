import { Table, Column, Model, AllowNull, ForeignKey } from 'sequelize-typescript'
import {Item} from "./Item"
@Table
export class Size extends Model {

    @ForeignKey(() => Item)
    @Column itemId!:number;

    @AllowNull(false)
    @Column size!: string;
    @AllowNull(false)
    @Column quantity!: number;



}