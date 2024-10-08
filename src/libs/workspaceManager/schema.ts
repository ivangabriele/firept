// This file is automatically generated via `yarn build:schema`
// !!! DO NOT EDIT IT DIRECTLY !!!

export const FIREPT_CONFIG_SCHEMA = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $ref: '#/definitions/FireptConfig',
  definitions: {
    FireptConfig: {
      type: 'object',
      properties: {
        server: {
          type: 'object',
          properties: {
            apiKey: {
              type: 'string',
            },
            port: {
              type: 'number',
            },
          },
          required: ['apiKey', 'port'],
          additionalProperties: false,
        },
        publichost: {
          type: 'object',
          properties: {
            apiKey: {
              type: 'string',
            },
            host: {
              type: 'string',
            },
            subdomain: {
              type: 'string',
            },
          },
          required: ['apiKey', 'host', 'subdomain'],
          additionalProperties: false,
        },
        customPublicUrl: {
          type: 'string',
        },
        repository: {
          type: 'object',
          properties: {
            provider: {
              type: 'string',
              const: 'github',
            },
            personalAccessToken: {
              type: 'string',
            },
            owner: {
              type: 'string',
            },
            name: {
              type: 'string',
            },
          },
          required: ['provider', 'personalAccessToken', 'owner', 'name'],
          additionalProperties: false,
        },
        workspace: {
          type: 'object',
          properties: {
            ignoredFiles: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
          additionalProperties: false,
        },
      },
      required: ['server'],
      additionalProperties: false,
    },
  },
};
