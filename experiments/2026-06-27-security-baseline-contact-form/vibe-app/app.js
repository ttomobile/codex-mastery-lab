const form = document.querySelector("#lead-form");
const submissionList = document.querySelector("#submission-list");
const emptyState = document.querySelector("#empty-state");
const submissions = [];

function getFormValue(formData, fieldName) {
  return String(formData.get(fieldName) || "").trim();
}

function buildSubmissionCard(submission) {
  const card = document.createElement("article");
  card.className = "submission-card";

  const header = document.createElement("header");
  const title = document.createElement("h3");
  title.textContent = submission.name;

  const submittedAt = document.createElement("time");
  submittedAt.dateTime = submission.isoTime;
  submittedAt.textContent = submission.displayTime;

  header.append(title, submittedAt);

  const meta = document.createElement("p");
  meta.className = "submission-meta";

  [submission.email, submission.companySize, submission.budget].forEach((value) => {
    const item = document.createElement("span");
    item.textContent = value;
    meta.append(item);
  });

  const message = document.createElement("p");
  message.className = "submission-message";
  message.textContent = submission.message;

  card.append(header, meta, message);
  return card;
}

function renderSubmissions() {
  submissionList.replaceChildren();
  emptyState.hidden = submissions.length > 0;

  submissions.forEach((submission) => {
    submissionList.append(buildSubmissionCard(submission));
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const formData = new FormData(form);
  const now = new Date();

  submissions.unshift({
    name: getFormValue(formData, "name"),
    email: getFormValue(formData, "email"),
    companySize: getFormValue(formData, "companySize"),
    budget: getFormValue(formData, "budget"),
    message: getFormValue(formData, "message"),
    isoTime: now.toISOString(),
    displayTime: now.toLocaleString([], {
      dateStyle: "medium",
      timeStyle: "short",
    }),
  });

  submissions.splice(3);
  renderSubmissions();
  form.reset();
  form.querySelector("#name").focus();
});
