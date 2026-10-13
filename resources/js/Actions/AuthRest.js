import { Fetch, Notify } from "sode-extend-react"

class AuthRest {
  static login = async (request) => {
    try {

      const { status, result } = await Fetch('./api/login', {
        method: 'POST',
        body: JSON.stringify(request)
      })
      if (!status) throw new Error(result?.message || 'Error al iniciar sesion')

      Notify.add({
        icon: '/assets/resources/icon.png',
        title: 'Operacion correcta',
        body: 'Se inicio sesion correctamente'
      })

      return result
    } catch (error) {
      Notify.add({
        icon: '/assets/resources/icon.png',
        title: 'Error',
        body: error.message,
        type: 'danger'
      })
      return false
    }
  }

  static signup = async (request) => {
    try {

      const { status, result } = await Fetch('./api/signup', {
        method: 'POST',
        body: JSON.stringify(request)
      })
      if (!status) throw new Error(result?.message || 'Error al registrar el usuario')

      Notify.add({
        icon: '/assets/resources/icon.png',
        title: 'Operacion correcta',
        body: 'Se registro el usuario correctamente'
      })

      return result.data
    } catch (error) {
      Notify.add({
        icon: '/assets/resources/icon.png',
        title: 'Error',
        body: error.message,
        type: 'danger'
      })
      return null
    }
  }
}

export default AuthRest