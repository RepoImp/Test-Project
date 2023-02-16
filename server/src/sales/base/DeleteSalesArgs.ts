import { ArgsType, Field } from "@nestjs/graphql";
import { SalesWhereUniqueInput } from "./SalesWhereUniqueInput";

@ArgsType()
class DeleteSalesArgs {
  @Field(() => SalesWhereUniqueInput, { nullable: false })
  where!: SalesWhereUniqueInput;
}

export { DeleteSalesArgs };
