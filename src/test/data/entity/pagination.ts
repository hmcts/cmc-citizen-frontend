
export const paginationObjectForClaimant = {
  results: {
    from: 1,
    to: 10,
    count: 30
  },
  next: {
    text: 'Next',
    href: '?c_pid=2'
  },
  previous: undefined,
  items: [
    {
      text: 1,
      href: '?c_pid=1',
      selected: true
    },
    {
      text: 2,
      href: '?c_pid=2',
      selected: false
    }
  ]
}

export const paginationObjectForDefendant = {
  results: {
    from: 1,
    to: 10,
    count: 30
  },
  next: {
    text: 'Next',
    href: '?d_pid=2'
  },
  previous: undefined,
  items: [
    {
      text: 1,
      href: '?d_pid=1',
      selected: true
    },
    {
      text: 2,
      href: '?d_pid=2',
      selected: false
    }
  ]
}

export const paginationObjectForClaimantforPage = {
  results: {
    from: 11,
    to: 20,
    count: 30
  },
  next: undefined,
  previous: {
    text: 'Previous',
    href: '?c_pid=1'
  },
  items: [
    {
      text: 1,
      href: '?c_pid=1',
      selected: false
    },
    {
      text: 2,
      href: '?c_pid=2',
      selected: true
    }
  ]
}
