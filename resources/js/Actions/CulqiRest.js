import { Fetch, JSON, Notify } from "sode-extend-react"

class CulqiRest {
  static order = async (sale, details) => {
    try {
      const { status, result } = await Fetch(`/api/culqi/order`, {
        method: 'POST',
        body: JSON.stringify({ sale, details })
      })

      if (!status) throw new Error(result?.message || 'Ocurrio un error inesperado')

      Notify.add({
        icon: '/assets/img/favicon.png',
        title: 'Correcto',
        body: result.message,
        type: 'success'
      })
      return result
    } catch (error) {
      Notify.add({
        icon: '/assets/img/favicon.png',
        title: 'Error',
        body: error.message,
        type: 'danger'
      })
      return null
    }
  }

  static token = async (request) => {
    try {
      const { status, result } = await Fetch(`/api/culqi/token`, {
        method: 'POST',
        body: JSON.stringify(request)
      })

      if (!status) throw new Error(result?.message || 'Ocurrio un error inesperado')

      Notify.add({
        icon: '/assets/img/favicon.png',
        title: 'Correcto',
        body: result.message,
        type: 'success'
      })
      return result
    } catch (error) {
      Notify.add({
        icon: '/assets/img/favicon.png',
        title: 'Error',
        body: error.message,
        type: 'danger'
      })
      return null
    }
  }
}

export default CulqiRest