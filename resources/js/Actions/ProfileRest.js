import { Cookies, Fetch, Notify } from "sode-extend-react"

class ProfileRest {
  static save = async (request) => {
    try {
      const { status, result } = await Fetch('/api/profile', {
        method: 'PATCH',
        body: JSON.stringify(request)
      })

      if (!status) throw new Error(result?.message || 'Ocurrio un error inesperado')

      Notify.add({
        icon: '/assets/img/logo-login.svg',
        title: 'Correcto',
        body: result.message,
        type: 'success'
      })
      return true
    } catch (error) {
      Notify.add({
        icon: '/assets/img/logo-login.svg',
        title: 'Error',
        body: error.message,
        type: 'danger'
      })
      return false
    }
  }

  static saveProfile = async (file, square = true) => {
    try {
      const { full, thumbnail, type, ok } = await File.compress(file, { square })

      if (!ok) throw new Error('Ocurrio un error al comprimir la imagen. Intenta con otra.')

      const request = new FormData();
      request.append('thumbnail', await File.fromURL(`data:${type};base64,${thumbnail}`));
      request.append('full', await File.fromURL(`data:${type};base64,${full}`));

      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'X-Xsrf-Token': decodeURIComponent(Cookies.get('XSRF-TOKEN'))
        },
        body: request
      })
      const data = JSON.parseable(await res.text())
      if (!res.ok) throw new Error(data?.message ?? 'Ocurrio un error inesperado')

      Notify.add({
        icon: '/assets/img/logo-login.svg',
        title: 'Correcto',
        body: 'La imagen de perfil se actualizo correctamente',
        type: 'success'
      })
      return data.data
    } catch (error) {
      Notify.add({
        icon: '/assets/img/logo-login.svg',
        title: 'Error',
        body: error.message,
        type: 'danger'
      })
      return false
    }
  }
}

export default ProfileRest