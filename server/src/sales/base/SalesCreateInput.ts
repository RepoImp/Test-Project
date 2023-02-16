
import { InputType, Field } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { CustomerWhereUniqueInput } from "../../customer/base/CustomerWhereUniqueInput";
import { ValidateNested, IsOptional, IsNumber, IsInt } from "class-validator";
import { Type } from "class-transformer";
import { SaleProductCreateInput } from "../../sales/base/SaleProductCreateInput";

@InputType()
class SalesCreateInput {

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
  customer?: CustomerWhereUniqueInput| null;

  @ApiProperty({
    required: false,
    type: [SaleProductCreateInput],
  })
  @ValidateNested({ each: true })
  @Type(() => SaleProductCreateInput)
  @Field(() => [SaleProductCreateInput], { nullable: true })
  saleProducts?: SaleProductCreateInput;

}

export { SalesCreateInput };
