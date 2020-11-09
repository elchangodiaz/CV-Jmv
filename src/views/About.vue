<template>
  <div class="about-card">
    <div class="card-title">
      <img src="../assets/JMV.jpg" alt="avatar" class="avatar"/>
      <div class="title-text-content">
        <h3>{{ $t('acerca') }}</h3>
        <h1>Javier Mercado Velázquez</h1>
        <h4>{{ $t('ingeniero') }}</h4>
      </div>
    </div>
    <div class="card-content">
      <br/>
      <h3>{{ $t('educacion') }}</h3>
      <b>Facultad de estudios Superiores Aragon</b>
      <p>{{ $t('FesAr.estudios') }} <br/> 
      {{ $t('FesAr.titulo') }} <br/>
      {{ $t('FesAr.colaboraciones') }}</p>


      <h3>{{ $t('perfil.perfilH') }}</h3>
      <p> {{ $t('perfil.perfilIng') }}</p>

      <table width="100%">
        <tr>
          <th>{{ $t('habilidades') }}</th>
          <th>{{ $t('soluciones') }}</th>
        </tr>
        <tr>
          <td>Diseño</td>
          <td>Photoshop, gimp</td>
        </tr>
        <tr>
          <td>Front-end</td>
          <td>Vue.js, Angular, HTML, CSS, JavsScript</td>
        </tr>
        <tr>
          <td>Back-end</td>
          <td>Firebase, Node.js, SQL, Java</td>
        </tr>
        <tr>
          <td>3D Model</td>
          <td>Blender, Unity, Unreal Engine, Spark-Ar, Arcore</td>
        </tr>
      </table>

      <p>
        Este texto es de prueba ####### ########### ########### ######## ########,
        ############################ ###################### ####################,#
        ################### ################## ###############  ##################
        ############# ##################### ################# ##############  #####
        ############ ######## #########
      </p>
    </div>
  </div>
</template>

<style lang="sass" scoped>
  .about-card
    background: #333
    padding: 3em
    border-radius: 10px
    color: white

    .card-title
      display: flex
      align-items: center
      background: #222
      border-radius: 10px


      .avatar
        border: 1px solid rgba(255,255,255,0.4)
        border-radius: 30%
        margin: 30px 30px 
        width: 30%

         
    .title-text-content
      h3
        margin-bottom: 0 
        color: rgb(128, 128, 128)
      h1
        margin-top: 0

  .card-content p
    line-height: 1.5
    margin: 30px auto

  table
    border-spacing: 0px
    margin: 50px auto
    tr th, tr td 
      border: 1px solid white
      border-top: none
      padding: 10px
      text-align: center
      &:first-of-type
        border-left: none
      &:nth-of-type(2)
        border-right: none


</style>