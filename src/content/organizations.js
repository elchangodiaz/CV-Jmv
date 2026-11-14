// Organizaciones referidas en el CV. Los puestos, la educación y las habilidades
// las referencian por su id, así cada logo queda ligado a sus elementos.
import orgNames from './orgNames.js'
import unam from '../assets/logos/unam.svg'
import fesAragon from '../assets/logos/fes-aragon.png'
import grupoSalinas from '../assets/logos/grupo-salinas.svg'
import gft from '../assets/logos/gft.svg'
import santander from '../assets/logos/santander.svg'

export default {
  'grupo-salinas': {
    name: orgNames['grupo-salinas'],
    logo: grupoSalinas,
    url: 'https://www.gruposalinas.com'
  },
  gft: {
    name: orgNames['gft'],
    logo: gft,
    url: 'https://www.gft.com'
  },
  santander: {
    name: orgNames['santander'],
    logo: santander,
    url: 'https://www.santander.com.mx'
  },
  'purpose-financial': {
    name: orgNames['purpose-financial'],
    // Sin logo público disponible: se muestra un distintivo con sus iniciales.
    logo: null,
    initials: 'PF'
  },
  unam: {
    name: orgNames['unam'],
    logo: unam,
    url: 'https://www.unam.mx'
  },
  'fes-aragon': {
    name: orgNames['fes-aragon'],
    logo: fesAragon,
    url: 'https://www.aragon.unam.mx'
  }
}
