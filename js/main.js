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
  const buy = el("div", { className: "buy-links" });
  [["Coaching Books", b.coachingbooks], ["Kyobo", b.kyobo]].forEach(([label, href]) => {
    if (href) buy.append(el("a", { className: "btn btn-small", href, target: "_blank", rel: "noopener noreferrer" }, label));
  });
  card.append(buy);
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
