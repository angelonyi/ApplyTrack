
import { supabase } from "./supabase.js";

// ApplyTrack application logic
const $ = (selector) => document.querySelector(selector);

function showMessage(element, message, isError = false) {
    if (!element) return;
    element.textContent = message;
    element.style.color = isError
        ? "var(--md-sys-color-error)"
        : "var(--md-sys-color-primary)";
}

function getToday() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

// -------------------------------------
// 1. SIGN UP AND SIGN IN
// -------------------------------------
const authForm = $("#auth-form");

if (authForm) {
    let isSignUp = false;

    const title = $("#auth-title");
    const description = $("#auth-description");
    const submitButton = $("#auth-submit");
    const toggleButton = $("#auth-toggle");
    const fullNameGroup = $("#full-name-group");
    fullNameGroup.hidden = !isSignUp;
    $("#full-name").required = isSignUp;
    const switchText = $("#auth-switch-text");
    const message = $("#auth-message");
    const passwordInput = $("#password");
    // Show or hide password
    const passwordVisibilityButton = $("#toggle-password-visibility");

    if (passwordVisibilityButton) {
        passwordVisibilityButton.addEventListener("click", () => {
            const isHidden = passwordInput.type === "password";

            passwordInput.type = isHidden ? "text" : "password";

            passwordVisibilityButton.setAttribute(
                "aria-label",
                isHidden ? "Hide password" : "Show password"
            );

            passwordVisibilityButton.setAttribute(
                "aria-pressed",
                String(isHidden)
            );
        });
    }

    // Validate email while the user types
    const emailInput = $("#email");
    const emailFeedback = $("#email-feedback");

    if (emailInput && emailFeedback) {
        emailInput.addEventListener("input", () => {
            emailInput.setCustomValidity("");

            const email = emailInput.value.trim();

            if (!email) {
                emailFeedback.textContent = "";
                return;
            }

            if (!emailInput.validity.valid) {
                emailFeedback.textContent =
                    "Please enter a valid email address.";
                emailInput.setCustomValidity(
                    "Please enter a valid email address."
                );
            } else {
                emailFeedback.textContent = "";
            }
        });

        emailInput.addEventListener("blur", () => {
            if (!emailInput.value.trim()) {
                emailFeedback.textContent =
                    "Email address is required.";
            }
        });
    }



    toggleButton.addEventListener("click", () => {
        isSignUp = !isSignUp;
        fullNameGroup.hidden = !isSignUp;
        $("#full-name").required = isSignUp;
        title.textContent = isSignUp ? "Create your account" : "Welcome back";
        description.textContent = isSignUp
            ? "Create an account to organise your job search."
            : "Sign in to keep your job search organised.";
        submitButton.textContent = isSignUp ? "Create account" : "Sign in";
        toggleButton.textContent = isSignUp ? "Sign in" : "Create account";
        switchText.textContent = isSignUp
            ? "Already have an account?"
            : "Don't have an account?";
        passwordInput.autocomplete = isSignUp
            ? "new-password"
            : "current-password";

        showMessage(message, "");
    });

    authForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = $("#email").value.trim();
        const password = passwordInput.value;

        submitButton.disabled = true;
        showMessage(message, "Please wait...");

        try {

            if (isSignUp) {
                const fullName = $("#full-name").value.trim();

                if (!fullName) {
                    showMessage(message, "Please enter your full name.");
                    return;
                }

                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName
                        }
                    }
                });


                if (error) throw error;

                if (data.session) {
                    window.location.href = "dashboard.html";
                } else {
                    showMessage(
                        message,
                        "Account created. Check your email to confirm your account before signing in."
                    );
                }
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });

                if (error) throw error;
                window.location.href = "dashboard.html";
            }
        } catch (error) {
            showMessage(message, error.message, true);
        } finally {
            submitButton.disabled = false;
        }
    });

    supabase.auth.getSession().then(({ data }) => {
        if (data.session) {
            window.location.href = "dashboard.html";
        }
    });
}

// -------------------------------------
// 2. DASHBOARD AND AUTHENTICATION
// -------------------------------------
const applicationsList = $("#applications-list");

