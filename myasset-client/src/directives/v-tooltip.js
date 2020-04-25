import { getVerticallyScrollableParent } from '@/lib/scroll';

function positionTooltip(target) {
  const { tooltip } = target;
  const { horizontal, alignRight } = target.tooltipConfig;
  const PARENT_MARGIN = 8;
  const TOOLTIP_MARGIN = 4;

  const elementRect = target.getBoundingClientRect();

  let left = 0;
  let top = 0;
  tooltip.style.left = '0px';
  tooltip.style.top = '0px';

  if (horizontal) {
    left = elementRect.right + TOOLTIP_MARGIN;
    if (window.innerWidth < left + tooltip.offsetWidth) {
      left = elementRect.left - tooltip.offsetWidth - TOOLTIP_MARGIN;
    }

    const minTop = PARENT_MARGIN;
    const maxTop = window.innerHeight - tooltip.offsetHeight - PARENT_MARGIN;
    top = Math.max(
      Math.min(
        elementRect.top + (target.offsetHeight - tooltip.offsetHeight) * 0.5,
        maxTop
      ),
      minTop
    );
  } else {
    top = elementRect.top - tooltip.offsetHeight - TOOLTIP_MARGIN;
    if (top < 0) top = elementRect.bottom + TOOLTIP_MARGIN;

    const minLeft = PARENT_MARGIN;
    const maxLeft = window.innerWidth - tooltip.offsetWidth - PARENT_MARGIN;
    left = Math.max(
      Math.min(
        elementRect.left +
          (target.offsetWidth - tooltip.offsetWidth) * (alignRight ? 1 : 0.5),
        maxLeft
      ),
      minLeft
    );
  }

  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
}

function createTooltip(el) {
  if (el.tooltip) return;

  const config = el.tooltipConfig;
  if (!config.message && !config.info) return;

  el.tooltip = document.createElement('div');
  el.tooltip.style.opacity = 0;
  el.tooltip.style.textAlign = config.textAlign || 'center';
  el.tooltip.style.maxWidth = config.maxWidth;
  el.tooltip.classList.add('tooltip');

  if (el.closest('.AppModal')) el.tooltip.classList.add('tooltip--in-dialog');

  const messageEl = document.createElement('div');
  const message =
    typeof config.message === 'function' ? config.message() : config.message;
  messageEl.style.display = message ? '' : 'none';
  messageEl.classList.add('tooltip__message');
  messageEl.innerHTML = message;
  el.tooltip.appendChild(messageEl);

  const info = document.createElement('div');
  info.classList.add('tooltip__info');
  info.innerHTML = config.info;
  info.style.display = config.info ? '' : 'none';
  el.tooltip.appendChild(info);

  document.body.appendChild(el.tooltip);

  const showTooltip = el => {
    positionTooltip(el);
    el.tooltip.style.opacity = 1;
  };
  const video = el.tooltip.querySelector('video');
  if (video) video.onloadeddata = () => showTooltip(el);
  else showTooltip(el);

  el.tooltip.scrollParent = getVerticallyScrollableParent(el);
  el.tooltip.onScroll = () => removeTooltip(el);

  el.tooltip.scrollParent.addEventListener('scroll', el.tooltip.onScroll);

  el.tooltip.timer = setInterval(() => {
    if (!document.body.contains(el)) removeTooltip(el);
  }, 200);
}

function removeTooltip(el) {
  if (el.tooltip) {
    el.tooltip.scrollParent.removeEventListener('scroll', el.tooltip.onScroll);

    el.tooltip.remove();
    clearInterval(el.tooltip.timer);
    delete el.tooltip;
  }
}

function argsToConfig(args) {
  if (!args) {
    return {};
  } else if (typeof args === 'string') {
    return { message: args };
  } else {
    return args;
  }
}

export default {
  bind(el, binding) {
    el.tooltipConfig = argsToConfig(binding.value);
    el.addEventListener('mouseenter', function(e) {
      if (!e.buttons) createTooltip(e.currentTarget);
    });
    el.addEventListener('mousemove', function(e) {
      if (!e.buttons) createTooltip(e.currentTarget);
    });
    el.addEventListener('mouseleave', function(e) {
      removeTooltip(e.currentTarget);
    });
  },
  update(el, binding) {
    if (binding.value === binding.oldValue) return;

    const config = argsToConfig(binding.value);
    el.tooltipConfig = config;
    if (el.tooltip) {
      if (!config.message && !config.info) {
        removeTooltip(el);
      } else {
        const messageEl = el.tooltip.querySelector('.tooltip__message');
        const message =
          typeof config.message === 'function'
            ? config.message()
            : config.message;
        messageEl.innerHTML = message;
        messageEl.style.display = message ? '' : 'none';

        const info = el.tooltip.querySelector('.tooltip__info');
        info.innerHTML = config.info;
        info.style.display = config.info ? '' : 'none';

        positionTooltip(el);
      }
    }
  },
  unbind(el) {
    removeTooltip(el);
  }
};
