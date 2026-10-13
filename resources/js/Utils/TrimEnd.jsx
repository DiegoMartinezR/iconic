const TrimEnd = (text, charToRemove) => {
    const regex = new RegExp(`[${charToRemove}]+$`, 'g');
    return text.replace(regex, '');
}

export default TrimEnd