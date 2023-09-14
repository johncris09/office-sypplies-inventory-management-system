function FormatDate(timestamp) {
  const date = new Date(timestamp)
  const formattedDate = date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  })
  return formattedDate
}

export default FormatDate