if (applicationsList) {
    let currentUser = null;
    let applications = [];

    const applicationForm = $("#application-form");
    const formSection = $("#application-form-section");
    const formMessage = $("#application-message");
    const formTitle = $("#application-form-title");
    const saveButton = applicationForm.querySelector('button[type="submit"]');
    const filter = $("#status-filter");

    let lastFocusedElement = null;

    function openApplicationForm(application = null) {
        lastFocusedElement = document.activeElement;
        applicationForm.reset();

        $("#application-id").value = application?.id || "";
        $("#company").value = application?.company || "";
        $("#role").value = application?.role || "";
        $("#date-applied").value = application?.date_applied || getToday();
        $("#job-link").value = application?.job_link || "";
        $("#status").value = application?.status || "Applied";
        $("#follow-up-date").value = application?.follow_up_date || "";
        $("#notes").value = application?.notes || "";

        formTitle.textContent = application ? "Edit application" : "Add an application";
        saveButton.textContent = application ? "Update application" : "Save application";
        showMessage(formMessage, "");

        formSection.hidden = false;
        document.body.style.overflow = "hidden";

        const modal = formSection.querySelector(".application-modal");
        if (modal) modal.scrollTop = 0;
        formSection.scrollTop = 0;
    }

    function closeApplicationForm() {
        formSection.hidden = true;
        document.body.style.overflow = "";
        applicationForm.reset();
        $("#application-id").value = "";
        showMessage(formMessage, "");

        if (lastFocusedElement?.isConnected) {
            lastFocusedElement.focus();
        }
    }

    $("#add-application").addEventListener("click", () => {
        openApplicationForm();
    });

    $("#empty-add-application").addEventListener("click", () => {
        openApplicationForm();
    });

    $("#cancel-application").addEventListener("click", () => {
        closeApplicationForm();
    });

    $("#close-application-modal").addEventListener("click", () => {
        closeApplicationForm();
    });

    // Close when the user clicks the dark backdrop.
    formSection.addEventListener("click", (event) => {
        if (event.target === formSection) {
            closeApplicationForm();
        }
    });

    // Close when the user presses Escape.
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !formSection.hidden) {
            closeApplicationForm();
        }
    });

    // -------------------------------------
    // 3. DISPLAY APPLICATIONS AND COUNTS
    // -------------------------------------
    function createTextElement(tag, className, text) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        element.textContent = text;
        return element;
    }

    function renderApplications() {
        const selectedStatus = filter.value;

        const visibleApplications = applications.filter((application) => {
            return selectedStatus === "all" || application.status === selectedStatus;
        });

        $("#total-count").textContent = applications.length;

        $("#interview-count").textContent = applications.filter(
            (application) => application.status === "Interview"
        ).length;

        $("#offer-count").textContent = applications.filter(
            (application) => application.status === "Offer"
        ).length;

        const today = getToday();

        $("#follow-up-count").textContent = applications.filter(
            (application) =>
                application.follow_up_date &&
                application.follow_up_date <= today &&
                !["Offer", "Rejected", "Withdrawn"].includes(application.status)
        ).length;

        applicationsList.replaceChildren();

        if (visibleApplications.length === 0) {
            const emptyState = document.createElement("div");
            emptyState.className = "empty-state";

            emptyState.append(
                createTextElement(
                    "h3",
                    "",
                    applications.length === 0
                        ? "Your job search starts here"
                        : "No applications match this filter"
                ),
                createTextElement(
                    "p",
                    "",
                    applications.length === 0
                        ? "Add your first application to start tracking your progress."
                        : "Try selecting another application status."
                )
            );

            if (applications.length === 0) {
                const addButton = createTextElement(
                    "button",
                    "btn btn-primary",
                    "Add your first application"
                );

                addButton.type = "button";
                addButton.addEventListener("click", () => openApplicationForm());
                emptyState.append(addButton);
            }

            applicationsList.append(emptyState);
            return;
        }

        visibleApplications.forEach((application) => {
            const card = document.createElement("article");
            card.className = "application-card";

            // Job title and company
            const heading = document.createElement("div");
            heading.className = "application-card-heading";

            heading.append(
                createTextElement("h3", "", application.role),
                createTextElement("p", "", application.company)
            );

            // Application status and date
            const meta = document.createElement("div");
            meta.className = "application-card-meta";

            meta.append(
                createTextElement("span", "status-badge", application.status),
                createTextElement(
                    "span",
                    "application-card-date",
                    `Applied ${application.date_applied}`
                )
            );

            card.append(heading, meta);

            // Optional follow-up information
            if (application.follow_up_date) {
                const followUp = document.createElement("div");
                followUp.className = "application-card-follow-up";

                followUp.append(
                    createTextElement(
                        "span",
                        "",
                        `Follow-up: ${application.follow_up_date}`
                    )
                );

                if (
                    application.follow_up_date <= today &&
                    !["Offer", "Rejected", "Withdrawn"].includes(application.status)
                ) {
                    followUp.append(
                        createTextElement(
                            "span",
                            "follow-up-alert",
                            application.follow_up_date < today ? "Overdue" : "Due today"
                        )
                    );
                }

                card.append(followUp);
            }

            // Optional job posting link
            if (application.job_link) {
                try {
                    const linkUrl = new URL(application.job_link);

                    if (["https:", "http:"].includes(linkUrl.protocol)) {
                        const link = createTextElement(
                            "a",
                            "application-card-link",
                            "View job posting"
                        );

                        link.href = linkUrl.href;
                        link.target = "_blank";
                        link.rel = "noopener noreferrer";
                        card.append(link);
                    }
                } catch {
                    // Ignore invalid links.
                }
            }

            // Optional notes
            if (application.notes) {
                card.append(
                    createTextElement(
                        "p",
                        "application-card-notes",
                        application.notes
                    )
                );
            }

            // Edit and Delete buttons
            const actions = document.createElement("div");
            actions.className = "application-card-actions";

            const editButton = createTextElement("button", "", "Edit");
            editButton.type = "button";

            editButton.addEventListener("click", () => {
                openApplicationForm(application);
            });

            const deleteButton = createTextElement("button", "", "Delete");
            deleteButton.type = "button";

            deleteButton.addEventListener("click", async () => {
                const confirmed = window.confirm(
                    `Delete the application for ${application.role} at ${application.company}?`
                );

                if (!confirmed) return;

                deleteButton.disabled = true;

                try {
                    const { error } = await supabase
                        .from("applications")
                        .delete()
                        .eq("id", application.id)
                        .eq("user_id", currentUser.id);

                    if (error) throw error;

                    await loadApplications();
                } catch (error) {
                    window.alert(`Could not delete application: ${error.message}`);
                    deleteButton.disabled = false;
                }
            });

            actions.append(editButton, deleteButton);
            card.append(actions);
            applicationsList.append(card);
        });
    }

    // -------------------------------------
    // 4. LOAD APPLICATIONS FROM SUPABASE
    // -------------------------------------
    async function loadApplications() {
        applicationsList.textContent = "Loading applications...";

        const { data, error } = await supabase
            .from("applications")
            .select("*")
            .eq("user_id", currentUser.id)
            .order("date_applied", { ascending: false });

        if (error) {
            applicationsList.textContent = `Could not load applications: ${error.message}`;
            return;
        }

        applications = data || [];
        renderApplications();
    }

    filter.addEventListener("change", renderApplications);

    // -------------------------------------
    // 5. ADD AND UPDATE APPLICATIONS
    // -------------------------------------
    applicationForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const applicationId = $("#application-id").value;

        const applicationData = {
            company: $("#company").value.trim(),
            role: $("#role").value.trim(),
            date_applied: $("#date-applied").value,
            job_link: $("#job-link").value.trim() || null,
            status: $("#status").value,
            follow_up_date: $("#follow-up-date").value || null,
            notes: $("#notes").value.trim() || null,
            updated_at: new Date().toISOString()
        };

        saveButton.disabled = true;
        showMessage(formMessage, "Saving application...");

        try {
            let result;

            if (applicationId) {
                result = await supabase
                    .from("applications")
                    .update(applicationData)
                    .eq("id", applicationId)
                    .eq("user_id", currentUser.id)
                    .select();
            } else {
                result = await supabase
                    .from("applications")
                    .insert({
                        ...applicationData,
                        user_id: currentUser.id
                    })
                    .select();
            }

            if (result.error) throw result.error;

            if (!result.data || result.data.length === 0) {
                throw new Error("No record was changed. Please refresh and try again.");
            }

            closeApplicationForm();
            await loadApplications();
        } catch (error) {
            showMessage(
                formMessage,
                `Could not save application: ${error.message}`,
                true
            );
        } finally {
            saveButton.disabled = false;
        }
    });

    // -------------------------------------
    // 6. SIGN OUT AND START DASHBOARD
    // -------------------------------------
    $("#sign-out").addEventListener("click", async () => {
        const { error } = await supabase.auth.signOut();

        if (error) {
            window.alert(`Could not sign out: ${error.message}`);
            return;
        }

        window.location.href = "index.html";
    });

    async function initialiseDashboard() {
        const { data, error } = await supabase.auth.getSession();

        if (error || !data.session) {
            window.location.href = "index.html";
            return;
        }


        currentUser = data.session.user;

        // Display the signed-in user's name
        const userName = document.querySelector("#user-name");
        const fullName = currentUser.user_metadata?.full_name;

        if (userName) {
            userName.textContent = fullName || currentUser.email || "there";
        }

        await loadApplications();

    }

    initialiseDashboard();
}
