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
        key: 'title',
        type: 'localized-text',
        props: {
          label: 'Title',
          placeholder: 'Set a title for the question list'
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
            }
          ]
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
  }
];
