import { db } from "@/lib/prisma";
import { inngest } from "./client";
import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const generateIndustryInsights = inngest.createFunction(
  {
    id: "generate-industry-insights",
    name: "Generate Industry Insights",
    triggers: [{ cron: "0 0 * * 0" }],
  },
  async ({ step }) => {
    const industries = await step.run("Fetch industries", async () => {
      return await db.industryInsight.findMany({
        select: {
          industry: true,
        },
      });
    });

    for (const { industry } of industries) {
      const prompt = `Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format:

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
- No additional text.
- No markdown.
- Include at least 5 common roles in salaryRanges.
- Growth rate should be a percentage.
- Include at least 5 skills and trends.`;

      const res = await step.run(
        `Generate insights for ${industry}`,
        async () => {
          return await genAI.models.generateContent({
            model: "gemini-3.6-flash",
            contents: prompt,
          });
        }
      );

      const text = res?.text || "";

      const cleanedText = String(text)
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      let insights;

      try {
        insights = JSON.parse(cleanedText);
      } catch (error) {
        console.error(
          `Failed to parse Gemini response for ${industry}:`,
          cleanedText
        );
        continue;
      }

      await step.run(`Update ${industry} insights`, async () => {
        await db.industryInsight.update({
          where: {
            industry,
          },
          data: {
            ...insights,
            lastUpdated: new Date(),
            nextUpdate: new Date(
              Date.now() + 7 * 24 * 60 * 60 * 1000
            ),
          },
        });
      });
    }
  }
);