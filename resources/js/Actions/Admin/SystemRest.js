import { Cookies, Fetch, Notify } from "sode-extend-react";
import BasicRest from "../BasicRest";

class SystemRest extends BasicRest {
  path = 'admin/system'

  savePage = async (page = {}) => {
    try {
      const { status, result } = await Fetch(`/api/${this.path}/page`, {
        method: 'POST',
        body: JSON.stringify(page)
      })
      if (!status) throw new Error(result?.message || 'Ocurrio un error inesperado')
      return result.data ?? [];
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

  updateOrder = async (request) => {
    try {
      const { status, result } = await Fetch(`/api/${this.path}/order`, {
        method: 'PATCH',
        body: JSON.stringify(request)
      })
      if (!status) throw new Error(result?.message ?? 'Ocurrio un error inesperado')

      return true
    } catch (error) {
      Notify.add({
        icon: '/assets/resources/icon.png',
        title: 'Error',
        body: error.message,
        type: 'danger'
      })
    }
  }

  deletePage = async (id) => {
    try {
      const { status, result } = await Fetch(`/api/${this.path}/page/${id}`, {
        method: 'DELETE',
      })
      if (!status) throw new Error(result?.message || 'Ocurrio un error inesperado')
      return result.data ?? true;
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

  exportBK = async () => {
    try {
      const { status, result } = await Fetch(`/api/${this.path}/backup`)
      if (!status) throw new Error(result?.message || 'Ocurrio un error inesperado')
      return result;
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

  importBK = async (request) => {
    try {
      const res = await fetch(`/api/${this.path}/backup`, {
        method: 'POST',
        headers: {
          'X-Xsrf-Token': decodeURIComponent(Cookies.get('XSRF-TOKEN'))
        },
        body: request
      })
      const result = JSON.parseable(await res.text())
      if (!res.ok) throw new Error(result?.message || 'Ocurrio un error inesperado')
      return result ?? true;
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

  hasRemoteChanges = async () => await this.simpleGet(`/api/${this.path}/has-remote-changes`)
  fetchRemoteChanges = async () => await this.simpleGet(`/api/${this.path}/fetch-remote-changes`)
}

export default SystemRest