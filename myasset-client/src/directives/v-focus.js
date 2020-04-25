import focusChild from '@/lib/focusChild';

export default {
  inserted(el, binding) {
    if (binding.value !== false) focusChild(el);
  }
};
