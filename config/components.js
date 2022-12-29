export default [
  {
    name: 'Question detail',
    description: 'The question detail component',
    key: 'question-detail'
  },
  {
    name: 'Similar questions list',
    description: 'A list of similar questions',
    key: 'similar-questions-list',
    fields: [
      {
        key: 'detailPage',
        type: 'reference',
        props: {
          label: 'Detail page',
          type: 'page'
        }
      },
      {
        key: 'title',
        type: 'localized-text',
        props: {
          label: 'Title',
          placeholder: 'Set a title for the question list'
        }
      }
    ]
  },
  {
    name: 'Question category lineup',
    description: 'A linup of all question categories',
    key: 'question-category-lineup',
    fields: [
      {
        key: 'title',
        type: 'localized-text',
        props: {
          label: 'Title',
          placeholder: 'Set a title for the question category lineup'
        }
      },
      {
        key: 'detailPage',
        type: 'reference',
        props: {
          label: 'Detail page',
          type: 'page'
        }
      },
      {
        key: 'categories',
        type: 'reference',
        props: {
          label: 'Selected categories',
          type: 'content-block',
          contentBlock: 'question-category',
          multiple: true
        }
      }
    ]
  },
  {
    name: 'Question list',
    description: 'A list of questions based on certain criteria',
    key: 'question-list',
    fields: [
      {
        key: 'filter',
        type: 'select',
        props: {
          label: 'List filter',
          options: [
            {
              value: 'route-parameter',
              text: 'Route parameter (category slug)'
            },
            {
              value: 'common',
              text: 'Most common questions'
            },
            {
              value: 'category',
              text: 'Specific category'
            },
            {
              value: 'search-query',
              text: 'Search term (query)'
            }
          ]
        }
      },
      {
        key: 'title',
        type: 'localized-text',
        props: {
          label: 'Title',
          placeholder: 'Set a title for the question list'
        },
        conditionalRules: [
          {
            field: 'filter',
            comparison: 'not-equals',
            value: 'route-parameter'
          }
        ]
      },
      {
        key: 'detailPage',
        type: 'reference',
        props: {
          label: 'Detail page',
          type: 'page'
        }
      },
      {
        key: 'category',
        type: 'reference',
        props: {
          label: 'Selected category',
          type: 'content-block',
          contentBlock: 'question-category',
        },
        conditionalRules: [
          {
            field: 'filter',
            comparison: 'equals',
            value: 'category'
          }
        ]
      },
      {
        key: 'limit',
        type: 'number',
        props: {
          label: 'Set a limit on the number of questions to display'
        }
      },
      {
        key: 'pagination',
        type: 'boolean',
        props: {
          label: 'Enable pagination (load more)'
        }
      },
      {
        key: 'show-more-button',
        type: 'localized-text',
        conditionalRules: [
          {
            field: 'pagination',
            comparison: 'equals',
            value: true
          }
        ],
        props: {
          label: 'Show more button text',
          placeholder: 'Set a text for the show more button'
        }
      }
    ]
  },
  {
    name: 'Form',
    description: 'Display a form on the page.',
    key: 'form',
    fields: [
      {
        key: 'title',
        type: 'localized-text',
        props: {
          label: 'Title',
          placeholder: 'Set a title for the form on the page'
        }
      },
      {
        key: 'description',
        type: 'localized-text',
        props: {
          label: 'Description',
          placeholder: 'Set a description for the form'
        }
      },
      {
        key: 'form',
        type: 'reference',
        props: {
          type: 'form',
          label: 'Form'
        }
      },
    ]
  },
  {
    name: 'Page selector',
    description: 'Display a selection of pages for the visitor to select from',
    key: 'page-selector',
    fields: [
      {
        key: 'title',
        type: 'localized-text',
        props: {
          label: 'Title',
          placeholder: 'Set a title for the page selector'
        }
      },
      {
        key: 'pages',
        type: 'reference',
        props: {
          type: 'page',
          label: 'Pages',
          multiple: true
        }
      }
    ]
  },
  {
    name: 'Contact details',
    description: 'Display contact details and opening hours',
    key: 'contact-details',
    fields: [
      {
        key: 'title',
        type: 'localized-text',
        props: {
          label: 'Title',
          placeholder: 'Set a title for your contact details'
        }
      },
      {
        key: 'subTitle',
        type: 'localized-text',
        props: {
          label: 'Sub title',
          placeholder: 'Set a sub title (bold) to go next to the icon'
        }
      },
      {
        key: 'description',
        type: 'localized-text',
        props: {
          label: 'Description',
          placeholder: 'Set a description text to go next to the icon'
        }
      },
      {
        key: 'phone',
        type: 'localized-text',
        props: {
          label: 'Phone number',
          placeholder: 'Set a phone number to show as a contact detail'
        }
      },
      {
        key: 'openingHours',
        type: 'array',
        props: {
          name: 'Öppettider',
          fields: [
            {
              key: 'day',
              type: 'localized-text',
              props: {
                label: 'Day(s)',
                placeholder: 'Set the day(s) for the opening hours'
              }
            },
            {
              key: 'hours',
              type: 'localized-text',
              props: {
                label: 'Hours',
                placeholder: 'Enter the opening hours for the day(s)'
              }
            },
          ]
        }
      }
    ]
  },
  {
    name: 'Content cards',
    description: 'Display a two column grid of content cards.',
    key: 'content-cards',
    fields: [
      {
        key: 'cards',
        type: 'array',
        props: {
          name: 'Cards',
          fields: [
            {
              key: 'icon',
              type: 'select',
              props: {
                label: 'Icons',
                options: [
                  {
                    value: 'User',
                    text: 'User icon'
                  },
                  {
                    value: 'Phone',
                    text: 'Phone icon'
                  }
                ]
              }
            },
            {
              key: 'title',
              type: 'localized-text',
              props: {
                label: 'Card title',
                placeholder: 'Set the title for the card'
              }
            },
            {
              key: 'content',
              type: 'localized-text',
              props: {
                label: 'Card content',
                placeholder: 'Set the content for the card'
              }
            },
            {
              key: 'buttonLabel',
              type: 'localized-text',
              props: {
                label: 'Button label',
                placeholder: 'Set the button label for the card'
              }
            },
            {
              key: 'buttonLink',
              type: 'localized-text',
              props: {
                label: 'Button link',
                placeholder: 'Set the button link for the card'
              }
            },
            {
              key: 'buttonType',
              type: 'select',
              props: {
                label: 'Button type',
                options: [
                  {
                    value: 'primary',
                    text: 'Primary (orange)'
                  },
                  {
                    value: 'secondary',
                    text: 'Secondary (sand)'
                  }
                ]
              }
            }
          ]
        }
      }
    ]
  },
  {
    name: 'Search field',
    description: 'Show a search field for searching questions.',
    key: 'search-field',
    fields: [
      {
        key: 'title',
        type: 'localized-text',
        props: {
          label: 'Title',
          placeholder: 'Set the title to be shown above the search field'
        }
      },
      {
        key: 'placeholder',
        type: 'localized-text',
        props: {
          label: 'Placeholder',
          placeholder: 'Set the search field placeholder'
        }
      },
      {
        key: 'searchPage',
        type: 'reference',
        props: {
          label: 'Search page',
          type: 'page'
        }
      },
    ]
  }
];
