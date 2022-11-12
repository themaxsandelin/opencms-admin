export default [
  {
    name: 'Question detail',
    description: 'The question detail component',
    key: 'question-detail'
  },
  {
    name: 'Similar questions list',
    description: 'A list of similar questions',
    key: 'similar-questions-list'
  },
  {
    name: 'Question category lineup',
    description: 'A linup of all question categories',
    key: 'question-category-lineup',
    fields: [
      {
        key: 'detailPage',
        fieldType: 'reference',
        props: {
          label: 'Detail page',
          type: 'page'
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
        key: 'detailPage',
        fieldType: 'reference',
        props: {
          label: 'Detail page',
          type: 'page'
        }
      },
      {
        key: 'filter',
        fieldType: 'select',
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
        fieldType: 'reference',
        props: {
          type: 'form',
          label: 'Form'
        }
      },
    ]
  }
];
