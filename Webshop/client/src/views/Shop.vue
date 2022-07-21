<template>
  <b-container fluid>
    <b-row v-if="settings">
      <b-col xl="9">
        <ProductConfigurator :key="componentKey" />
      </b-col>

      <b-col xl="3">
        <ConfigurationSummary />
      </b-col>
    </b-row>
    <div v-else-if="fetchSettingsError">
      <Error v-bind:errorMessage="fetchSettingsError" />
    </div>
  </b-container>
</template>

<script>
import ProductConfigurator from "../components/configurator/ProductConfigurator";
import ConfigurationSummary from "../components/configurator/ConfigurationSummary";
import Error from "../components/shared/Error";
import { mapGetters } from "vuex";

/**
 * View that bundles the product configurator components. Shows the configurator itself and the summary of the product.
 * Subcomponents are only displayed after the cylinder-settings were successfully fetched from the server.
 * If the settings couldn't be fetched due to an error, the {@link Error} component will be shown with the GraphQL error message.
 *
 * @category Views
 * @vue-computed {Object} settings - The cylinder property settings including available heights and colors
 * @vue-computed {string} fetchSettingsError - Error that occured when fetching the cylinder-settings from the backend server
 */
export default {
  name: "Shop",
  components: {
    ProductConfigurator,
    ConfigurationSummary,
    Error,
  },

  computed: {
    ...mapGetters(["settings", "fetchSettingsError"]),
  },
};
</script>
