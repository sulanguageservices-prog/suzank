const $ = (s) => document.querySelector(s);
const WORK_EMAIL = "work@suzankim.com";

$("#year").textContent = new Date().getFullYear();

const toggle = $(".nav-toggle");
const links = $("#nav-links");
toggle.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
});
links.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    links.classList.remove("open");
    toggle.setAttribute("aria-expanded", false);
  }
});

const form = $("#inquiry-form");
const status = $("#form-status");
const draft = $("#draft");
const kind = form.dataset.kind;

const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
form.querySelectorAll("input.tz").forEach((i) => { i.value = zone; });

// Label text is the first text node of the wrapping <label>, minus the required asterisk.
const labelOf = (field) => {
  const label = field.closest("label");
  const text = [...label.childNodes].find((n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
  return text.textContent.replace("*", "").trim();
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  status.className = "";

  if (!form.checkValidity()) {
    form.reportValidity();
    status.className = "err";
    status.textContent = "Please fill in the required fields marked with *.";
    return;
  }
  status.textContent = "";

  const name = form.elements.name.value.trim();
  const lines = [];
  [...form.elements].forEach((field) => {
    if (!field.name || !field.value.trim() || field.type === "submit") return;
    lines.push(`${labelOf(field)}:\n${field.value.trim()}`);
  });

  const body = `Hello Suzan,\n\nI'd like to make a ${kind} inquiry.\n\n${lines.join("\n\n")}\n\nThank you,\n${name}`;
  const subject = `${kind[0].toUpperCase()}${kind.slice(1)} inquiry from ${name}`;

  $("#draft-text").textContent = `To: ${WORK_EMAIL}\nSubject: ${subject}\n\n${body}`;
  $("#mailto-link").href = `mailto:${WORK_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  draft.hidden = false;
  draft.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

$("#copy-draft").addEventListener("click", async (e) => {
  try {
    await navigator.clipboard.writeText($("#draft-text").textContent);
    e.target.textContent = "Copied";
  } catch {
    e.target.textContent = "Select the text above to copy";
  }
});
