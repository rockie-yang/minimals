export default (selector) => {
  const elements = document.querySelectorAll(selector);

  return {
    elements,
    each(callback) {
      elements.forEach(callback);
      return this;
    },
    addClass(className) {
      elements.forEach((element) => element.classList.add(className));
      return this;
    },
    removeClass(className) {
      elements.forEach((element) => element.classList.removeClass(className));
      return this;
    },
    toggle(className) {
      elements.forEach((element) => element.classList.toggle(className));
      return this;
    },
    on(type, listener) {
      elements.forEach((element) => element.addEventListener(type, listener));
      return this;
    },
    off(type, listener) {
      elements.forEach((element) => element.removeEventListener(type, listener));
      return this;
    },
  };
};
