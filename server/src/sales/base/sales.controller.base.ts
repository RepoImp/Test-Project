import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import * as nestAccessControl from "nest-access-control";
import * as defaultAuthGuard from "../../auth/defaultAuth.guard";
import { isRecordNotFoundError } from "../../prisma.util";
import * as errors from "../../errors";
import { NotFoundException } from "@nestjs/common";
import { SalesService } from "../sales.service";
import { AclValidateRequestInterceptor } from "../../interceptors/aclValidateRequest.interceptor";
import { AclFilterResponseInterceptor } from "../../interceptors/aclFilterResponse.interceptor";
import { SalesCreateInput } from "./SalesCreateInput";
import { SaleProductCreateInput } from "./SaleProductCreateInput";
import { Sales } from "./Sales";

@swagger.ApiBearerAuth()
@common.UseGuards(defaultAuthGuard.DefaultAuthGuard, nestAccessControl.ACGuard)
export class SalesControllerBase {
  constructor(
    protected readonly service: SalesService,
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {}

  ////////////////////////////////////////CREATE SALES////////////////////////////////////////
  @common.UseInterceptors(AclValidateRequestInterceptor)
  @nestAccessControl.UseRoles({
    resource: "Sales",
    action: "create",
    possession: "any",
  })
  @common.Post()
  @swagger.ApiCreatedResponse({ type: Sales })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async create(@common.Body() data: SalesCreateInput): Promise<Sales> {
    return await this.service.create({
      data: {
        ...data,
        customer: data.customer
          ? {
              connect: data.customer,
            }
          : undefined,
        saleProducts: data.saleProducts
          ? {
              create: data.saleProducts
                ? (data.saleProducts as SaleProductCreateInput[]).map((p) => ({
                    product: {
                      connect: p.product,
                    },
                    totalQuantity: p.totalQuantity,
                    price: p.price,
                    amount: (p.totalQuantity ?? 0) * (p.price ?? 0),
                  }))
                : undefined,
            }
          : undefined,
        totalQuantity: (
          (data.saleProducts as SaleProductCreateInput[]) ?? []
        ).reduce((total: any, p: any) => total + (p.totalQuantity ?? 0), 0),
        totalPrice: (
          (data.saleProducts as SaleProductCreateInput[]) ?? []
        ).reduce(
          (total: any, p: any) =>
            total + ((p.totalQuantity ?? 0) * (p.price ?? 0) ?? 0),
          0
        ),
      },
      select: {
        createdAt: true,
        customer: {
          select: {
            id: true,
          },
        },
        saleProducts: {
          select: {
            id: true,
            product: { select: { id: true, name: true } },
            totalQuantity: true,
            price: true,
            amount: true,
          },
        },
        id: true,
        totalQuantity: true,
        totalPrice: true,
        updatedAt: true,
      },
    });
  }

  ////////////////////////////////////////GET ALL SALES////////////////////////////////////////

  @common.UseInterceptors(AclValidateRequestInterceptor)
  @nestAccessControl.UseRoles({
    resource: "Sales",
    action: "read",
    possession: "any",
  })
  @common.Get()
  @swagger.ApiCreatedResponse({ type: Sales })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async findMany() {
    return await this.service.findMany();
  }


  ////////////////////////////////////////GET OWN SALES////////////////////////////////////////

  @common.UseInterceptors(AclFilterResponseInterceptor)
  @nestAccessControl.UseRoles({
    resource: "Sales",
    action: "read",
    possession: "own",
  })
  @common.Get("/:id")
  @swagger.ApiParam({ name: "id", description: "The ID of the sales record" })
  @swagger.ApiOkResponse({ type: Sales })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async findOne(@common.Param("id") id: string): Promise<Sales | null> {
    try {
      const findOneSales = await this.service.findOne(id);
      if (!findOneSales) {
        throw new NotFoundException(`No resource was found for ID ${id}`);
      }
      return findOneSales;
    } catch (error:any) {
      if (isRecordNotFoundError(error)) {
        throw new NotFoundException(`No resource was found for ID ${id}`);
      } else {
        throw error;
      }
    } 
  }
  
  // // ////////////////////////////////////////UPDATE SALES////////////////////////////////////////

  // @common.UseInterceptors(AclValidateRequestInterceptor)
  // @nestAccessControl.UseRoles({
  //   resource: "Sales",
  //   action: "update",
  //   possession: "any",
  // })
  // @common.Put("/:id")
  // @swagger.ApiOkResponse({ type: Sales })
  // @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  // async updatesale(
  //   @common.Param("id") id: string,
  //   @common.Body() data: SalesUpdateInput,
  // ): Promise<Sales> {
  //   return this.service.update({
  //     where: { id },
  //     data: {
  //       customer: data.customer
  //         ? {
  //             connect: data.customer,
  //           }
  //         : undefined,
  //       saleProducts: data.saleProducts
  //         ? {
  //             create: data.saleProducts
  //               ? (data.saleProducts as SaleProductUpdateInput[]).map((p) => ({
  //                   product: {
  //                     connect: p.product,
  //                   },
  //                   totalQuantity: p.totalQuantity,
  //                   price: p.price,
  //                   amount: (p.totalQuantity ?? 0) * (p.price ?? 0),
  //                 }))
  //               : undefined,
  //           }
  //         : undefined,
  //       totalQuantity: (
  //         (data.saleProducts as SaleProductUpdateInput[]) ?? []
  //       ).reduce((total: any, p: any) => total + (p.totalQuantity ?? 0), 0),
  //       totalPrice: (
  //         (data.saleProducts as SaleProductUpdateInput[]) ?? []
  //       ).reduce(
  //         (total: any, p: any) =>
  //           total + ((p.totalQuantity ?? 0) * (p.price ?? 0) ?? 0),
  //         0
  //       ),
  //     },
  //     select: {
  //       createdAt: true,
  //       customer: {
  //         select: {
  //           id: true,
  //         },
  //       },
  //       saleProducts: {
  //         select: {
  //           id: true,
  //           product: { select: { id: true, name: true } },
  //           totalQuantity: true,
  //           price: true,
  //           amount: true,
  //         },
  //       },
  //       id: true,
  //       totalQuantity: true,
  //       totalPrice: true,
  //       updatedAt: true,
  //     },
  //   });
  // }


  ////////////////////////////////////////REMOVE SALES////////////////////////////////////////

  @common.UseInterceptors(AclFilterResponseInterceptor)
  @nestAccessControl.UseRoles({
    resource: "Sales",
    action: "delete",
    possession: "any",
  })
  @common.Delete("/:id")
  @swagger.ApiParam({ name: "id", description: "The ID of the sales record" })
  @swagger.ApiOkResponse({ type: Sales })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async delete(@common.Param("id")  id: string): Promise<Sales> {
    try {
      const deletedSales = await this.service.delete(id);
      if (!deletedSales) {
        throw new NotFoundException(`No resource was found for ID ${id}`);
      }
      return deletedSales;
    } catch (error:any) {
      if (isRecordNotFoundError(error)) {
        throw new NotFoundException(`No resource was found for ID ${id}`);
      } else {
        throw error;
      }
    }
  }
  }

