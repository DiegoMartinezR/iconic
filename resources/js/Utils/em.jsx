import HtmlContent from "./HtmlContent"

const em = (string = '') => {
  return <HtmlContent html={
    String(string).replace(
      /\*(.*?)\*/g,
      '<span style="color: #ec4899">$1</span>'
    )} />
}

export default em