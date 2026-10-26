// Contact routes. Leave a value empty and the footer simply omits it.
export const site = {
  name: "Pravallika",
  wordmark: "pravallika",
  role: "Product Designer",
  location: "Bengaluru, India",
  email: "p.k.init.io@gmail.com",
  linkedin: "https://www.linkedin.com/in/npravallika0911/",
  resume: "/Pravallika-Navuluru-Resume.pdf",
  get contactHref() {
    return `mailto:${this.email}`;
  },
};
