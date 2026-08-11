"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingLeft: 45,
    paddingRight: 45,
    backgroundColor: "#FFFFFF",
    color: "#000000",
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.35,
  },

  name: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 6,
  },

  contact: {
    textAlign: "center",
    fontSize: 9,
    marginBottom: 14,
  },

  section: {
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
  },

  summary: {
    fontSize: 9.5,
    marginBottom: 5,
  },

  skills: {
    fontSize: 9.5,
  },

  entry: {
    marginBottom: 9,
  },

  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },

  entryTitle: {
    fontSize: 10,
    fontWeight: "bold",
  },

  organization: {
    fontSize: 9.5,
    fontWeight: "bold",
  },

  date: {
    fontSize: 9,
  },

  description: {
    fontSize: 9.5,
    marginTop: 3,
  },

  link: {
    color: "#000000",
    textDecoration: "none",
  },
});

const ResumePDF = ({ data }) => {
  const {
    contactInfo = {},
    summary = "",
    skills = "",
    experience = [],
    education = [],
    projects = [],
  } = data || {};

  const renderEntry = (entry, index) => {
    return (
      <View
        key={index}
        style={styles.entry}
      >
        <View style={styles.entryHeader}>
          <View>
            <Text style={styles.entryTitle}>
              {entry.title}
            </Text>

            <Text style={styles.organization}>
              {entry.organization}
            </Text>
          </View>

          <Text style={styles.date}>
            {entry.startDate}
            {" - "}
            {entry.current
              ? "Present"
              : entry.endDate}
          </Text>
        </View>

        <Text style={styles.description}>
          {entry.description}
        </Text>
      </View>
    );
  };

  return (
    <Document>
      <Page
        size="A4"
        style={styles.page}
        wrap
      >
        {/* NAME */}

        <Text style={styles.name}>
          {data?.name || ""}
        </Text>

        {/* CONTACT */}

        <Text style={styles.contact}>
          {contactInfo.email || ""}

          {contactInfo.mobile
            ? ` | ${contactInfo.mobile}`
            : ""}

          {contactInfo.linkedin
            ? ` | ${contactInfo.linkedin}`
            : ""}

          {contactInfo.twitter
            ? ` | ${contactInfo.twitter}`
            : ""}
        </Text>

        {/* SUMMARY */}

        {summary && (
          <View style={styles.section}>
            <Text
              style={styles.sectionTitle}
            >
              Professional Summary
            </Text>

            <Text style={styles.summary}>
              {summary}
            </Text>
          </View>
        )}

        {/* SKILLS */}

        {skills && (
          <View style={styles.section}>
            <Text
              style={styles.sectionTitle}
            >
              Skills
            </Text>

            <Text style={styles.skills}>
              {skills}
            </Text>
          </View>
        )}

        {/* EXPERIENCE */}

        {experience.length > 0 && (
          <View style={styles.section}>
            <Text
              style={styles.sectionTitle}
            >
              Work Experience
            </Text>

            {experience.map(
              renderEntry
            )}
          </View>
        )}

        {/* EDUCATION */}

        {education.length > 0 && (
          <View style={styles.section}>
            <Text
              style={styles.sectionTitle}
            >
              Education
            </Text>

            {education.map(
              renderEntry
            )}
          </View>
        )}

        {/* PROJECTS */}

        {projects.length > 0 && (
          <View style={styles.section}>
            <Text
              style={styles.sectionTitle}
            >
              Projects
            </Text>

            {projects.map(
              renderEntry
            )}
          </View>
        )}
      </Page>
    </Document>
  );
};

export default ResumePDF;

