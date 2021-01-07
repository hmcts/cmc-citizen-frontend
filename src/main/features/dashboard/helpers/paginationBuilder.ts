import { omit } from 'lodash'
import { ActorType } from 'claims/models/claim-states/actor-type'

export function formPaginationToDisplay (pagingInfo: object, selectedPageNo: number, usertype: string): object {

  let hyperlinkText: string = ''
  if (usertype === ActorType.CLAIMANT) {
    hyperlinkText = '?c_pid='
  } else if (usertype === ActorType.DEFENDANT) {
    hyperlinkText = '?d_pid='
  }

  const totalClaimCount = pagingInfo['totalClaims']
  const totalPage = pagingInfo['totalPages']

  const pagesItems: object = formItemswithHyperlink(hyperlinkText, selectedPageNo, totalClaimCount, totalPage)

  if (selectedPageNo !== 1) {
    let updatedFromvalue: number = (10 * (selectedPageNo - 1) + 1)
    let updatedToValueCalculate: number = (selectedPageNo * 10)
    let updatedTovalue: number = updatedToValueCalculate > totalClaimCount ? totalClaimCount : updatedToValueCalculate
    pagesItems['results'].from = updatedFromvalue
    pagesItems['results'].to = updatedTovalue
  }

  if (pagesItems['previous'] === undefined) {
    omit(pagesItems, 'previous')
  }

  if (pagesItems['next'] === undefined) {
    omit(pagesItems, 'next')
  }
  return pagesItems
}

function formItemswithHyperlink (hyperlinkText: string, selectedPageNo: number, totalClaimCount: number, totalPage: number): object {
  let pagesItems: Array<object> = []
  let nextArrow: object
  let previousArrow: object
  let results: object = {
    from: 1,
    to: 10,
    count: totalClaimCount
  }

  for (let i: number = 1; i <= totalPage; i++) {
    let items: object
    let href: string = hyperlinkText + i
    if (i === selectedPageNo) {
      items = { text : i, href: href, 'selected': true }
    } else {
      items = { text : i, href: href, 'selected': false }
    }
    pagesItems.push(items)
  }

  if (totalPage > 1 && selectedPageNo < totalPage) {
    let nextPagetoSelect: number = 1
    pagesItems.some(item => {
      if (item['selected'] === true) {
        nextPagetoSelect = item['text'] + 1
      }
    })

    nextArrow = {
      text: 'Next',
      href: hyperlinkText + nextPagetoSelect
    }
  }

  if (selectedPageNo > 1) {
    let previousPagetoSelect: number = 1
    pagesItems.some(item => {
      if (item['selected'] === true) {
        previousPagetoSelect = item['text'] - 1
      }
    })

    previousArrow = {
      text: 'Previous',
      href: hyperlinkText + previousPagetoSelect
    }
  }

  let paginationToDisplay = {
    results: results,
    previous: previousArrow,
    next: nextArrow,
    items: pagesItems
  }

  return paginationToDisplay
}
