/**
 * Gets the market id of the market used for authorization
 * @returns {string}
 */
export function getAuthMarketId () {
  const urlParams = new URLSearchParams(window.location.search)
  const authMarket = urlParams.get('authMarket')
  if (authMarket != null) {
    return authMarket
  }
  return getMarketId()
}

/**
 * Gets the market id from the URL if it's present in it.
 * @returns {string}
 */
export function getMarketId () {
  const path = window.location.pathname
  console.log('Current location ' + path)
  const noSlash = path.substr(1)
  const end = noSlash.indexOf('/')
  const marketId = noSlash.substr(0, end)
  return marketId
}

/**
 * Appends the auth market id to the relative link given and returns the new relative link so formed
 * @param authMarketId
 * @param relativeDestination
 * @returns {string}
 */
function appendAuthMarket (authMarketId, relativeDestination) {
  // window.location.href is just to make the parser happy. We'll discard it to make sure we give a relative link
  const url = new URL(relativeDestination, window.location.href)
  const searchParams = url.searchParams
  searchParams.append('authMarketId', authMarketId)
  return url.pathname + '?' + searchParams.toString()
}

/**
 * Helper function to centralize market id subpath link formation
 * @param marketId
 * @param subPath
 * @returns {string}
 */
function formMarketIdLink (marketId, subPath) {
  const dest = '/' + marketId + '/' + subPath
  return dest
}

/**
 * Forms a relative link and embeds the active market and auth market if needed
 * @param realtiveDestination
 */
export function formCurrentMarketLink (subPath) {
  const market = getMarketId()
  const marketLink = formMarketIdLink(market, subPath)
  return formAuthAppendedLink(market, marketLink)
}

/**
 * Determines if the auth market is the same as the dest market and
 * appends the auth market id if needed
 * @param destMarket
 * @param destLink
 * @returns {string}
 */
function formAuthAppendedLink(destMarket, destLink) {
  const authMarket = getAuthMarketId()
  if (destMarket !== authMarket) {
    return appendAuthMarket(authMarket, destLink)
  }
  return destLink
}

/**
 * Forms a link to a given market id with the given subpath. Usually used when switching
 * to a different market
 * @param marketId
 * @param subPath
 * @returns {string}
 */
export function getDifferentMarketLink(marketId, subPath) {
  const marketLink = formMarketIdLink(marketId, subPath)
  return formAuthAppendedLink(marketId, marketLink)
}