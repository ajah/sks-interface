export const currencyFormat = (amount) =>
  '$' +
  Number.parseFloat(amount)
    .toFixed(2)
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')

export const fpeFormat = (fpe) => {
  if (fpe === undefined) return

  return fpe.substring(5)
}

export const datapointsFormat = (datapoint) =>
  datapoint == null ? 'Unavailable' : datapoint
