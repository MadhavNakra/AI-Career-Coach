"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const generateAIInsights = async (industry) => {
  const prompt = `
Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format:

{
  "salaryRanges": [
    {
      "role": "string",
      "min": number,
      "max": number,
      "median": number,
      "location": "string"
    }
  ],
  "growthRate": number,
  "demandLevel": "High" | "Medium" | "Low",
  "topSkills": ["skill1", "skill2"],
  "marketOutlook": "Positive" | "Neutral" | "Negative",
  "keyTrends": ["trend1", "trend2"],
  "recommendedSkills": ["skill1", "skill2"]
}

IMPORTANT:
- Return ONLY valid JSON.
- Do not include markdown.
- Do not include code fences.
- Include at least 5 common roles in salaryRanges.
- Growth rate should be a number representing a percentage.
- Include at least 5 skills in topSkills.
- Include at least 5 trends in keyTrends.
- Include at least 5 recommended skills.
`;

  const result = await genAI.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
  });

  const text = result.text;

  const cleanedText = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const parsed = JSON.parse(cleanedText);

  const normalizeEnumValue = (value, allowed, fallback) => {
    if (typeof value !== "string") return fallback;
    const normalized = value.trim().toUpperCase();
    if (allowed.includes(normalized)) return normalized;
    const cleaned = normalized.replace(/[^A-Z]/g, "");
    return allowed.includes(cleaned) ? cleaned : fallback;
  };

  const normalized = {
    ...parsed,
    demandLevel: normalizeEnumValue(parsed.demandLevel, ["HIGH", "MEDIUM", "LOW"], "MEDIUM"),
    marketOutlook: normalizeEnumValue(parsed.marketOutlook, ["POSITIVE", "NEUTRAL", "NEGATIVE"], "NEUTRAL"),
  };

  return normalized;
};

export async function getIndustryInsights() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
    include: {
      industryInsight: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // If no insights exist, generate them
  if (!user.industryInsight) {
    const insights = await generateAIInsights(user.industry);

    const industryInsight = await db.industryInsight.create({
      data: {
        industry: user.industry,
        ...insights,
        nextUpdate: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        ),
      },
    });

    return industryInsight;
  }

  return user.industryInsight;
}