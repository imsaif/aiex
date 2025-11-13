import { jest } from '@jest/globals';

// Type for Subscriber from Prisma schema
interface Subscriber {
  id: string;
  email: string;
  subscribedAt: Date;
  active: boolean;
  unsubscribeToken: string;
  updatedAt: Date;
}

// Default mock subscriber
const defaultSubscriber: Subscriber = {
  id: 'test-subscriber-id',
  email: 'test@example.com',
  subscribedAt: new Date('2024-01-01'),
  active: true,
  unsubscribeToken: 'test-unsubscribe-token',
  updatedAt: new Date('2024-01-01'),
};

export const mockPrismaClient = {
  subscriber: {
    findUnique: jest.fn<() => Promise<Subscriber | null>>().mockResolvedValue(null),
    findMany: jest.fn<() => Promise<Subscriber[]>>().mockResolvedValue([]),
    create: jest.fn<() => Promise<Subscriber>>().mockResolvedValue(defaultSubscriber),
    update: jest.fn<() => Promise<Subscriber>>().mockResolvedValue(defaultSubscriber),
    delete: jest.fn<() => Promise<Subscriber>>().mockResolvedValue(defaultSubscriber),
  },
};

export const prisma = mockPrismaClient;
