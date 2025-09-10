# Worklog: Creating the "LocalSkills" Complex Test Application

**Date:** 2025-09-10

## 1. Problem Definition

The primary goal is to create a new, complex, and entirely original web application to serve as a robust testbed for the `rwsdk` framework. This is necessary because the current test application, `pwv-directory`, is private and cannot be used for public testing or as a shareable example.

The new application must be sufficiently complex, featuring a rich UI, a mix of server and client components, and a non-trivial data model to effectively reveal issues and test the framework's capabilities, similar to how `pwv-directory` has been used.

## 2. Project Proposal: "LocalSkills" - A Community Services Marketplace

After brainstorming several ideas, we decided on building "LocalSkills," a directory and marketplace for local services.

### Core Concept

A platform where users can:
- **Post service requests:** "I'm looking for a graphic designer for a logo."
- **Offer services:** "I am a professional photographer available for events."

This concept was chosen because it allows for a natural and scalable complexity, a good balance of content-driven pages and interactive components, and is fundamentally different from the `pwv-directory` application.

## 3. Key Technical Requirements & Constraints

- **Framework:** Must be built with `rwsdk`.
- **Originality:** The application's purpose, behavior, UI, styling, and functionality must be entirely different from `pwv-directory` to avoid any potential IP issues.
- **Complexity:** The application must be large and complex, with many UI components and varied user flows.
- **Component Model:** Must extensively use both server components (for content-heavy pages like profiles and listings) and client components (for interactive elements like messaging, booking, and maps).
- **Database:** Will use the `rwsdk/db` feature, which is based on SQLite Durable Objects, as per the provided documentation.
- **Testing:** Must have comprehensive and non-flaky end-to-end (E2E) tests.
- **HMR Testing:** E2E tests must specifically cover Hot Module Replacement (HMR) scenarios for various file types and code changes:
    - Modifying server components.
    - Modifying action handlers.
    - Modifying client components.
    - Adding/removing the `"use client"` directive.
    - Adding/removing the `"use server"` directive.
    - Adding new client and server component modules.
    - Testing CSS changes (stylesheet links, CSS Modules, direct CSS imports).
- **Autonomy:** The development, including E2E tests, will be handled autonomously with minimal user intervention.

## 4. Initial Plan

1.  **Project Initialization:**
    - Create this worklog to document the process.
    - Scaffold the project using the `rwsdk` minimal starter: `npx create-rwsdk localskills -t minimal`.
2.  **Foundation & Setup:**
    - Establish the basic project structure.
    - Set up the database using the `rwsdk/db` Durable Objects feature, including initial migrations for core tables (users, services, requests).
    - Configure basic styling and layout.
3.  **Feature Implementation (Iterative):**
    - User Authentication & Profiles.
    - Service Listing and Discovery (Search, Categories).
    - Service Request Posting.
    - Real-time Messaging.
    - Booking/Scheduling System.
    - Reviews and Ratings.
    - Interactive Dashboard for users.
4.  **E2E Testing:**
    - Concurrently develop E2E tests for all features.
    - Implement the specific HMR test suite as required.
5.  **Review and Refinement:**
    - Ensure all requirements are met and the application is stable.
