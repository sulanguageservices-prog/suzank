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
    status.textContent = "Please add your name and a valid email address.";
    return;
  }
  status.textContent = "";

  const field = (label, value) => {
    const v = f.get(value).trim();
    return v ? `${label}\n${v}\n\n` : "";
  };
  draftBody =
    `Hello Suzan,\n\nI'd like to talk about coaching.\n\nName: ${name}\nEmail: ${email}\n\n` +
    field("What I'd like to be different:", "q1") +
    field("Challenge or topic to explore:", "q2") +
    field("What would help me feel supported:", "q3") +
    field("Preferred dates or times:", "times") +
    field("City or timezone:", "zone") +
    "Thank you,\n" + name;

  const subject = "Coaching inquiry";
  $("#draft-text").textContent = `To: ${INQUIRY_EMAIL}\nSubject: ${subject}\n\n${draftBody}`;
  $("#mailto-link").href =
    `mailto:${INQUIRY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(draftBody)}`;
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
