<template>
  <b-navbar toggleable="md" type="light">
    <b-navbar-brand to="shop" class="mr-auto"
      >Modellfabrik FH-Münster
    </b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-collapse id="nav-collapse" class="justify-content-center order-2" is-nav>
      <b-navbar-nav>
        <b-nav-item to="shop" active-class="active">
          Konfigurator
        </b-nav-item>
        <b-nav-item to="orders" active-class="active">
          Bestellungen
        </b-nav-item>
        <b-nav-item to="about" active-class="active">
          About
        </b-nav-item>
      </b-navbar-nav>
    </b-collapse>
    <b-navbar-nav class="order-3">
      <li>
        <a
          target="_blank"
          href="https://www.fh-muenster.de/eti/labore_forschung/st/modellfabrik-startseite.php"
        >
          <img
            class="pull-right"
            src="@/assets/fhm_logo.svg"
            width="75%"
            id="fhm_logo"
          />
        </a>
      </li>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
/**
 * Page header that will be shown on all views. Enables navigation to different routes.
 *
 * @category Shared
 */
export default {};
</script>

<style scoped>
a {
  outline: none;
}
</style>
