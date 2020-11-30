
export const paginationObjectForClaimant = {
    results: {
      from: 1,
      to: 25,
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
        to: 25,
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
      from: 26,
      to: 30,
      count: 30
      },
      next: undefined,
      previous: {
        text: 'previous',
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