export const fields = [
  {
    name: 'Input field',
    description: 'Standard one line input field for text, email, number etc.',
    type: 'input-field',
    configFields: [
      {
        key: 'key',
        type: 'text',
        required: true,
        props: {
          label: 'Field key',
          placeholder: 'Define a unique key for this field within the form.'
        }
      },
      {
        key: 'type',
        type: 'select',
        required: true,
        options: [
          { text: 'Text', value: 'text' },
          { text: 'Email', value: 'email' },
          { text: 'Phone number', value: 'tel' },
          { text: 'Number', value: 'number' }
        ],
        props: {
          label: 'Type',
          placeholder: 'Set the input type'
        }
      },
      {
        key: 'label',
        type: 'localized-text',
        required: true,
        props: {
          label: 'Label',
          placeholder: 'Define the label for your input field'
        }
      },
      {
        key: 'placeholder',
        type: 'localized-text',
        props: {
          label: 'Placeholder',
          placeholder: 'Define the placeholder for your input field'
        }
      }
    ]
  },
  {
    name: 'Text area',
    description: 'A multi-line text field for longer messages with line breaks.',
    type: 'textarea',
    configFields: [
      {
        key: 'key',
        type: 'text',
        required: true,
        props: {
          label: 'Field key',
          placeholder: 'Define a unique key for this field within the form.'
        }
      },
      {
        key: 'label',
        type: 'localized-text',
        required: true,
        props: {
          label: 'Label',
          placeholder: 'Define the label for your text area'
        }
      },
      {
        key: 'placeholder',
        type: 'localized-text',
        props: {
          label: 'Placeholder',
          placeholder: 'Define the placeholder for your text area'
        }
      }
    ]
  }
];

