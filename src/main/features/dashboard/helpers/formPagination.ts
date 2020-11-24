import { omit } from 'lodash'

export function formPaginationToDisplay (totalPage: number, selectedPageNo: number, totalClaimCount: number): object {
  let pagesItems: Array<object> = []
  let items: object
  let nextArrow: object
  let previousArrow: object
  let results: object = {
    from: '1',
    to: '25',
    count: totalClaimCount
  }

  for (let i = 1; i <= totalPage; i++) {
    let pageNumber: number = i
    let href: string = '?page=' + i
    if (pageNumber === selectedPageNo) {
      items = { text : pageNumber, href: href, 'selected': true }
    } else {
      items = { text : pageNumber, href: href, 'selected': false }
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
      href: '?page=' + nextPagetoSelect
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
      text: 'previous',
      href: '?page=' + previousPagetoSelect
    }
  }

  let paginationToDisplay = {
    results: results,
    previous: previousArrow,
    next: nextArrow,
    items: pagesItems
  }

  if (selectedPageNo !== 1) {
    let updatedFromvalue: number = (25 * (selectedPageNo - 1) + 1)
    let updatedToValueCalculate: number = (selectedPageNo * 25)
    let updatedTovalue: number = updatedToValueCalculate > totalClaimCount ? totalClaimCount : updatedToValueCalculate

    paginationToDisplay.results['from'] = updatedFromvalue
    paginationToDisplay.results['to'] = updatedTovalue
  }

  if (paginationToDisplay['previous'] === undefined) {
    omit(paginationToDisplay, 'previous')
  }

  if (paginationToDisplay['next'] === undefined) {
    omit(paginationToDisplay, 'next')
  }
  return paginationToDisplay
}
