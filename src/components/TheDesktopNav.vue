<template>
  <section class="nav">
    <div class="nav-logo">
      <img
        src="../assets/fesarlogot.png"
        alt="logo"
        width="150px"
        height="150px"
      />
    </div>
    <div class="nav-menu">
      <ul class="nav-menu-list">
        <li class="nav-list-item">
          <p>{{ $t("nav.acercaN") }}</p>
        </li>
        <li class="nav-list-item">
          <p>{{ $t("nav.social") }}</p>
        </li>
        <!--       <router-link
          :to="`/{$i18n.locale}/about`"
          v-slot="{ href, route, navigate, isActive, isExactActive }"
        >
          <NavLink :active="isActive" :href="href" @click="navigate">{{
            route.fullPath
          }}</NavLink>
        </router-link> -->
      </ul>
    </div>
  </section>
</template>

<script>
export default {};
</script>

<style lang="sass" scoped>
  .nav
    position: fixed
    left: 0
    top: 0
    bottom: 0
    background: #bdbdbd
    display: flex
    flex-direction: column
    align-items: center
    height: 100%
    width: 20vw
    .nav-logo
        margin: 100px auto
        .nav-menu
            color: white

    .nav-menu-list
        color: white
        list-style: none
        padding: 0
        .nav-list-item
            background: #555
            padding: 10px 20px
            text-align: center
            margin: 10px auto
            cursor: pointer
            &:hover
                width: 100%
                background: #333
</style>