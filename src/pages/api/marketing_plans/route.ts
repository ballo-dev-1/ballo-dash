import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/db/db";
import { marketingPlans } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "GET": {
      const { companyId, timeframe, periodStart } = req.query;
      if (!companyId || !timeframe || !periodStart) {
        return res
          .status(400)
          .json({ error: "Missing required query parameters." });
      }

      try {
        const plans = await db
          .select()
          .from(marketingPlans)
          .where(
            and(
              eq(marketingPlans.companyId, companyId as string),
              eq(marketingPlans.timeframe, timeframe as string),
              eq(marketingPlans.periodStart, new Date(periodStart as string))
            )
          );

        return res.status(200).json(plans[0] ?? null);
      } catch (error) {
        console.error("Failed to fetch marketing plan:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }

    case "POST": {
      const body = req.body;
      try {
        const result = await db
          .insert(marketingPlans)
          .values({ ...body, createdAt: new Date(), updatedAt: new Date() })
          .returning();
        return res.status(201).json(result[0]);
      } catch (error) {
        console.error("Failed to create marketing plan:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }

    case "PUT": {
      const body = req.body;
      const { id } = body;

      if (!id) return res.status(400).json({ error: "Missing plan ID" });

      try {
        const result = await db
          .update(marketingPlans)
          .set({ ...body, updatedAt: new Date() })
          .where(eq(marketingPlans.id, id))
          .returning();
        return res.status(200).json(result[0]);
      } catch (error) {
        console.error("Failed to update marketing plan:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }

    case "DELETE": {
      const { id } = req.query;

      if (!id) return res.status(400).json({ error: "Missing plan ID" });

      try {
        await db
          .delete(marketingPlans)
          .where(eq(marketingPlans.id, id as string));

        return res.status(200).json({ message: "Plan deleted" });
      } catch (error) {
        console.error("Failed to delete marketing plan:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }

    default:
      return res
        .setHeader("Allow", ["GET", "POST", "PUT", "DELETE"])
        .status(405)
        .end(`Method ${method} Not Allowed`);
  }
}
