import { InputType, Field } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { CustomerWhereUniqueInput } from "../../customer/base/CustomerWhereUniqueInput";
import { ValidateNested, IsOptional, IsNumber, IsInt } from "class-validator";
import { Type } from "class-transformer";
import { ProductWhereUniqueInput } from "../../product/base/ProductWhereUniqueInput";

@InputType()
class SaleProductCreateInput {

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
      product?: ProductWhereUniqueInput | null;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsInt()
  @IsOptional()
  @Field(() => Number, {
    nullable: true,
  })
  price?: number | null;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsInt()
  @IsOptional()
  @Field(() => Number, {
    nullable: true,
  })
  totalQuantity?: number | null;
}

export { SaleProductCreateInput };
