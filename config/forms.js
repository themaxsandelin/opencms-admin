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
        key: 'description',
        type: 'localized-text',
        props: {
          label: 'Description',
          placeholder: 'Define a description for your input field'
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
        key: 'description',
        type: 'localized-text',
        props: {
          label: 'Description',
          placeholder: 'Define a description for your text area'
        }
      }
    ]
  },
  {
    name: 'File',
    description: 'A file field allowing customers to upload files in the form.',
    type: 'file',
    configFields: [
      {
        key: 'label',
        type: 'localized-text',
        required: true,
        props: {
          label: 'Label',
          placeholder: 'Define the label for your file input'
        }
      },
      {
        key: 'description',
        type: 'localized-text',
        props: {
          label: 'Description',
          placeholder: 'Define a description for your file input'
        }
      },
      {
        key: 'limit',
        type: 'number',
        defaultValue: 1,
        props: {
          label: 'File limit',
          placeholder: 'Set a limit to the number of files the customer can attach to the form.',
          max: 5,
          min: 1
        }
      }
    ]
  }
];

