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

const { t } = window.i18n;
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
    status.textContent = t("Please fill in the required fields marked with *.");
    return;
  }
  status.textContent = "";

  const name = form.elements.name.value.trim();
  const lines = [];
  [...form.elements].forEach((field) => {
    if (!field.name || !field.value.trim() || field.type === "submit") return;
    lines.push(`${labelOf(field)}:\n${field.value.trim()}`);
  });

  const kindTitle = `${kind[0].toUpperCase()}${kind.slice(1)} inquiry`;
  const intro = kind === "interpreting" ? "I'd like to make an interpreting inquiry." : "I'd like to make a translation inquiry.";
  const body = `${t("Hello Suzan,")}\n\n${t(intro)}\n\n${lines.join("\n\n")}\n\n${t("Thank you,")}\n${name}`;
  const subject = window.i18n.lang === "ko" ? `${t(kindTitle)} – ${name}` : `${kindTitle} from ${name}`;

  $("#draft-text").textContent = `${t("To:")} ${WORK_EMAIL}\n${t("Subject:")} ${subject}\n\n${body}`;
  $("#mailto-link").href = `mailto:${WORK_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  draft.hidden = false;
  draft.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

$("#copy-draft").addEventListener("click", async (e) => {
  try {
    await navigator.clipboard.writeText($("#draft-text").textContent);
    e.target.textContent = t("Copied");
  } catch {
    e.target.textContent = t("Select the text above to copy");
  }
});

// A draft written in the previous language would be stale.
document.addEventListener("sitelanguagechange", () => {
  status.textContent = "";
  draft.hidden = true;
  $("#copy-draft").textContent = t("Copy inquiry");
});
