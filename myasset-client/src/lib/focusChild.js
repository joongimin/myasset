export default function(element) {
  const selector = [
    'input:not([type=hidden]):not([type=radio]):not([type=checkbox])',
    'select',
    'textarea',
    'button',
    'a[href]'
  ].join(',');
  const child = element.matches(selector)
    ? element
    : element.querySelector(selector);

  if (child) {
    setTimeout(function() {
      child.focus();
    });
  }
}
