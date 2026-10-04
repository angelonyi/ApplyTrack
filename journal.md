# ApplyTrack — Development Journal

## Project Overview

**Project:** ApplyTrack  
**Developer:** Angel Egede  
**Project type:** Job application tracking web application  
**Status:** Development in progress

### Project Goal

Build a web application that helps job seekers organise their job search and keep track of their applications in one place.

The goal is to create a useful, working product that can be demonstrated, deployed, and improved based on real user needs.

---

## Development Log

### 1. Building the Application

The project was developed using HTML, CSS, JavaScript, and Supabase.

The application includes an authentication page and a separate dashboard page. Supabase is used for account authentication and session handling.

### 2. Authentication and Account Creation

The authentication interface supports switching between account creation and sign-in.

Work completed:
- Added email and password fields.
- Added a password visibility control.
- Added email validation feedback.
- Added a full-name field for new accounts.
- Configured the registration request to send the full name as Supabase user metadata.
- Added logic to show the full-name field during account creation and hide it during sign-in.
- Added logic to display the signed-in user's name on the dashboard.

### 3. Debugging JavaScript

During development, a JavaScript error occurred because the identifier `emailInput` was declared more than once in the same scope.

The duplicate email-validation block was identified and removed.

**Lesson:** When adding new functionality, check whether related code already exists before inserting another copy. A single JavaScript syntax error can prevent other functionality from running.

### 4. Dashboard Greeting

The dashboard was updated to display a greeting using the signed-in user's name from Supabase authentication metadata.

The greeting was adjusted to remove unwanted punctuation and fallback text.

**Lesson:** Saving user information and displaying that information in the interface are separate implementation tasks.

### 5. User Interface Refinements

The authentication form was adjusted so the full-name field is hidden on initial page load and shown when account creation is selected.

Further testing is needed to ensure the selected authentication mode behaves as expected after refreshing the page.

---

## Current Implementation Status

| Area | Status |
|---|---|
| Authentication interface | Implemented; needs final testing |
| Email and password inputs | Implemented |
| Password visibility control | Added; needs verification |
| Email validation feedback | Added; needs verification |
| Full-name registration field | Implemented |
| Full name in Supabase metadata | Configured; persistence should be verified |
| Dashboard greeting | Implemented |
| Sign-out and session handling | Needs final verification |
| Job application tracking | Needs end-to-end verification |
| Supabase data security | Needs review |
| Vercel deployment | Pending |
| Product demo video | Pending |

---

## Remaining Tasks

### Priority 1 — Confirm the Core Workflow
- Test account creation with a new email address.
- Verify email confirmation behaviour if enabled.
- Test sign-in and sign-out.
- Confirm the dashboard displays the correct user's name.
- Check behaviour after refreshing the authentication page.
- Test the job application tracking features that are implemented.

### Priority 2 — Verify Security and Reliability
- Review Supabase Row Level Security policies.
- Verify that users cannot access another user's private application records.
- Check for JavaScript errors in the browser console.
- Confirm that no private credentials are exposed in the repository.
- Verify error messages and invalid form submissions.

### Priority 3 — Deploy
- Review the final project structure.
- Push the latest working code to GitHub.
- Configure Vercel and the required Supabase settings.
- Deploy the application.
- Test authentication and data operations on the live URL.

### Priority 4 — Record the Demo
- Prepare a short product walkthrough.
- Demonstrate the working application rather than relying on slides.
- Explain the problem, the solution, and the main features.
- Record the demonstration after testing the deployed application.

---

## Lessons Learned

1. Build on working code instead of replacing large sections unnecessarily.
2. Test each change before moving to the next one.
3. Read browser console errors instead of guessing what caused a problem.
4. Separate interface changes from authentication and database logic.
5. Treat security, testing, and deployment as part of building the product.
6. Document what has actually been implemented and distinguish it from planned work.

