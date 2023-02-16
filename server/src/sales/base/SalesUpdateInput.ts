import { InputType, Field } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { CustomerWhereUniqueInput } from "../../customer/base/CustomerWhereUniqueInput";
import { ProductWhereUniqueInput } from "../../product/base/ProductWhereUniqueInput";
import { ValidateNested, IsOptional, IsNumber, IsInt } from "class-validator";
import { Type } from "class-transformer";

@InputType()
class SalesUpdateInput {

  @ApiProperty({
    required: false,
    type: () => CustomerWhereUniqueInput,
  })
  @ValidateNested()
  @Type(() => CustomerWhereUniqueInput)
  @IsOptional()
  @Field(() => CustomerWhereUniqueInput, {
    nullable: true,
  })
  customer?: CustomerWhereUniqueInput | null;

  @ApiProperty({
    required: false,
    type: () => ProductWhereUniqueInput,
  })
  @ValidateNested()
  @Type(() => ProductWhereUniqueInput)
  @IsOptional()
  @Field(() => ProductWhereUniqueInput, {
    nullable: true,
  })
  saleProducts?: ProductWhereUniqueInput | null;

  @ApiProperty({
    required: false,
    type: () => Number,
  })
  @IsOptional()
  @IsInt()
  @Field(() => Number, {
    nullable: true,
  })
  totalQuantity?: number | null;

  @ApiProperty({
    required: false,
    type: () => Number,
  })
  @IsOptional()
  @IsNumber()
  @Field(() => Number, {
    nullable: true,
  })
  totalPrice?: number | null;
}

export { SalesUpdateInput };