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
    question: "How do I change my notification preferences?",
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

const searchInput = document.querySelector("#faq-search");
const list = document.querySelector("#faq-list");
const emptyState = document.querySelector("#empty-state");
const resultCount = document.querySelector("#result-count");

function createFaqItem(faq) {
  const details = document.createElement("details");
  details.className = "faq-item";

  const summary = document.createElement("summary");
  summary.textContent = faq.question;

  const answer = document.createElement("p");
  answer.textContent = faq.answer;

  const tag = document.createElement("span");
  tag.className = "tag";
  tag.textContent = faq.tag;

  details.append(summary, answer, tag);
  return details;
}

function renderFaqs(items) {
  list.replaceChildren(...items.map(createFaqItem));
  emptyState.hidden = items.length > 0;
  resultCount.textContent = `${items.length} ${items.length === 1 ? "answer" : "answers"}`;
}

function filterFaqs() {
  const query = searchInput.value.trim().toLowerCase();
  const matches = faqs.filter((faq) => {
    const text = `${faq.question} ${faq.answer} ${faq.tag}`.toLowerCase();
    return text.includes(query);
  });

  renderFaqs(matches);
}

searchInput.addEventListener("input", filterFaqs);
renderFaqs(faqs);
