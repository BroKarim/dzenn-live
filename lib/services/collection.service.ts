import { db } from "../db";
import { collectionSchema, collectionUpdateSchema, voteSchema } from "../validations/schemas";
import { z } from "zod";

export const collectionService = {
  async getAll(filters?: {
    category?: string;
    userId?: string;
    limit?: number;
    offset?: number;
  }) {
    const where: any = {};
    
    if (filters?.category) {
      where.category = filters.category;
    }
    
    if (filters?.userId) {
      where.userId = filters.userId;
    }

    const [collections, total] = await Promise.all([
      db.collection.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              avatarUrl: true,
              image: true,
            },
          },
          links: {
            orderBy: { position: "asc" },
          },
          votes: true,
          _count: {
            select: {
              votes: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: filters?.limit || 20,
        skip: filters?.offset || 0,
      }),
      db.collection.count({ where }),
    ]);

    return {
      collections: collections.map((collection) => {
        const upvotes = collection.votes.filter((v) => v.voteType === "UP").length;
        const downvotes = collection.votes.filter((v) => v.voteType === "DOWN").length;
        const score = Math.max(0, upvotes - downvotes);
        return {
          ...collection,
          upvotes,
          downvotes,
          score,
        };
      }),
      total,
    };
  },

  async getById(id: string, userId?: string) {
    const collection = await db.collection.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true,
            image: true,
          },
        },
        links: {
          orderBy: { position: "asc" },
        },
        votes: userId
          ? {
              where: { userId },
            }
          : true,
        _count: {
          select: {
            votes: true,
          },
        },
      },
    });

    if (!collection) {
      return null;
    }

    const userVote = userId
      ? collection.votes.find((v) => v.userId === userId)
      : null;

    const upvotes = collection.votes.filter((v) => v.voteType === "UP").length;
    const downvotes = collection.votes.filter((v) => v.voteType === "DOWN").length;
    const score = Math.max(0, upvotes - downvotes);
    
    return {
      ...collection,
      upvotes,
      downvotes,
      score,
      userVote: userVote?.voteType || null,
    };
  },

  async create(userId: string, data: z.infer<typeof collectionSchema>) {
    const validated = collectionSchema.parse(data);
    
    const collection = await db.collection.create({
      data: {
        userId,
        title: validated.title,
        description: validated.description,
        category: validated.category,
        links: {
          create: validated.links.map((link, index) => ({
            title: link.title,
            url: link.url,
            icon: link.icon,
            position: index,
          })),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true,
            image: true,
          },
        },
        links: {
          orderBy: { position: "asc" },
        },
        votes: true,
      },
    });

    return {
      ...collection,
      upvotes: 0,
      downvotes: 0,
      score: 0,
    };
  },

  async update(id: string, userId: string, data: Partial<z.infer<typeof collectionUpdateSchema>>) {
    const collection = await db.collection.findUnique({
      where: { id },
    });

    if (!collection) {
      throw new Error("Collection not found");
    }

    if (collection.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const validated = collectionUpdateSchema.partial().parse(data);
    const updateData: any = {};

    if (validated.title) updateData.title = validated.title;
    if (validated.description !== undefined) updateData.description = validated.description;
    if (validated.category) updateData.category = validated.category;

    if (validated.links) {
      await db.collectionLink.deleteMany({
        where: { collectionId: id },
      });

      updateData.links = {
        create: validated.links.map((link, index) => ({
          title: link.title,
          url: link.url,
          icon: link.icon,
          position: index,
        })),
      };
    }

    return db.collection.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true,
            image: true,
          },
        },
        links: {
          orderBy: { position: "asc" },
        },
        votes: true,
      },
    });
  },

  async delete(id: string, userId: string) {
    const collection = await db.collection.findUnique({
      where: { id },
    });

    if (!collection) {
      throw new Error("Collection not found");
    }

    if (collection.userId !== userId) {
      throw new Error("Unauthorized");
    }

    return db.collection.delete({
      where: { id },
    });
  },

  async vote(collectionId: string, userId: string, voteType: "UP" | "DOWN") {
    const validated = voteSchema.parse({ voteType });
    
    const existingVote = await db.collectionVote.findUnique({
      where: {
        collectionId_userId: {
          collectionId,
          userId,
        },
      },
    });

    if (existingVote) {
      if (existingVote.voteType === validated.voteType) {
        await db.collectionVote.delete({
          where: {
            collectionId_userId: {
              collectionId,
              userId,
            },
          },
        });
        return { action: "removed" };
      } else {
        await db.collectionVote.update({
          where: {
            collectionId_userId: {
              collectionId,
              userId,
            },
          },
          data: {
            voteType: validated.voteType,
          },
        });
        return { action: "updated" };
      }
    } else {
      await db.collectionVote.create({
        data: {
          collectionId,
          userId,
          voteType: validated.voteType,
        },
      });
      return { action: "created" };
    }
  },
};

