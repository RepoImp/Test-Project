
import * as common from "@nestjs/common";
import * as graphql from "@nestjs/graphql";
import * as nestAccessControl from "nest-access-control";
import { GqlDefaultAuthGuard } from "../../auth/gqlDefaultAuth.guard";
import * as gqlACGuard from "../../auth/gqlAC.guard";
import { AclValidateRequestInterceptor } from "../../interceptors/aclValidateRequest.interceptor";
import { CreateSalesArgs } from "./CreateSalesArgs";
import { Sales } from "./Sales";
import { SalesService } from "../sales.service";
import { SaleProductCreateInput } from "./SaleProductCreateInput";

@graphql.Resolver(() => Sales)
@common.UseGuards(GqlDefaultAuthGuard, gqlACGuard.GqlACGuard)
export class SalesResolverBase {
  constructor(
    protected readonly service: SalesService,
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {}

  @common.UseInterceptors(AclValidateRequestInterceptor)
  @graphql.Mutation(() => Sales)
  @nestAccessControl.UseRoles({
    resource: "Sales",
    action: "create",
    possession: "any",
  })
  async createSales(@graphql.Args() args: CreateSalesArgs): Promise<Sales> {
    return await this.service.create({
      ...args,
      data: {
        ...args.data,
        customer: args.data.customer
          ? {
              connect: args.data.customer,
            }
          : undefined,
        saleProducts: args.data.saleProducts
          ? {
              create: args.data.saleProducts
                ? (args.data.saleProducts as SaleProductCreateInput[]).map(
                    (p) => ({
                      product: {
                        connect: p.product,
                      },
                      totalQuantity: p.totalQuantity,
                      price: p.price,
                      amount: (p.totalQuantity ?? 0) * (p.price ?? 0),
                    })
                  )
                : undefined,
            }
          : undefined,
        totalQuantity: (
          (args.data.saleProducts as SaleProductCreateInput[]) ?? []
        ).reduce((total: any, p: any) => total + (p.totalQuantity ?? 0), 0),
        totalPrice: (
          (args.data.saleProducts as SaleProductCreateInput[]) ?? []
        ).reduce(
          (total: any, p: any) =>
            total + ((p.totalQuantity ?? 0) * (p.price ?? 0) ?? 0),
          0
        ),
      },
    });
  }

  @common.UseInterceptors(AclValidateRequestInterceptor)
  @graphql.Mutation(() => Sales)
  @nestAccessControl.UseRoles({
    resource: "Sales",
    action: "read",
    possession: "any",
  })
  async getAllSales() {
    return await this.service.findMany();
  }

  @common.UseInterceptors(AclValidateRequestInterceptor)
  @graphql.Mutation(() => Sales)
  @nestAccessControl.UseRoles({
    resource: "Sales",
    action: "read",
    possession: "own",
  })
  async findOne(@graphql.Args('id') args: string) {
    return await this.service.findOne(args);
  }

  @common.UseInterceptors(AclValidateRequestInterceptor)
  @graphql.Mutation(() => Sales)
  @nestAccessControl.UseRoles({
    resource: "Sales",
    action: "delete",
    possession: "any",
  })
  async delete(@graphql.Args('id') args: string) {
    return await this.service.findOne(args);
  }
}
