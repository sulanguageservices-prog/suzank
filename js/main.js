// Booking requests are emailed to you via Formspree (https://formspree.io).
// Create a form there, paste its endpoint below, and enable "Autoresponse" so clients get a confirmation email.
const FORM_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID";

const $ = (s) => document.querySelector(s);

$("#year").textContent = new Date().getFullYear();

// Mobile nav
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

const el = (tag, props = {}, ...children) => {
  const node = Object.assign(document.createElement(tag), props);
  node.append(...children);
  return node;
};

const fmtDate = (d) =>
  new Date(d + "T00:00:00").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

// Books
const booksList = $("#books-list");
BOOKS.forEach((b) => {
  const cover = el("div", { className: "cover" });
  const img = el("img", { src: b.cover, alt: `Cover of ${b.title}`, loading: "lazy" });
  img.onerror = () => cover.replaceChildren(b.title);
  cover.append(img);

  const title = el("h3", {}, b.title);
  const meta = el("p", {}, `by ${b.author} (${b.year})`, el("br"), b.publisher);
  const card = el("article", { className: "book" }, cover, title, meta);
  if (b.link) {
    card.append(el("p", {}, el("a", { href: b.link, target: "_blank", rel: "noopener noreferrer" }, "Learn more")));
  }
  booksList.append(card);
});

// Blog
const dialog = $("#post-dialog");
const blogList = $("#blog-list");
POSTS.forEach((p) => {
  const btn = el("button", { className: "btn-link", type: "button" }, "Read more");
  btn.addEventListener("click", () => {
    $("#post-title").textContent = p.title;
    $("#post-meta").textContent = fmtDate(p.date);
    $("#post-body").replaceChildren(...p.body.split(/\n\s*\n/).map((t) => el("p", {}, t)));
    dialog.showModal();
  });
  blogList.append(
    el("article", { className: "card" },
      el("p", { className: "meta" }, fmtDate(p.date)),
      el("h3", {}, p.title),
      el("p", {}, p.excerpt),
      btn)
  );
});
dialog.querySelector(".close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });

// Booking form
const form = $("#booking-form");
const status = $("#form-status");
form.date.min = new Date().toISOString().split("T")[0];
form.timezone.value = Intl.DateTimeFormat().resolvedOptions().timeZone || "";

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  status.className = "";
  if (!form.checkValidity()) {
    status.textContent = "Please fill in all required fields.";
    status.className = "err";
    form.reportValidity();
    return;
  }
  const btn = form.querySelector("button[type=submit]");
  btn.disabled = true;
  status.textContent = "Sending…";
  try {
    const res = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new FormData(form),
    });
    if (!res.ok) throw new Error();
    form.reset();
    status.textContent = "Thank you! Your request is in. Check your email for a confirmation.";
    status.className = "ok";
  } catch {
    status.textContent = "Something went wrong. Please try again or email me directly.";
    status.className = "err";
  } finally {
    btn.disabled = false;
  }
});
