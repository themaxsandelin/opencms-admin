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
        type: 'text',
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
              type: 'text',
              props: {
                label: 'Hours',
                placeholder: 'Enter the opening hours for the day(s)'
              }
            },
          ]
        }
      }
    ]
  }
];
