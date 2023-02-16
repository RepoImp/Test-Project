
import { ArgsType, Field } from "@nestjs/graphql";
import { SalesWhereUniqueInput } from "./SalesWhereUniqueInput";
import { SalesUpdateInput } from "./SalesUpdateInput";

@ArgsType()
class UpdateSalesArgs {
  @Field(() => SalesWhereUniqueInput, { nullable: false })
  where!: SalesWhereUniqueInput;
  @Field(() => SalesUpdateInput, { nullable: false })
  data!: SalesUpdateInput;
}

export { UpdateSalesArgs };
