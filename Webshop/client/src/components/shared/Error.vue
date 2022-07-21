<template>
  <h2 class="error">{{ errorMessage }}</h2>
</template>

<script>
  /**
   * Displays an error message. The message can be passed as property.
   * 
   * @category Shared
   * 
   * @vue-prop {string} errorMessage - The error message that will be shown
   */
export default {
  name: "Error",
  props: ["errorMessage"],
};
</script>
