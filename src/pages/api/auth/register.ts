import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/db/db";
import { companies, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { firstName, lastName, email, phone, company, site, industry, password } = req.body || {};
  if (!firstName || !lastName || !email || !phone || !company || !industry || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Create or find company by name + domain/website
    let companyId: string | null = null;

    const existingCompanies = await db
      .select()
      .from(companies)
      .where(eq(companies.name, company));

    if (existingCompanies.length > 0) {
      companyId = existingCompanies[0].id;
    } else {
      const [insertedCompany] = await db
        .insert(companies)
        .values({ name: company, websiteUrl: site || null, domain: site || null })
        .returning({ id: companies.id });
      companyId = insertedCompany.id;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert user
    await db.insert(users).values({
      companyId: companyId!,
      email,
      firstName,
      lastName,
      passwordHash,
      createdBy: firstName,
      updatedBy: firstName,
    });

    return res.status(201).json({ message: "User created" });
  } catch (err: any) {
    console.error("register error", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}


