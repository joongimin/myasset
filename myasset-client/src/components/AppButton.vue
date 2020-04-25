<template>
  <div
    :class="[
      'AppButton',
      size ? `AppButton--${size}` : null,
      type === 'dropdown' ? 'dropdown' : null,
      {
        'AppButton--focusable': !unfocusable,
        'AppButton--activable': !unactivable
      }
    ]"
  >
    <Component :is="buttonComponent" v-tooltip="tooltip" :to="to">
      <button
        :id="id"
        :type="type === 'submit' ? 'submit' : 'button'"
        :disabled="disabled"
        :class="[
          'AppButton__button',
          `AppButton__button--style-${buttonStyle}`,
          size ? `AppButton__button--${size}` : null,
          { 'AppButton__button--pushed': pushed }
        ]"
        :tabIndex="unfocusable ? -1 : null"
        @click="$emit('click', $event)"
        @blur="$emit('blur')"
      >
        <slot>{{ label }}</slot>
      </button>
    </Component>
    <slot name="dropdown" />
  </div>
</template>

<script>
export default {
  name: 'AppButton',
  props: {
    id: {
      type: String,
      default: null
    },
    type: {
      type: String,
      default: 'button'
    },
    buttonStyle: {
      type: String,
      default: 'default',
      validator: v =>
        [
          'default',
          'input',
          'label',
          'grey',
          'grey-outline',
          'mango-outline',
          'blue-outline',
          'blue',
          'blue-clear',
          'red-outline',
          'red',
          'green',
          'mint-green',
          'grey-clear',
          'black-opaque'
        ].includes(v)
    },
    label: {
      type: String,
      default: null
    },
    disabled: {
      type: Boolean,
      defualt: false
    },
    tooltip: {
      type: [String, Object],
      default: null
    },
    size: {
      type: String,
      default: null
    },
    to: {
      type: String,
      default: null
    },
    pushed: {
      type: Boolean,
      default: false
    },
    unfocusable: { type: Boolean, default: false },
    unactivable: { type: Boolean, default: false }
  },
  computed: {
    buttonComponent() {
      if (this.type === 'link') return 'AppLink';
      else if (this.type === 'external_link') return 'AppExternalLink';
      else return 'div';
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/scss/mixins/_texts.scss';
@import '@/scss/mixins/_transitions.scss';

@mixin hover {
  &:hover {
    @content;
  }
}

@mixin active {
  .AppButton--activable &:active,
  .AppButton--activable &.AppButton__button--pushed {
    @content;
  }
}

@mixin focus {
  .AppButton--focusable &:focus {
    @content;
  }
}

@mixin disabled {
  &:disabled {
    @content;
  }
}

@mixin button-base($focus-color) {
  @include text-button;
  @include transition-basic(color, border-color, background-color, box-shadow);

  border: 1px solid transparent;
  border-radius: 3px;
  padding: 5px 15px;
  white-space: nowrap;
  user-select: none;

  &:active:focus {
    box-shadow: none;
  }

  @include focus {
    box-shadow: 0 0 0 2px $focus-color;

    &.AppButton__button--pushed {
      box-shadow: 0 0 0 2px $focus-color,
        inset 1px 1px 2px 0 rgba(0, 0, 0, 0.12);
    }
  }
}

@mixin button-outline($focus-color) {
  @include button-base($focus-color);
  background-color: white;
}

.AppButton {
  display: inline-block;
  line-height: 0;
  vertical-align: middle;

  & + & {
    margin-left: 8px;
  }

  &--small + &--small {
    margin-left: 4px;
  }

  &--large {
    display: block;
  }
}

.AppButton__button {
  width: 100%;
  position: relative;

  &:disabled {
    pointer-events: none;
  }

  &--pushed {
    box-shadow: inset 1px 1px 2px 0 rgba(0, 0, 0, 0.12);
  }

  &--style-default {
    @include button-outline($color-grey-25);

    border-color: $color-grey-25;

    @include hover {
      color: $color-button-text-dark;
      border-color: $color-grey-35;
    }

    @include active {
      border-color: $color-grey-35;
      background-color: $color-grey-15;
    }

    @include focus {
      border-color: $color-grey-35;
    }

    @include disabled {
      border-color: $color-grey-15;
      color: $color-disable-text;
      background-color: white;
    }
  }

  &--style-input {
    @include button-outline($color-form-focus-highlight);

    color: $color-content-text;
    border-color: $color-form-border;

    @include hover {
      border-color: $color-form-border-hover;
    }

    @include focus {
      border-color: $color-form-border-selected;
    }

    @include disabled {
      border-color: $color-grey-25;
      color: $color-disable-text;
      background-color: white;
    }
  }

  &--style-label {
    @include text-label;

    @include disabled {
      color: $color-disable-text;
    }
  }

  &--style-grey {
    @include button-base($color-grey-32);

    background-color: $color-grey-25;
    color: $color-grey-80;

    @include hover {
      background-color: $color-grey-35;
    }

    @include active {
      background-color: $color-grey-40;
    }

    @include focus {
      border-color: $color-grey-35;
    }

    @include disabled {
      background-color: $color-grey-15;
      color: $color-grey-40;
    }
  }

  &--style-grey-outline {
    @include button-outline($color-grey-25);

    border-color: $color-grey-35;

    @include hover {
      color: $color-button-text-dark;
    }

    @include active {
      background-color: $color-grey-15;
    }

    @include disabled {
      border-color: $color-grey-25;
      color: $color-disable-text;
    }
  }

  &--style-mango-outline {
    @include button-outline($color-mango-light);

    border-color: $color-mango;
    color: $color-mango-text;

    @include hover {
      color: $color-mango-dark;
      border-color: $color-mango-dark;
    }

    @include active {
      background-color: $color-mango;
      border-color: $color-mango;
      color: white;
    }

    @include disabled {
      border-color: $color-mango-light;
      color: $color-mango-light;
    }
  }

  &--style-blue-outline {
    @include button-outline($color-blue-light);

    border-color: $color-blue;
    color: $color-blue;

    @include hover {
      color: $color-blue-dark;
      border-color: $color-blue-dark;
    }

    @include active {
      background-color: $color-blue;
      border-color: $color-blue;
      color: white;
    }

    @include disabled {
      border-color: $color-blue-light;
      color: $color-blue-light;
    }
  }

  &--style-blue {
    @include button-base($color-blue-light);

    background-color: $color-blue;
    color: white;

    @include hover {
      background-color: $color-blue-dark;
    }

    @include active {
      background-color: $color-blue-darker;
    }

    @include disabled {
      background-color: $color-blue-light;
    }
  }

  &--style-blue-clear {
    @include button-base($color-blue-light);

    color: $color-blue;

    @include hover {
      color: $color-blue-dark;
    }

    @include focus {
      color: $color-blue-dark;
    }

    @include active {
      color: $color-blue-darker;
    }

    @include disabled {
      color: $color-blue-light;
    }
  }

  &--style-red-outline {
    @include button-outline($color-red-light);

    border-color: $color-red;
    color: $color-red;

    @include hover {
      color: $color-red-dark;
      border-color: $color-red-dark;
    }

    @include active {
      background-color: $color-red;
      border-color: $color-red;
      color: white;
    }

    @include disabled {
      border-color: $color-red-light;
      color: $color-red-light;
    }
  }

  &--style-red {
    @include button-base($color-red-light);

    background-color: $color-red;
    color: white;

    @include hover {
      background-color: $color-red-dark;
    }

    @include active {
      background-color: $color-red-darker;
    }

    @include disabled {
      background-color: $color-red-light;
    }
  }

  &--style-green {
    @include button-base($color-green-light);

    background-color: $color-green;
    color: white;

    @include hover {
      background-color: $color-green-dark;
    }

    @include active {
      background-color: $color-green-darker;
    }

    @include disabled {
      background-color: $color-green-light;
    }
  }

  &--style-mint-green {
    @include button-base($color-mint-green-light);

    background-color: $color-mint-green;
    color: white;

    @include hover {
      background-color: $color-mint-green-dark;
    }

    @include active {
      background-color: $color-mint-green-darker;
    }

    @include disabled {
      background-color: $color-mint-green-light;
    }
  }

  &--style-grey-clear {
    @include button-base($color-disable-text);

    background-color: white;

    @include hover {
      color: $color-button-text-dark;
    }

    @include focus {
      color: $color-button-text-dark;
    }

    @include active {
      background-color: $color-grey-05;
    }

    @include disabled {
      color: $color-disable-text;
    }
  }

  &--style-black-opaque {
    @include button-base($color-black-opaque-light);

    background-color: $color-black-opaque;
    color: white;

    &:hover {
      background-color: $color-black-opaque-dark;
    }

    &:active,
    &.AppButton__button--pushed {
      background-color: $color-black-opaque-darker;
    }

    &:disabled {
      background-color: $color-black-opaque-light;
    }
  }

  &--small {
    font-size: 12px;
    padding: 4px 11px;
    height: 28px;
    line-height: 18px;
  }

  &--narrow {
    padding: 5px 11px;
  }

  &--large {
    padding-top: 9px;
    padding-bottom: 9px;
    display: block;
  }
}
</style>
