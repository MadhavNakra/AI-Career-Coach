"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function generateCoverLetter(data) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const prompt = `
Write a professional cover letter for a ${data.jobTitle} position at ${data.companyName}.

About the candidate:
- Industry: ${user.industry || "Not specified"}
- Years of Experience: ${user.experience ?? 0}
- Skills: ${user.skills?.join(", ") || "Not specified"}
- Professional Background: ${user.bio || "Not specified"}

Job Description:
${data.jobDescription}

Requirements:
1. Use a professional and enthusiastic tone.
2. Highlight the candidate's most relevant skills and experience.
3. Show a clear understanding of the company's needs.
4. Keep the cover letter concise and under 400 words.
5. Use proper business letter formatting in markdown.
6. Include specific examples of achievements where possible.
7. Relate the candidate's background directly to the job requirements.
8. Do not invent companies, projects, achievements, metrics, or experience that are not provided.
9. Avoid generic filler and make the letter specific to the provided job description.

Format the response as a complete cover letter in markdown.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    const content = response.text.trim();

    const coverLetter =
      await db.coverLetter.create({
        data: {
          content,
          jobDescription: data.jobDescription,
          companyName: data.companyName,
          jobTitle: data.jobTitle,
          status: "completed",
          userId: user.id,
        },
      });

    return coverLetter;
  } catch (error) {
    console.error(
      "Error generating cover letter:",
      error
    );

    throw new Error(
      "Failed to generate cover letter"
    );
  }
}

export async function getCoverLetters() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return await db.coverLetter.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getCoverLetter(id) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return await db.coverLetter.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });
}

export async function deleteCoverLetter(id) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return await db.coverLetter.delete({
    where: {
      id,
      userId: user.id,
    },
  });
}
