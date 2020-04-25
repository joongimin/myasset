function* elementTreeIterator(element) {
  let curElement = element;
  while (curElement && curElement !== document) {
    yield curElement;
    curElement = curElement.parentNode;
  }
}

function getScrollableParent(element) {
  for (const el of elementTreeIterator(element)) {
    const { overflowY } = window.getComputedStyle(el);
    const isScrollable = overflowY !== 'visible' && overflowY !== 'hidden';
    if (isScrollable) return el;
  }
  return document.body;
}

function getVerticallyScrollableParent(element) {
  for (const el of elementTreeIterator(element)) {
    const { overflowY } = window.getComputedStyle(el);
    const isScrollable =
      overflowY !== 'visible' &&
      overflowY !== 'hidden' &&
      el.getAttribute('data-vertically-scrollable') !== 'no';
    if (isScrollable) return el;
  }
  return document.body;
}

export { getScrollableParent, getVerticallyScrollableParent };
