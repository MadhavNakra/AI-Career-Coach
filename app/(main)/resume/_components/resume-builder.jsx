"use client";

import { useEffect, useState, createElement } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  Download,
  Edit,
  Loader2,
  Monitor,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import MDEditor from "@uiw/react-md-editor";

import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

import { saveResume } from "@/actions/resume";
import { EntryForm } from "./entry-form";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/nextjs";
import { entriesToMarkdown } from "@/app/lib/helper";
import { resumeSchema } from "@/app/lib/schema";

export default function ResumeBuilder({ initialContent }) {
  const [activeTab, setActiveTab] = useState("edit");
  const [previewContent, setPreviewContent] =
    useState(initialContent || "");

  const [resumeMode, setResumeMode] =
    useState("preview");

  const [isGenerating, setIsGenerating] =
    useState(false);

  const { user } = useUser();

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resumeSchema),

    defaultValues: {
      contactInfo: {
        email: "",
        mobile: "",
        linkedin: "",
        twitter: "",
      },
      summary: "",
      skills: "",
      experience: [],
      education: [],
      projects: [],
    },
  });

  /*
   * Save resume
   */
  const {
    loading: isSaving,
    fn: saveResumeFn,
    data: saveResult,
    error: saveError,
  } = useFetch(saveResume);

  /*
   * Watch all form values
   */
  const formValues = watch();

  /*
   * If an existing resume exists,
   * open the preview tab.
   */
  useEffect(() => {
    if (initialContent) {
      setActiveTab("preview");
    }
  }, [initialContent]);

  /*
   * Generate markdown whenever
   * form data changes.
   */
  useEffect(() => {
    if (activeTab !== "edit") {
      return;
    }

    const newContent = getCombinedContent();

    setPreviewContent(
      newContent || initialContent || ""
    );
  }, [formValues, activeTab]);

  /*
   * Handle save result
   */
  useEffect(() => {
    if (saveResult && !isSaving) {
      toast.success(
        "Resume saved successfully!"
      );
    }

    if (saveError) {
      toast.error(
        saveError.message ||
          "Failed to save resume"
      );
    }
  }, [
    saveResult,
    saveError,
    isSaving,
  ]);

  /*
   * Create contact section
   * for the Markdown preview.
   */
  const getContactMarkdown = () => {
    const { contactInfo = {} } =
      formValues;

    const parts = [];

    if (contactInfo.email) {
      parts.push(
        `📧 ${contactInfo.email}`
      );
    }

    if (contactInfo.mobile) {
      parts.push(
        `📱 ${contactInfo.mobile}`
      );
    }

    if (contactInfo.linkedin) {
      parts.push(
        `💼 [LinkedIn](${contactInfo.linkedin})`
      );
    }

    if (contactInfo.twitter) {
      parts.push(
        `🐦 [Twitter](${contactInfo.twitter})`
      );
    }

    if (parts.length === 0) {
      return "";
    }

    return `## <div align="center">${
      user?.fullName || ""
    }</div>

<div align="center">

${parts.join(" | ")}

</div>`;
  };

  /*
   * Combine all form data into
   * the Markdown preview.
   */
  const getCombinedContent = () => {
    const {
      summary,
      skills,
      experience,
      education,
      projects,
    } = formValues;

    return [
      getContactMarkdown(),

      summary &&
        `## Professional Summary\n\n${summary}`,

      skills &&
        `## Skills\n\n${skills}`,

      entriesToMarkdown(
        experience,
        "Work Experience"
      ),

      entriesToMarkdown(
        education,
        "Education"
      ),

      entriesToMarkdown(
        projects,
        "Projects"
      ),
    ]
      .filter(Boolean)
      .join("\n\n");
  };

  /*
   * ==========================================================
   * GENERATE PDF
   * ==========================================================
   *
   * IMPORTANT:
   *
   * We do NOT use:
   * - html2pdf.js
   * - html2canvas
   * - MDEditor DOM
   * - document.getElementById()
   * - hidden HTML
   *
   * @react-pdf/renderer creates the PDF directly.
   */
  const generatePDF = async () => {
    setIsGenerating(true);

    try {
      /*
       * Dynamically import @react-pdf/renderer.
       *
       * This keeps PDF-specific browser code out
       * of the initial Next.js rendering path.
       */
      const {
        pdf,
      } = await import(
        "@react-pdf/renderer"
      );

      /*
       * Dynamically import our PDF component.
       */
      const {
        default: ResumePDF,
      } = await import(
        "./resume-pdf"
      );

      /*
       * Create the PDF React element.
       *
       * We use the structured form data directly
       * instead of converting Markdown back into HTML.
       */
      const resumeElement =
        createElement(
          ResumePDF,
          {
            data: {
              ...formValues,

              /*
               * Name comes from Clerk.
               */
              name:
                user?.fullName || "",
            },
          }
        );

      /*
       * Generate the PDF Blob.
       */
      const blob = await pdf(
        resumeElement
      ).toBlob();

      /*
       * Create temporary browser URL.
       */
      const url =
        URL.createObjectURL(blob);

      /*
       * Create download link.
       */
      const link =
        document.createElement("a");

      link.href = url;
      link.download =
        "resume.pdf";

      /*
       * Trigger download.
       */
      document.body.appendChild(link);

      link.click();

      /*
       * Clean up.
       */
      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      toast.success(
        "Resume PDF downloaded successfully!"
      );
    } catch (error) {
      console.error(
        "PDF generation error:",
        error
      );

      toast.error(
        error?.message ||
          "Failed to generate PDF"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  /*
   * ==========================================================
   * SAVE RESUME
   * ==========================================================
   */
  const onSubmit = async () => {
    try {
      const formattedContent =
        previewContent
          .replace(/\n/g, "\n")
          .replace(
            /\n\s*\n/g,
            "\n\n"
          )
          .trim();

      console.log(
        "Resume content:",
        formattedContent
      );

      await saveResumeFn(
        formattedContent
      );
    } catch (error) {
      console.error(
        "Save error:",
        error
      );
    }
  };

  return (
    <div
      data-color-mode="light"
      className="space-y-4"
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col md:flex-row justify-between items-center gap-2">
        <h1 className="font-bold gradient-title text-5xl md:text-6xl">
          Resume Builder
        </h1>

        <div className="space-x-2">
          {/* SAVE */}

          <Button
            variant="destructive"
            type="button"
            onClick={handleSubmit(
              onSubmit
            )}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save
              </>
            )}
          </Button>

          {/* DOWNLOAD PDF */}

          <Button
            type="button"
            onClick={generatePDF}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </>
            )}
          </Button>
        </div>
      </div>

      {/* =====================================================
          TABS
      ====================================================== */}

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList>
          <TabsTrigger value="edit">
            Form
          </TabsTrigger>

          <TabsTrigger value="preview">
            Markdown
          </TabsTrigger>
        </TabsList>

        {/* ===================================================
            EDIT TAB
        ==================================================== */}

        <TabsContent value="edit">
          <form
            onSubmit={handleSubmit(
              onSubmit
            )}
            className="space-y-8"
          >
            {/* =================================================
                CONTACT INFORMATION
            ================================================== */}

            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                Contact Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
                {/* EMAIL */}

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Email
                  </label>

                  <Input
                    {...register(
                      "contactInfo.email"
                    )}
                    type="email"
                    placeholder="your@email.com"
                    error={
                      errors.contactInfo
                        ?.email
                    }
                  />

                  {errors.contactInfo
                    ?.email && (
                    <p className="text-sm text-red-500">
                      {
                        errors.contactInfo
                          .email
                          .message
                      }
                    </p>
                  )}
                </div>

                {/* MOBILE */}

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Mobile Number
                  </label>

                  <Input
                    {...register(
                      "contactInfo.mobile"
                    )}
                    type="tel"
                    placeholder="+91 9876543210"
                  />
                </div>

                {/* LINKEDIN */}

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    LinkedIn URL
                  </label>

                  <Input
                    {...register(
                      "contactInfo.linkedin"
                    )}
                    type="url"
                    placeholder="https://linkedin.com/in/your-profile"
                  />
                </div>

                {/* TWITTER */}

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Twitter/X Profile
                  </label>

                  <Input
                    {...register(
                      "contactInfo.twitter"
                    )}
                    type="url"
                    placeholder="https://twitter.com/your-handle"
                  />
                </div>
              </div>
            </div>

            {/* =================================================
                PROFESSIONAL SUMMARY
            ================================================== */}

            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                Professional Summary
              </h3>

              <Controller
                name="summary"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    className="h-32"
                    placeholder="Write a compelling professional summary..."
                    error={errors.summary}
                  />
                )}
              />

              {errors.summary && (
                <p className="text-sm text-red-500">
                  {errors.summary.message}
                </p>
              )}
            </div>

            {/* =================================================
                SKILLS
            ================================================== */}

            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                Skills
              </h3>

              <Controller
                name="skills"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    className="h-32"
                    placeholder="List your key skills..."
                    error={errors.skills}
                  />
                )}
              />

              {errors.skills && (
                <p className="text-sm text-red-500">
                  {errors.skills.message}
                </p>
              )}
            </div>

            {/* =================================================
                EXPERIENCE
            ================================================== */}

            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                Work Experience
              </h3>

              <Controller
                name="experience"
                control={control}
                render={({ field }) => (
                  <EntryForm
                    type="Experience"
                    entries={
                      field.value
                    }
                    onChange={
                      field.onChange
                    }
                  />
                )}
              />
            </div>

            {/* =================================================
                EDUCATION
            ================================================== */}

            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                Education
              </h3>

              <Controller
                name="education"
                control={control}
                render={({ field }) => (
                  <EntryForm
                    type="Education"
                    entries={
                      field.value
                    }
                    onChange={
                      field.onChange
                    }
                  />
                )}
              />
            </div>

            {/* =================================================
                PROJECTS
            ================================================== */}

            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                Projects
              </h3>

              <Controller
                name="projects"
                control={control}
                render={({ field }) => (
                  <EntryForm
                    type="Project"
                    entries={
                      field.value
                    }
                    onChange={
                      field.onChange
                    }
                  />
                )}
              />
            </div>
          </form>
        </TabsContent>

        {/* =====================================================
            PREVIEW TAB
        ====================================================== */}

        <TabsContent value="preview">
          {/* EDIT / PREVIEW BUTTON */}

          {activeTab === "preview" && (
            <Button
              variant="link"
              type="button"
              className="mb-2"
              onClick={() =>
                setResumeMode(
                  resumeMode ===
                    "preview"
                    ? "edit"
                    : "preview"
                )
              }
            >
              {resumeMode ===
              "preview" ? (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Resume
                </>
              ) : (
                <>
                  <Monitor className="h-4 w-4 mr-2" />
                  Show Preview
                </>
              )}
            </Button>
          )}

          {/* WARNING */}

          {activeTab === "preview" &&
            resumeMode !==
              "preview" && (
              <div className="flex p-3 gap-2 items-center border-2 border-yellow-600 text-yellow-600 rounded mb-2">
                <AlertTriangle className="h-5 w-5" />

                <span className="text-sm">
                  You will lose edited
                  markdown if you update
                  the form data.
                </span>
              </div>
            )}

          {/* MARKDOWN EDITOR */}

          <div className="border rounded-lg">
            <MDEditor
              value={previewContent}
              onChange={
                setPreviewContent
              }
              height={800}
              preview={resumeMode}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
