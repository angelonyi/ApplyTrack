# ApplyTrack

A job application tracking tool designed to help job seekers organise their job search.

## The Problem

Applying for jobs can become difficult to manage when application details, progress, and follow-ups are scattered across different places.

ApplyTrack is my attempt to make that process easier by bringing job application tracking into one place.

## The Solution

ApplyTrack is a web application with user authentication and a dashboard for managing job applications.

The goal is to give users a central place to organise and monitor their job search.

## Technology Stack

- HTML — page structure
- CSS — styling and layout
- JavaScript — application behaviour
- Supabase — authentication and backend services
- Vercel — planned deployment platform

## How I Built It

I built ApplyTrack using HTML, CSS, JavaScript, and Supabase.

During development, I worked on the authentication interface, account creation, password visibility, email validation, and displaying the signed-in user's name on the dashboard.

## Challenges and Decisions

### Fixing a JavaScript Error

A duplicate `emailInput` declaration caused a JavaScript error. I removed the duplicate declaration rather than introducing another variable with the same name.

### Improving Account Creation

I added a full-name field to the registration form and connected it to Supabase user metadata.

### Handling Page Reloads

I discovered that refreshing the page could reset the authentication interface from Create Account to Sign In. Preserving the selected mode is a remaining task.

## Current Status

ApplyTrack is under development. Authentication, dashboard behaviour, application tracking, and database security still need appropriate testing before release.

## Next Steps

1. Complete and test the authentication flow.
2. Verify password visibility and email validation.
3. Preserve the selected authentication mode after a page reload.
4. Test application tracking.
5. Review Supabase Row Level Security policies.
6. Deploy to Vercel and test the live application.
7. Record a product demonstration.


