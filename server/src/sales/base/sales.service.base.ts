
import { PrismaService } from "../../prisma/prisma.service";
import { Prisma, Sales, Customer, Product ,SaleProduct} from "@prisma/client";

export class SalesServiceBase {
  constructor(protected readonly prisma: PrismaService) {}

  async create<T extends Prisma.SalesCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.SalesCreateArgs>
  ): Promise<Sales> {
    return this.prisma.sales.create<T>(args);
  }

  async findMany(): Promise<Sales[]> {
    return this.prisma.sales.findMany({
      include: { saleProducts: true, customer: true },
    });
  }

  async findOne(id: string): Promise<Sales | null> {
    return this.prisma.sales.findUnique({
      where: { id },
      include: { customer: true, saleProducts: true },
    });
  }

  async update<T extends Prisma.SalesUpdateArgs>(
    args: Prisma.SelectSubset<T, Prisma.SalesUpdateArgs>
  ): Promise<Sales> {
    return this.prisma.sales.update<T>(args);
  }

  async delete(id: string): Promise<Sales | null> {
    // Delete related SaleProduct records
    await this.prisma.saleProduct.deleteMany({ where: { salesId: id } });
  
    // Delete the Sales record
    const deletedSales = await this.prisma.sales.delete({
      where: { id },
    });
  
    return deletedSales;
  }
}
