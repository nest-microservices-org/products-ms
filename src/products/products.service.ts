import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { PrismaClient, Product } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger("ProductsService");

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Connected to database');
  }

  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto
    })
  }

  async findAll(paginationDto: PaginationDto) {

    const { limit, page } = paginationDto;

    const total = await this.product.count({
      where: {
        available: true
      }
    });
    const lastPage = Math.ceil(total / limit);

    return {
      data: await this.product.findMany({
        where: {
          available: true
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      meta: {
        page,
        total,
        lastPage
      }
    }
  }

  async findOne(id: Product['id']) {
    const product = await this.product.findUnique({
      where: {
        id,
        available: true
      }
    })
    if(!product) {
      throw new RpcException(`Product #${id} not found`)
    }
    return product
  }

  async update(id: Product['id'], updateProductDto: UpdateProductDto) {

    const { id: _id, ...data } = updateProductDto

    await this.findOne(id);
    return this.product.update({
      where: {
        id
      },
      data
    })
  }

  async remove(id: Product['id']) {
    await this.findOne(id);
    // hard delete
    // return this.product.delete({
    //   where: {
    //     id
    //   }
    // })

    // soft delete
    return this.product.update({
      where: {
        id
      },
      data: {
        available: false
      }
    })
  }
}
