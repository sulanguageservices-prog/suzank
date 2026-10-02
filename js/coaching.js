const $ = (s) => document.querySelector(s);
const INQUIRY_EMAIL = "coaching@suzankim.com";

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
let draftBody = "";

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const f = new FormData(form);
  const name = f.get("name").trim();
  const email = f.get("email").trim();

  status.className = "";
  if (!name || !/^\S+@\S+\.\S+$/.test(email)) {
    status.className = "err";
    status.textContent = t("Please add your name and a valid email address.");
    return;
  }
  status.textContent = "";

  const field = (label, value) => {
    const v = f.get(value).trim();
    return v ? `${label}\n${v}\n\n` : "";
  };
  draftBody =
    `${t("Hello Suzan,")}\n\n${t("I'd like to talk about coaching.")}\n\n${t("Name:")} ${name}\n${t("Email:")} ${email}\n\n` +
    field(t("What I'd like to be different:"), "q1") +
    field(t("Challenge or topic to explore:"), "q2") +
    field(t("What would help me feel supported:"), "q3") +
    field(t("Preferred dates or times:"), "times") +
    field(t("City or timezone:"), "zone") +
    t("Thank you,") + "\n" + name;

  const subject = t("Coaching inquiry");
  $("#draft-text").textContent = `${t("To:")} ${INQUIRY_EMAIL}\n${t("Subject:")} ${subject}\n\n${draftBody}`;
  $("#mailto-link").href =
    `mailto:${INQUIRY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(draftBody)}`;
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
