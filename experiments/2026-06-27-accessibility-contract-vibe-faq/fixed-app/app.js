const faqs = [
  {
    question: "How do I invite a teammate?",
    answer: "Open Settings, choose Members, and send an invitation to their work email. New teammates can be assigned a role before they accept.",
    tag: "Team"
  },
  {
    question: "Can I enable single sign-on?",
    answer: "Yes. SSO is available on Business and Enterprise plans. Admins can configure SAML from Settings after verifying the company domain.",
    tag: "Security"
  },
  {
    question: "Where can I update billing details?",
    answer: "Billing owners can update payment methods, billing contacts, and invoice details from Settings under Billing.",
    tag: "Billing"
  },
  {
    question: "How do exports work?",
    answer: "Workspace admins can export projects as CSV files from the Reports area. Large exports are delivered by email when they are ready.",
    tag: "Data"
  },
  {
    question: "Does Vibe support Slack notifications?",
    answer: "Yes. Connect Slack from Integrations, pick a channel, and choose which project events should post updates.",
    tag: "Integrations"
  },
  {
    question: "Can I restore deleted projects?",
    answer: "Deleted projects remain recoverable for 30 days. Go to Settings, select Trash, and restore the project from the list.",
    tag: "Projects"
  },
  {
    question: "How do I change notification preferences?",
    answer: "Open your profile menu, select Notifications, and adjust email, desktop, and digest settings for each workspace.",
    tag: "Account"
  },
  {
    question: "What roles are available for users?",
    answer: "Workspaces include owner, admin, editor, and viewer roles. Each role controls access to billing, member management, and project changes.",
    tag: "Permissions"
  },
  {
    question: "Is there an audit log?",
    answer: "Enterprise workspaces include searchable audit logs for sign-ins, role changes, exports, billing events, and integration updates.",
    tag: "Compliance"
  }
];

const form = document.querySelector("#search-form");
const searchInput = document.querySelector("#faq-search");
const list = document.querySelector("#faq-list");
const noResults = document.querySelector("#no-results");
const resultStatus = document.querySelector("#result-status");

function normalize(value) {
  return value.trim().toLowerCase();
}

function createFaqItem(faq, index) {
  const item = document.createElement("li");
  item.className = "faq-item";

  const button = document.createElement("button");
  button.className = "faq-toggle";
  button.type = "button";
  button.id = `faq-toggle-${index}`;
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-controls", `faq-answer-${index}`);

  const question = document.createElement("span");
  question.textContent = faq.question;

  const icon = document.createElement("span");
  icon.className = "toggle-icon";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = "+";

  const answer = document.createElement("div");
  answer.className = "faq-answer";
  answer.id = `faq-answer-${index}`;
  answer.setAttribute("role", "region");
  answer.setAttribute("aria-labelledby", button.id);
  answer.hidden = true;

  const answerText = document.createElement("p");
  answerText.textContent = faq.answer;

  const tag = document.createElement("span");
  tag.className = "tag";
  tag.textContent = faq.tag;

  button.addEventListener("click", () => {
    const isExpanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!isExpanded));
    answer.hidden = isExpanded;
    icon.textContent = isExpanded ? "+" : "-";
  });

  button.append(question, icon);
  answer.append(answerText, tag);
  item.append(button, answer);
  return item;
}

function getMatches(query) {
  if (!query) {
    return faqs;
  }

  return faqs.filter((faq) => {
    const searchableText = `${faq.question} ${faq.answer} ${faq.tag}`.toLowerCase();
    return searchableText.includes(query);
  });
}

function updateStatus(count, query) {
  const noun = count === 1 ? "FAQ" : "FAQs";
  resultStatus.textContent = query
    ? `${count} ${noun} found for "${query}".`
    : `${count} ${noun} available.`;
}

function renderFaqs() {
  const query = normalize(searchInput.value);
  const matches = getMatches(query);

  list.replaceChildren(...matches.map(createFaqItem));
  noResults.hidden = matches.length > 0;
  updateStatus(matches.length, query);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
});

searchInput.addEventListener("input", renderFaqs);

renderFaqs();
