import { Table, Column, Model } from 'sequelize-typescript'

@Table
export class Item extends Model {
  @Column name!: string; 
  @Column description!: string;
  @Column quantity!: number;
  @Column price!: number;
  @Column numOfOtherImage!: number;

  
}