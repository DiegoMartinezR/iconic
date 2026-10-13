const SetSelectValue = (select, idOrValues, textOrId, label) => {
  $(select).empty()
  if (!idOrValues) return
  if (Array.isArray(idOrValues)) {
    idOrValues.forEach((value) => {
      const { [textOrId]: id, [label]: text } = value
      const option = document.createElement('option')
      option.value = id ?? value
      option.text = text ?? value
      option.selected = true
      $(select).append(option)
    })
  } else {
    const option = document.createElement('option')
    option.value = idOrValues
    option.text = textOrId ?? idOrValues
    $(select).append(option)
    $(select).val(idOrValues)
  }
  $(select).trigger('change')
}

export default SetSelectValue