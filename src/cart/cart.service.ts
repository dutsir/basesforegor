import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CartItem } from '../models/cart-item.model';
import { Product } from '../models/product.model';
import { User } from '../models/user.model';
import { Sequelize } from 'sequelize';

interface CartTotalResult {
  user_id: number;
  email: string;
  cart_total: string;
  items_count: string;
}

@Injectable()
export class CartService {
  constructor(
    @InjectModel(CartItem)
    private cartItemModel: typeof CartItem,
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(Product)
    private productModel: typeof Product,
  ) {}

  async findAll(): Promise<CartItem[]> {
    return this.cartItemModel.findAll({
      include: [Product, User],
    });
  }

  async findOne(id: number): Promise<CartItem> {
    const cartItem = await this.cartItemModel.findByPk(id, {
      include: [Product, User],
    });
    if (!cartItem) {
      throw new Error('Cart item не найдены печалька');
    }
    return cartItem;
  }

  async create(cartItemData: Partial<CartItem>): Promise<CartItem> {
    return this.cartItemModel.create(cartItemData);
  }

  async update(id: number, cartItemData: Partial<CartItem>): Promise<[number, CartItem[]]> {
    return this.cartItemModel.update(cartItemData, {
      where: { cart_item_id: id },
      returning: true,
    });
  }

  async remove(id: number): Promise<number> {
    return this.cartItemModel.destroy({
      where: { cart_item_id: id },
    });
  }

  async findByUser(userId: number): Promise<CartItem[]> {
    return this.cartItemModel.findAll({
      where: { user_id: userId },
      include: [Product],
      order: [['added_date', 'DESC']],
    });
  }

  async findByProduct(productId: number): Promise<CartItem[]> {
    return this.cartItemModel.findAll({
      where: { product_id: productId },
      include: [User],
      order: [['added_date', 'DESC']],
    });
  }

  async addToCart(userId: number, productId: number, quantity: number = 1): Promise<CartItem> {
    const existingItem = await this.cartItemModel.findOne({
      where: {
        user_id: userId,
        product_id: productId,
      },
    });

    if (existingItem) {
      await existingItem.update({
        quantity: existingItem.quantity + quantity,
      });
      return existingItem;
    }

    return this.cartItemModel.create({
      user_id: userId,
      product_id: productId,
      quantity,
    });
  }

  async updateQuantity(userId: number, productId: number, quantity: number): Promise<CartItem> {
    const cartItem = await this.cartItemModel.findOne({
      where: {
        user_id: userId,
        product_id: productId,
      },
    });

    if (!cartItem) {
      throw new Error('Cart item не найдены печалька2');
    }

    await cartItem.update({ quantity });
    return cartItem;
  }

  async removeFromCart(userId: number, productId: number): Promise<number> {
    return this.cartItemModel.destroy({
      where: {
        user_id: userId,
        product_id: productId,
      },
    });
  }

  async getCartTotal(userId: number): Promise<{ total: number; items_count: number }> {
    const cartItems = await this.cartItemModel.findAll({
      where: { user_id: userId },
      include: [Product],
    });

    const total = cartItems.reduce((sum, item) => sum + (item.quantity * item.product.price), 0);
    const items_count = cartItems.length;

    return { total, items_count };
  }

  async getCartTotalWithUserDetails(userId: number): Promise<{
    user_id: number;
    email: string;
    cart_total: number;
    items_count: number;
  }> {
    const result = await this.userModel.findOne({
      attributes: [
        'user_id',
        'email',
        [
          Sequelize.literal('SUM("cartItems"."QUANTITY" * "cartItems->product"."PRICE")'),
          'cart_total'
        ],
        [
          Sequelize.literal('COUNT("cartItems"."PRODUCT_ID")'),
          'items_count'
        ]
      ],
      include: [
        {
          model: CartItem,
          as: 'cartItems',
          attributes: [],
          include: [
            {
              model: Product,
              attributes: [],
            }
          ]
        }
      ],
      where: {
        user_id: userId
      },
      group: ['User.user_id', 'User.email'],
      raw: true
    }) as unknown as CartTotalResult;

    if (!result) {
      throw new Error('User not found');
    }

    return {
      user_id: result.user_id,
      email: result.email,
      cart_total: parseFloat(result.cart_total) || 0,
      items_count: parseInt(result.items_count) || 0
    };
  }
} 